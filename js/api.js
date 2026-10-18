// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Client
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for auth
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Products
  getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  getProduct(slug) {
    return this.request(`/products/${slug}`);
  }

  getProductById(id) {
    return this.request(`/products/id/${id}`);
  }

  createProduct(data) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateProduct(id, data) {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  createOrder(data) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  trackOrder(orderReference, customerPhone) {
    return this.request('/orders/track', {
      method: 'POST',
      body: JSON.stringify({ orderReference, customerPhone }),
    });
  }

  getOrder(reference, phone) {
    return this.request(`/orders/${reference}?phone=${phone}`);
  }

  // Admin
  getDashboard() {
    return this.request('/admin/dashboard');
  }

  getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/orders?${queryString}`);
  }

  getOrderById(id) {
    return this.request(`/admin/orders/${id}`);
  }

  updateOrderStatus(id, data) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  archiveOrder(id) {
    return this.request(`/admin/orders/${id}/archive`, {
      method: 'POST',
    });
  }

  restoreOrder(id) {
    return this.request(`/admin/orders/${id}/restore`, {
      method: 'POST',
    });
  }

  getCategories() {
    return this.request('/admin/categories');
  }

  createCategory(data) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateCategory(id, data) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  getSettings() {
    return this.request('/settings');
  }

  updateSettings(data) {
    return this.request('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Auth
  adminLogin(username, password) {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  adminLogout() {
    return this.request('/auth/admin/logout', {
      method: 'POST',
    });
  }

  checkAdminSession() {
    return this.request('/auth/admin/check');
  }
}

// Create API client instance
const api = new ApiClient(API_BASE_URL);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
