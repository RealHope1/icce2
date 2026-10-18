// Admin Dashboard JavaScript

// Check authentication on load
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  initNavigation();
  initModals();
});

// Check authentication
async function checkAuth() {
  try {
    const response = await api.checkAdminSession();
    if (response.authenticated) {
      showDashboard(response.user);
    } else {
      showLogin();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showLogin();
  }
}

// Show login section
function showLogin() {
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('dashboardSection').style.display = 'none';
}

// Show dashboard section
function showDashboard(user) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'grid';
  document.getElementById('adminName').textContent = user.name;
  loadDashboard();
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  loginError.style.display = 'none';

  try {
    const response = await api.adminLogin(username, password);
    showDashboard(response.user);
  } catch (error) {
    loginError.textContent = error.message || 'Login failed';
    loginError.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await api.adminLogout();
    showLogin();
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('pageTitle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;

      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show corresponding tab
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tab + 'Tab') {
          content.classList.add('active');
        }
      });

      // Update page title
      pageTitle.textContent = link.textContent.trim();

      // Load content based on tab
      switch (tab) {
        case 'dashboard':
          loadDashboard();
          break;
        case 'orders':
          loadOrders();
          break;
        case 'products':
          loadProducts();
          break;
        case 'categories':
          loadCategories();
          break;
        case 'settings':
          loadSettings();
          break;
      }
    });
  });
}

// Load Dashboard
async function loadDashboard() {
  try {
    const data = await api.getDashboard();
    renderStats(data.statistics);
    renderRecentOrders(data.recentOrders);
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

// Render statistics
function renderStats(stats) {
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = `
    <div class="stat-card">
      <h3>Total Orders</h3>
      <div class="value">${stats.totalOrders}</div>
    </div>
    <div class="stat-card">
      <h3>New Orders</h3>
      <div class="value">${stats.newOrders}</div>
    </div>
    <div class="stat-card">
      <h3>Revenue</h3>
      <div class="value">GH₵${(stats.totalRevenue / 100).toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <h3>Low Stock</h3>
      <div class="value">${stats.lowStockProducts}</div>
    </div>
  `;
}

// Render recent orders
function renderRecentOrders(orders) {
  const container = document.getElementById('recentOrdersList');
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-info">
        <h3>${order.orderReference}</h3>
        <div class="order-meta">
          <span>${order.customerName}</span>
          <span>${new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <span class="order-status status-${order.orderStatus.toLowerCase()}">${order.orderStatus}</span>
    </div>
  `).join('');
}

// Load Orders
async function loadOrders() {
  try {
    const data = await api.getOrders();
    renderOrders(data.orders);
  } catch (error) {
    console.error('Orders error:', error);
  }
}

// Render orders
function renderOrders(orders) {
  const container = document.getElementById('ordersList');
  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-info">
        <h3>${order.orderReference}</h3>
        <div class="order-meta">
          <span>${order.customerName}</span>
          <span>${order.customerPhone}</span>
          <span>${new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="order-actions">
        <span class="order-status status-${order.orderStatus.toLowerCase()}">${order.orderStatus}</span>
        <button class="btn btn-secondary btn-sm" onclick="viewOrder('${order.id}')">View</button>
        <button class="btn btn-secondary btn-sm" onclick="archiveOrder('${order.id}')">Archive</button>
      </div>
    </div>
  `).join('');
}

// View order details
async function viewOrder(orderId) {
  try {
    const order = await api.getOrderById(orderId);
    showOrderModal(order);
  } catch (error) {
    console.error('View order error:', error);
  }
}

// Archive order
async function archiveOrder(orderId) {
  if (!confirm('Are you sure you want to archive this order?')) return;

  try {
    await api.archiveOrder(orderId);
    loadOrders();
  } catch (error) {
    console.error('Archive order error:', error);
    alert('Error archiving order: ' + error.message);
  }
}

// Show order modal
function showOrderModal(order) {
  const modal = document.getElementById('orderModal');
  const modalBody = document.getElementById('orderModalBody');

  modalBody.innerHTML = `
    <h2>Order ${order.orderReference}</h2>
    <div class="order-details">
      <div class="detail-section">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
      </div>
      <div class="detail-section">
        <h3>Delivery Information</h3>
        <p><strong>Address:</strong> ${order.deliveryAddress}</p>
        <p><strong>Region:</strong> ${order.deliveryRegion}</p>
        <p><strong>Town:</strong> ${order.deliveryTown}</p>
        <p><strong>Method:</strong> ${order.deliveryMethod}</p>
      </div>
      <div class="detail-section">
        <h3>Order Items</h3>
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.productName} x${item.quantity}</span>
            <span>GH₵${(item.lineTotal / 100).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="detail-section">
        <h3>Order Summary</h3>
        <p><strong>Subtotal:</strong> GH₵${(order.subtotal / 100).toFixed(2)}</p>
        <p><strong>Delivery Fee:</strong> GH₵${(order.deliveryFee / 100).toFixed(2)}</p>
        <p><strong>Total:</strong> GH₵${(order.totalAmount / 100).toFixed(2)}</p>
      </div>
      <div class="detail-section">
        <h3>Update Status</h3>
        <select id="orderStatusSelect">
          <option value="PENDING" ${order.orderStatus === 'PENDING' ? 'selected' : ''}>Pending</option>
          <option value="CONFIRMED" ${order.orderStatus === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
          <option value="PROCESSING" ${order.orderStatus === 'PROCESSING' ? 'selected' : ''}>Processing</option>
          <option value="READY_FOR_DISPATCH" ${order.orderStatus === 'READY_FOR_DISPATCH' ? 'selected' : ''}>Ready for Dispatch</option>
          <option value="DISPATCHED" ${order.orderStatus === 'DISPATCHED' ? 'selected' : ''}>Dispatched</option>
          <option value="OUT_FOR_DELIVERY" ${order.orderStatus === 'OUT_FOR_DELIVERY' ? 'selected' : ''}>Out for Delivery</option>
          <option value="DELIVERED" ${order.orderStatus === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
          <option value="CANCELLED" ${order.orderStatus === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
        </select>
        <textarea id="statusNotes" placeholder="Status notes (optional)" rows="2"></textarea>
        <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}')">Update Status</button>
        <button class="btn btn-secondary" onclick="archiveOrder('${order.id}')">Archive Order</button>
      </div>
    </div>
  `;

  modal.setAttribute('aria-hidden', 'false');
}

// Update order status
async function updateOrderStatus(orderId) {
  const status = document.getElementById('orderStatusSelect').value;
  const notes = document.getElementById('statusNotes').value;

  try {
    await api.updateOrderStatus(orderId, { status, notes });
    closeModal('orderModal');
    loadOrders();
  } catch (error) {
    console.error('Update status error:', error);
    alert('Error updating status: ' + error.message);
  }
}

// Load Products
async function loadProducts() {
  try {
    const data = await api.getProducts();
    renderProducts(data.products);
  } catch (error) {
    console.error('Products error:', error);
  }
}

// Render products
function renderProducts(products) {
  const container = document.getElementById('productsList');
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${product.name}</h3>
      <div class="product-meta">
        <span>${product.category.name}</span>
        <span>Stock: ${product.stockQuantity}</span>
      </div>
      <div class="product-price">
        GH₵${((product.salePrice || product.regularPrice) / 100).toFixed(2)}
      </div>
      <div class="product-actions">
        <button class="btn btn-secondary btn-sm" onclick="editProduct('${product.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add product button
document.getElementById('addProductBtn').addEventListener('click', async () => {
  await loadCategoriesForSelect();
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('productForm').reset();
  openModal('productModal');
});

// Edit product
async function editProduct(productId) {
  await loadCategoriesForSelect();
  try {
    const product = await api.getProductById(productId);
    document.getElementById('productModalTitle').textContent = 'Edit Product';

    // Populate form
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.categoryId;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('regularPrice').value = (product.regularPrice / 100).toFixed(2);
    document.getElementById('salePrice').value = product.salePrice ? (product.salePrice / 100).toFixed(2) : '';
    document.getElementById('stockQuantity').value = product.stockQuantity;
    document.getElementById('sku').value = product.sku || '';
    document.getElementById('imageUrl').value = product.images[0]?.imageUrl || '';

    // Set checkboxes
    document.querySelector('[name="isFeatured"]').checked = product.isFeatured;
    document.querySelector('[name="isNewArrival"]').checked = product.isNewArrival;
    document.querySelector('[name="isBestSeller"]').checked = product.isBestSeller;
    document.querySelector('[name="isPublished"]').checked = product.isPublished;

    // Store product ID for update
    document.getElementById('productForm').dataset.productId = productId;

    openModal('productModal');
  } catch (error) {
    console.error('Load product error:', error);
    alert('Error loading product: ' + error.message);
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await api.deleteProduct(productId);
    loadProducts();
  } catch (error) {
    console.error('Delete product error:', error);
    alert('Error deleting product: ' + error.message);
  }
}

// Product form submission
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const isEdit = document.getElementById('productModalTitle').textContent === 'Edit Product';
  const productId = isEdit ? document.getElementById('productForm').dataset.productId : null;

  const data = {
    name: formData.get('name'),
    categoryId: formData.get('categoryId'),
    description: formData.get('description'),
    regularPrice: Math.round(parseFloat(formData.get('regularPrice')) * 100),
    salePrice: formData.get('salePrice') ? Math.round(parseFloat(formData.get('salePrice')) * 100) : null,
    stockQuantity: parseInt(formData.get('stockQuantity')),
    sku: formData.get('sku') || null,
    isFeatured: formData.get('isFeatured') === 'on',
    isNewArrival: formData.get('isNewArrival') === 'on',
    isBestSeller: formData.get('isBestSeller') === 'on',
    isPublished: formData.get('isPublished') === 'on',
    images: [{
      imageUrl: formData.get('imageUrl'),
      isPrimary: true,
    }],
  };

  try {
    if (isEdit && productId) {
      await api.updateProduct(productId, data);
    } else {
      await api.createProduct(data);
    }
    closeModal('productModal');
    loadProducts();
  } catch (error) {
    console.error('Save product error:', error);
    alert('Error saving product: ' + error.message);
  }
});

// Load Categories
async function loadCategories() {
  try {
    const categories = await api.getCategories();
    renderCategories(categories);
  } catch (error) {
    console.error('Categories error:', error);
  }
}

// Render categories
function renderCategories(categories) {
  const container = document.getElementById('categoriesList');
  container.innerHTML = categories.map(category => `
    <div class="category-card">
      <div>
        <h3>${category.name}</h3>
        <div class="category-meta">
          <span>Slug: ${category.slug}</span>
          <span>Products: ${category._count.products}</span>
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-secondary btn-sm" onclick="editCategory('${category.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" onclick="deleteCategory('${category.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add category button
document.getElementById('addCategoryBtn').addEventListener('click', () => {
  document.getElementById('categoryModalTitle').textContent = 'Add Category';
  document.getElementById('categoryForm').reset();
  delete document.getElementById('categoryForm').dataset.categoryId;
  openModal('categoryModal');
});

// Category form submission
document.getElementById('categoryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const isEdit = document.getElementById('categoryModalTitle').textContent === 'Edit Category';
  const categoryId = document.getElementById('categoryForm').dataset.categoryId;

  const data = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || null,
    displayOrder: parseInt(formData.get('displayOrder')),
  };

  try {
    if (isEdit && categoryId) {
      await api.updateCategory(categoryId, data);
    } else {
      await api.createCategory(data);
    }
    closeModal('categoryModal');
    loadCategories();
  } catch (error) {
    console.error('Save category error:', error);
    alert('Error saving category: ' + error.message);
  }
});

// Delete category
async function deleteCategory(categoryId) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    await api.deleteCategory(categoryId);
    loadCategories();
  } catch (error) {
    console.error('Delete category error:', error);
    alert('Error deleting category: ' + error.message);
  }
}

// Edit category
async function editCategory(categoryId) {
  try {
    const categories = await api.getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
      alert('Category not found');
      return;
    }

    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('displayOrder').value = category.displayOrder;

    // Store category ID for update
    document.getElementById('categoryForm').dataset.categoryId = categoryId;

    openModal('categoryModal');
  } catch (error) {
    console.error('Load category error:', error);
    alert('Error loading category: ' + error.message);
  }
}

// Load Settings
async function loadSettings() {
  try {
    const settings = await api.getSettings();
    populateSettingsForm(settings);
  } catch (error) {
    console.error('Settings error:', error);
  }
}

// Populate settings form
function populateSettingsForm(settings) {
  document.getElementById('businessName').value = settings.businessName || '';
  document.getElementById('businessDescription').value = settings.businessDescription || '';
  document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
  document.getElementById('email').value = settings.email || '';
  document.getElementById('phone').value = settings.phone || '';
  document.getElementById('address').value = settings.address || '';
  document.getElementById('announcementText').value = settings.announcementText || '';
  document.getElementById('businessHours').value = settings.businessHours || '';
}

// Settings form submission
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    businessName: formData.get('businessName'),
    businessDescription: formData.get('businessDescription'),
    whatsappNumber: formData.get('whatsappNumber'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    announcementText: formData.get('announcementText'),
    businessHours: formData.get('businessHours'),
  };

  try {
    await api.updateSettings(data);
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Update settings error:', error);
    alert('Error saving settings: ' + error.message);
  }
});

// Load categories for select dropdown
async function loadCategoriesForSelect() {
  try {
    const categories = await api.getCategories();
    const select = document.getElementById('productCategory');
    select.innerHTML = categories.map(cat =>
      `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
  } catch (error) {
    console.error('Load categories error:', error);
  }
}

// Modal functions
function initModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtns = modal.querySelectorAll('.cancel-btn');

    overlay.addEventListener('click', () => closeModal(modal.id));
    closeBtn.addEventListener('click', () => closeModal(modal.id));
    cancelBtns.forEach(btn => btn.addEventListener('click', () => closeModal(modal.id)));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal(modal.id);
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Order filters
document.getElementById('applyOrderFilters').addEventListener('click', async () => {
  const search = document.getElementById('orderSearch').value;
  const status = document.getElementById('orderStatusFilter').value;

  try {
    const data = await api.getOrders({ search, status });
    renderOrders(data.orders);
  } catch (error) {
    console.error('Filter orders error:', error);
  }
});

// Make functions available globally
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.archiveOrder = archiveOrder;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
