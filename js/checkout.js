// Checkout Logic

// Format price
function formatPrice(amount, currency = 'GHS') {
  const majorUnits = amount / 100;
  return `${currency} ${majorUnits.toFixed(2)}`;
}

// Normalize phone number
function normalizePhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '+233' + digits.substring(1);
  }
  if (digits.startsWith('233')) {
    return '+' + digits;
  }
  if (digits.startsWith('+233')) {
    return digits;
  }
  return '+233' + digits;
}

// Render order items
function renderOrderItems() {
  const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
  const orderItemsContainer = document.getElementById('orderItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutForm = document.getElementById('checkoutForm');

  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    checkoutForm.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  checkoutForm.style.display = 'block';

  orderItemsContainer.innerHTML = cart.map(item => {
    const price = item.salePrice || item.regularPrice;
    const lineTotal = price * item.quantity;
    const hasDiscount = item.salePrice && item.salePrice < item.regularPrice;

    return `
      <div class="order-item">
        <div class="order-item-info">
          <span class="item-name">${item.productName}</span>
          ${item.variantName ? `<span class="item-variant">${item.variantName}</span>` : ''}
          <span class="item-quantity">Qty: ${item.quantity}</span>
        </div>
        <div class="order-item-price">
          ${hasDiscount
            ? `<span class="price-original">${formatPrice(item.regularPrice, item.currency)}</span> <span class="price-sale">${formatPrice(item.salePrice, item.currency)}</span>`
            : `<span class="price-regular">${formatPrice(item.regularPrice, item.currency)}</span>`
          }
          <span class="item-total">${formatPrice(lineTotal, item.currency)}</span>
        </div>
      </div>
    `;
  }).join('');

  // Update totals
  const subtotal = cart.reduce((total, item) => {
    const price = item.salePrice || item.regularPrice;
    return total + (price * item.quantity);
  }, 0);

  const deliveryMethod = document.getElementById('deliveryMethod').value;
  const deliveryFee = deliveryMethod === 'PICKUP' ? 0 : 2000; // GH₵20 default
  const total = subtotal + deliveryFee;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('deliveryFee').textContent = formatPrice(deliveryFee);
  document.getElementById('total').textContent = formatPrice(total);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  const deliveryMethodSelect = document.getElementById('deliveryMethod');

  // Render order items
  renderOrderItems();

  // Update delivery fee when method changes
  deliveryMethodSelect.addEventListener('change', renderOrderItems);

  // Handle form submission
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const submitBtn = document.getElementById('submitOrder');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      // Prepare order data
      const orderData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: normalizePhoneNumber(document.getElementById('customerPhone').value),
        customerEmail: document.getElementById('customerEmail').value || null,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        deliveryRegion: document.getElementById('deliveryRegion').value,
        deliveryTown: document.getElementById('deliveryTown').value,
        deliveryInstructions: document.getElementById('deliveryInstructions').value || null,
        deliveryMethod: document.getElementById('deliveryMethod').value,
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      // Submit order to API
      const response = await api.createOrder(orderData);

      // Clear cart
      localStorage.removeItem('luxe_cart');

      // Show confirmation
      showConfirmation(response.order, response.whatsappMessage);

    } catch (error) {
      console.error('Order error:', error);
      alert('Error placing order: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  });
});

// Show order confirmation
function showConfirmation(order, whatsappMessage) {
  const modal = document.getElementById('confirmationModal');
  const modalBody = document.getElementById('modalBody');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  modalBody.innerHTML = `
    <div class="confirmation-content">
      <div class="success-icon">✓</div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your order.</p>

      <div class="confirmation-details">
        <div class="detail-row">
          <span>Order Reference:</span>
          <strong>${order.orderReference}</strong>
        </div>
        <div class="detail-row">
          <span>Total Amount:</span>
          <strong>${formatPrice(order.totalAmount, order.currency)}</strong>
        </div>
        <div class="detail-row">
          <span>Delivery:</span>
          <strong>${order.deliveryRegion}, ${order.deliveryTown}</strong>
        </div>
      </div>

      <div class="confirmation-actions">
        <a href="tracking.html" class="btn btn-primary btn-full">
          Track Your Order
        </a>
        <a href="https://wa.me/233247559387?text=${encodeURIComponent(whatsappMessage)}" target="_blank" class="btn btn-whatsapp btn-full">
          <span class="whatsapp-icon">📱</span>
          Confirm Order on WhatsApp
        </a>
        <a href="index.html" class="btn btn-secondary btn-full">
          Return to Home
        </a>
      </div>
    </div>
  `;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Close modal
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
