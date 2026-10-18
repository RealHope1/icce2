// Shopping Cart Management

// Cart state
let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];

// Format price
function formatPrice(amount, currency = 'GHS') {
  const majorUnits = amount / 100;
  return `${currency} ${majorUnits.toFixed(2)}`;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product, variant = null, quantity = 1) {
  const existingItem = cart.find(
    item => item.productId === product.id && item.variantId === (variant ? variant.id : null)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      productName: product.name,
      productImage: product.images && product.images.length > 0
        ? (product.images.find(img => img.isPrimary) || product.images[0]).imageUrl
        : null,
      variantId: variant ? variant.id : null,
      variantName: variant ? variant.name : null,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      currency: product.currency,
      quantity,
    });
  }

  saveCart();
  updateCartCount();
}

// Remove item from cart
function removeFromCart(productId, variantId = null) {
  cart = cart.filter(
    item => !(item.productId === productId && item.variantId === variantId)
  );
  saveCart();
  updateCartCount();
  renderCart();
}

// Update item quantity
function updateQuantity(productId, variantId, newQuantity) {
  const item = cart.find(
    item => item.productId === productId && item.variantId === variantId
  );

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      item.quantity = newQuantity;
      saveCart();
      renderCart();
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((total, item) => {
    const price = item.salePrice || item.regularPrice;
    return total + (price * item.quantity);
  }, 0);
}

// Get cart count
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count in navigation
function updateCartCount() {
  const count = getCartCount();
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = count;
    cartCountElement.style.display = count > 0 ? 'inline' : 'none';
  }
}

// Render cart
function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    emptyCart.style.display = 'block';
    checkoutBtn.disabled = true;
    return;
  }

  emptyCart.style.display = 'none';
  checkoutBtn.disabled = false;

  cartItemsContainer.innerHTML = cart.map(item => {
    const price = item.salePrice || item.regularPrice;
    const lineTotal = price * item.quantity;
    const hasDiscount = item.salePrice && item.salePrice < item.regularPrice;

    return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.productImage || 'assets/images/placeholder.jpg'}" alt="${item.productName}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.productName}</h3>
          ${item.variantName ? `<p class="cart-item-variant">${item.variantName}</p>` : ''}
          <div class="cart-item-price">
            ${hasDiscount
              ? `<span class="price-original">${formatPrice(item.regularPrice, item.currency)}</span> <span class="price-sale">${formatPrice(item.salePrice, item.currency)}</span>`
              : `<span class="price-regular">${formatPrice(item.regularPrice, item.currency)}</span>`
            }
          </div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity - 1})">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          <span class="line-total">${formatPrice(lineTotal, item.currency)}</span>
          <button class="remove-btn" onclick="removeFromCart('${item.productId}', '${item.variantId}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Update summary
  const subtotal = getCartTotal();
  const deliveryFee = 2000; // GH₵20 default
  const total = subtotal + deliveryFee;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('deliveryFee').textContent = formatPrice(deliveryFee);
  document.getElementById('total').textContent = formatPrice(total);
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
