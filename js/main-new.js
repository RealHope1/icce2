// Luxe by Icce - Main JavaScript (API Version)

// WhatsApp Configuration
const WHATSAPP_NUMBER = '233247559387';
const WHATSAPP_DISPLAY = '024 755 9387';

// Format price from minor units to currency string
function formatPrice(amount, currency = 'GHS') {
  const majorUnits = amount / 100;
  return `${currency} ${majorUnits.toFixed(2)}`;
}

// Calculate discount percentage
function calculateDiscountPercent(regularPrice, salePrice) {
  if (regularPrice <= 0) return 0;
  const discount = regularPrice - salePrice;
  return Math.round((discount / regularPrice) * 100);
}

// WhatsApp message generator
function generateWhatsAppMessage(product, variation = null) {
  let message = `Hello Luxe by Icce! 👋\n\nI'm interested in:\n\n${product.name}\nPrice: ${formatPrice(product.salePrice || product.regularPrice, product.currency)}\n\nPlease provide:\n• Availability\n• Delivery options\n• Any current promotions\n\nLooking forward to hearing from you!`;
  if (variation) {
    message += `\n\nSelected: ${variation}`;
  }
  return encodeURIComponent(message);
}

// WhatsApp URL generator
function getWhatsAppURL(product, variation = null) {
  const message = generateWhatsAppMessage(product, variation);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// WhatsApp share URL for products
function getWhatsAppShareURL(product) {
  const message = encodeURIComponent(
    `Check out this beautiful item at Luxe by Icce!\n\n${product.name}\nPrice: ${formatPrice(product.salePrice || product.regularPrice, product.currency)}\n\nShop here: ${window.location.href}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// Hero Carousel
class HeroCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    this.indicators = container.querySelector('.carousel-indicators');
    this.currentIndex = 0;
    this.slides = [];

    this.init();
  }

  init() {
    // Create slides from assets
    const images = ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg'];

    images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';

      const img = document.createElement('img');
      img.src = `assets/images/${image}`;
      img.alt = `Luxe by Icce - Slide ${index + 1}`;
      img.loading = 'lazy';
      slide.appendChild(img);

      this.track.appendChild(slide);
      this.slides.push(slide);

      // Create indicator
      const indicator = document.createElement('div');
      indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicators.appendChild(indicator);
    });

    // Event listeners
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlide();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  updateSlide() {
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // Update indicators
    const indicators = this.indicators.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
}

// Render product card
function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const primaryImage = product.images && product.images.length > 0
    ? product.images.find(img => img.isPrimary) || product.images[0]
    : null;

  const imageUrl = primaryImage ? primaryImage.imageUrl : 'assets/images/placeholder.jpg';

  const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = hasDiscount ? calculateDiscountPercent(product.regularPrice, product.salePrice) : 0;

  card.innerHTML = `
    <div class="product-image">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
      <div class="product-badges">
        ${product.isNewArrival ? '<span class="product-badge badge-new">New Release</span>' : ''}
        ${product.isFeatured ? '<span class="product-badge badge-featured">Featured</span>' : ''}
        ${hasDiscount ? `<span class="product-badge badge-sale">SAVE ${discountPercent}%</span>` : ''}
      </div>
    </div>
    <div class="product-info">
      <p class="product-category">${product.category.name}</p>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">
        ${hasDiscount
          ? `<span class="price-original">${formatPrice(product.regularPrice, product.currency)}</span> <span class="price-sale">${formatPrice(product.salePrice, product.currency)}</span>`
          : `<span class="price-regular">${formatPrice(product.regularPrice, product.currency)}</span>`
        }
      </div>
      <div class="product-actions">
        <a href="${getWhatsAppURL(product)}" target="_blank" class="btn btn-whatsapp btn-sm">
          📱 Enquire on WhatsApp
        </a>
        <button class="btn btn-secondary btn-sm share-btn" data-product-slug="${product.slug}">
          Share
        </button>
      </div>
    </div>
  `;

  // Add share functionality
  const shareBtn = card.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      window.open(getWhatsAppShareURL(product), '_blank');
    });
  }

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.product-actions')) {
      // Open product modal
      if (window.productModal) {
        window.productModal.open(product);
      }
    }
  });

  return card;
}

// Product Modal
class ProductModal {
  constructor() {
    this.modal = document.getElementById('productModal');
    this.overlay = document.getElementById('modalOverlay');
    this.closeBtn = document.getElementById('modalClose');
    this.body = document.getElementById('modalBody');
    this.currentProduct = null;

    this.init();
  }

  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(product) {
    this.currentProduct = product;

    const primaryImage = product.images && product.images.length > 0
      ? product.images.find(img => img.isPrimary) || product.images[0]
      : null;

    const imageUrl = primaryImage ? primaryImage.imageUrl : 'assets/images/placeholder.jpg';

    const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;
    const discountPercent = hasDiscount ? calculateDiscountPercent(product.regularPrice, product.salePrice) : 0;

    let variantsHtml = '';
    if (product.variants && product.variants.length > 0) {
      variantsHtml = `
        <div class="product-variants">
          <h4>Available Variants</h4>
          <div class="variants-list">
            ${product.variants.filter(v => v.isActive).map(variant => `
              <div class="variant-item">
                <span class="variant-name">${variant.name}</span>
                <span class="variant-stock">${variant.stock > 0 ? `In Stock (${variant.stock})` : 'Out of Stock'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    this.body.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-media">
          <img src="${imageUrl}" alt="${product.name}" loading="lazy">
        </div>
        <div class="modal-details">
          <p class="product-category">${product.category.name}</p>
          <h2 class="product-name">${product.name}</h2>
          <p class="product-description">${product.description}</p>
          <div class="product-price">
            ${hasDiscount
              ? `<span class="price-original">${formatPrice(product.regularPrice, product.currency)}</span> <span class="price-sale">${formatPrice(product.salePrice, product.currency)}</span> <span class="discount-badge">SAVE ${discountPercent}%</span>`
              : `<span class="price-regular">${formatPrice(product.regularPrice, product.currency)}</span>`
            }
          </div>
          <p class="stock-status">${product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}</p>
          ${variantsHtml}
          <div class="modal-actions">
            <a href="${getWhatsAppURL(product)}" target="_blank" class="btn btn-whatsapp">
              <span class="whatsapp-icon">📱</span>
              Enquire on WhatsApp
            </a>
            <button class="btn btn-secondary share-product-btn">
              Share Product
            </button>
          </div>
        </div>
      </div>
    `;

    // Add share functionality
    const shareBtn = this.body.querySelector('.share-product-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        window.open(getWhatsAppShareURL(product), '_blank');
      });
    }

    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        const otherQuestion = otherItem.querySelector('.faq-question');
        otherQuestion.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      question.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }
}

// Catalogue Page
async function initCatalogue() {
  const grid = document.getElementById('catalogueGrid');
  const searchInput = document.getElementById('searchInput');
  const sortFilter = document.getElementById('sortFilter');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');

  let allProducts = [];

  // Load products from API
  async function loadProducts(params = {}) {
    try {
      loadingState.style.display = 'block';
      grid.innerHTML = '';

      const response = await api.getProducts(params);
      allProducts = response.products;

      renderProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      emptyState.style.display = 'block';
      emptyState.querySelector('p').textContent = 'Error loading products. Please try again.';
    } finally {
      loadingState.style.display = 'none';
    }
  }

  function renderProducts(products) {
    grid.innerHTML = '';

    if (products.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      products.forEach(product => {
        grid.appendChild(renderProductCard(product));
      });
    }
  }

  // Filter and render
  function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortFilter.value;

    let filtered = allProducts.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      return matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener('input', filterAndRender);
  sortFilter.addEventListener('change', filterAndRender);

  // Initial load
  await loadProducts();
}

// Homepage
async function initHomepage() {
  // Hero Carousel
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    new HeroCarousel(carousel);
  }

  // New Arrivals
  const newArrivalsGrid = document.getElementById('newArrivalsGrid');
  if (newArrivalsGrid) {
    try {
      const response = await api.getProducts({ newArrival: 'true', limit: '8' });
      response.products.forEach(product => {
        newArrivalsGrid.appendChild(renderProductCard(product));
      });
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    }
  }

  // Editorial Gallery
  const editorialGallery = document.getElementById('editorialGallery');
  if (editorialGallery) {
    const videos = ['2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4'];

    videos.forEach(video => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const videoElement = document.createElement('video');
      videoElement.src = `assets/videos/${video}`;
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.loading = 'lazy';
      div.appendChild(videoElement);
      editorialGallery.appendChild(div);
    });
  }

  // FAQ
  initFAQ();
}

// Chatbot
function initChatbot() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotBody = document.getElementById('chatbotBody');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  // Toggle chatbot
  chatbotToggle.addEventListener('click', () => {
    chatbotBody.classList.toggle('active');
    chatbotToggle.textContent = chatbotBody.classList.contains('active') ? 'Close' : 'Chat';
  });

  // Send message
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Get bot response
    const response = getBotResponse(message);
    setTimeout(() => {
      addMessage(response.text, 'bot');
      if (response.whatsapp) {
        addWhatsAppLink();
      }
    }, 500);
  }

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function addWhatsAppLink() {
    const linkDiv = document.createElement('div');
    linkDiv.className = 'chat-message whatsapp-link';
    linkDiv.innerHTML = `<a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank">Continue on WhatsApp 💬</a>`;
    chatbotMessages.appendChild(linkDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        text: 'For accurate pricing and availability, please contact us on WhatsApp. Our team will provide you with the most up-to-date information.',
        whatsapp: true,
      };
    }

    if (lowerMessage.includes('order') || lowerMessage.includes('buy')) {
      return {
        text: 'To place an order, browse our products and click "Enquire on WhatsApp". We\'ll guide you through the ordering process.',
        whatsapp: true,
      };
    }

    if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return {
        text: 'We deliver throughout Ghana. Delivery fees and timing depend on your location. Contact us on WhatsApp for specific delivery information.',
        whatsapp: true,
      };
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return {
        text: 'Our return policy allows returns within 7 days of delivery for eligible items. Contact us on WhatsApp for return requests.',
        whatsapp: true,
      };
    }

    return {
      text: 'I\'m here to help! For detailed enquiries about products, pricing, or orders, I recommend continuing the conversation on WhatsApp for faster assistance.',
      whatsapp: true,
    };
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize product modal globally
  window.productModal = new ProductModal();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize based on current page
  const path = window.location.pathname;
  if (path.includes('catalogue.html') || path.endsWith('/catalogue')) {
    await initCatalogue();
  } else if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/index')) {
    await initHomepage();
    initChatbot();
  }
});
