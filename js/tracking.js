// Order Tracking Logic

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

// Status order for timeline
const statusOrder = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_DISPATCH',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

// Format status for display
function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Handle tracking form submission
document.addEventListener('DOMContentLoaded', () => {
  const trackingForm = document.getElementById('trackingForm');
  const trackBtn = document.getElementById('trackBtn');

  trackingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const orderReference = document.getElementById('orderReference').value.trim().toUpperCase();
    const customerPhone = normalizePhoneNumber(document.getElementById('customerPhone').value);

    trackBtn.disabled = true;
    trackBtn.textContent = 'Tracking...';

    try {
      const result = await api.trackOrder(orderReference, customerPhone);
      displayTrackingResult(result);
    } catch (error) {
      console.error('Tracking error:', error);
      document.getElementById('trackingError').style.display = 'block';
      document.getElementById('trackingResult').style.display = 'none';
    } finally {
      trackBtn.disabled = false;
      trackBtn.textContent = 'Track Order';
    }
  });
});

// Display tracking result
function displayTrackingResult(result) {
  const trackingResult = document.getElementById('trackingResult');
  const trackingError = document.getElementById('trackingError');

  trackingError.style.display = 'none';
  trackingResult.style.display = 'block';

  // Display order reference
  document.getElementById('displayOrderRef').textContent = result.orderReference;

  // Display current status
  document.getElementById('currentStatus').textContent = formatStatus(result.orderStatus);

  // Display last updated
  document.getElementById('lastUpdated').textContent = `Last updated: ${new Date(result.updatedAt).toLocaleString('en-GH')}`;

  // Build status timeline
  const timeline = document.getElementById('statusTimeline');
  const currentIndex = statusOrder.indexOf(result.orderStatus);

  if (currentIndex === -1) {
    // Handle cancelled or other statuses
    timeline.innerHTML = `
      <div class="timeline-step ${result.orderStatus === 'DELIVERED' ? 'completed' : 'active'}">
        <div class="step-dot">${result.orderStatus === 'DELIVERED' ? '✓' : '⚠'}</div>
        <span>${formatStatus(result.orderStatus)}</span>
      </div>
    `;
  } else {
    timeline.innerHTML = statusOrder.map((status, index) => {
      let className = '';
      if (index < currentIndex) className = 'completed';
      else if (index === currentIndex) className = 'active';
      return `
        <div class="timeline-step ${className}">
          <div class="step-dot">${index < currentIndex ? '✓' : index + 1}</div>
          <span>${formatStatus(status)}</span>
        </div>
      `;
    }).join('');
  }

  // Display order items
  const orderItems = document.getElementById('orderItems');
  orderItems.innerHTML = result.items.map(item => `
    <div class="order-item-mini">
      <span class="item-name">${item.productName}</span>
      <span class="item-qty">x${item.quantity}</span>
      <span class="item-price">${item.unitPrice}</span>
    </div>
  `).join('');

  // Display delivery information
  document.getElementById('deliveryRegion').textContent = result.deliveryRegion;
  document.getElementById('deliveryTown').textContent = result.deliveryTown;
  document.getElementById('deliveryMethod').textContent = result.deliveryMethod === 'DELIVERY' ? 'Door-to-Door Delivery' : 'Pickup from Store';

  // Display total
  document.getElementById('orderTotal').textContent = result.totalAmount;
}
