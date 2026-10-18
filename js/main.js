// Luxe by Icce - Main JavaScript

// WhatsApp Configuration
const WHATSAPP_NUMBER = '233247559387';
const WHATSAPP_DISPLAY = '024 755 9387';

// Sample Product Data - Images Only
const sampleProducts = [
    { id: 1, image: '1.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 2, image: '2.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 3, image: '3.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 4, image: '4.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 5, image: '5.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 6, image: '6.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 7, image: '7.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 8, image: '8.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 9, image: '9.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 10, image: '10.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 11, image: '11.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 12, image: '12.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 13, image: '13.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 14, image: '14.jpeg', new: true, published: true, createdAt: new Date().toISOString() },
    { id: 15, image: '15.jpeg', new: true, published: true, createdAt: new Date().toISOString() }
];

// Sample Orders for tracking (stored in localStorage)
const sampleOrders = [
    {
        id: 1,
        trackingCode: 'LXE-2024-ABC123',
        customer: 'Ama Mensah',
        phone: '0241234567',
        products: 'Elegant Gold Necklace x1, Designer Handbag x1',
        status: 'Delivered',
        notes: 'Delivered to Accra',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-18T14:30:00Z'
    },
    {
        id: 2,
        trackingCode: 'LXE-2024-DEF456',
        customer: 'Kwame Asante',
        phone: '0249876543',
        products: 'Classic Watch x1, Leather Belt x1',
        status: 'Dispatched',
        notes: 'Shipped to Kumasi',
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-22T11:00:00Z'
    },
    {
        id: 3,
        trackingCode: 'LXE-2024-GHI789',
        customer: 'Efua Osei',
        phone: '0245555555',
        products: 'Silk Evening Dress x1',
        status: 'Processing',
        notes: 'Being prepared',
        createdAt: '2024-01-22T08:00:00Z',
        updatedAt: '2024-01-22T08:00:00Z'
    }
];

// Initialize localStorage
function initializeData() {
    if (!localStorage.getItem('luxe_products')) {
        localStorage.setItem('luxe_products', JSON.stringify(sampleProducts));
    }
    if (!localStorage.getItem('luxe_orders')) {
        localStorage.setItem('luxe_orders', JSON.stringify(sampleOrders));
    }
    if (!localStorage.getItem('luxe_settings')) {
        localStorage.setItem('luxe_settings', JSON.stringify({
            businessName: 'Luxe by Icce',
            businessDescription: 'Your destination for elegance, style, and quality.',
            whatsappNumber: WHATSAPP_NUMBER,
            announcementText: 'Welcome to Luxe by Icce - Your destination for elegance and style',
            businessHours: ''
        }));
    }
}

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('luxe_products')) || [];
}

// Get orders from localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('luxe_orders')) || [];
}

// Get settings from localStorage
function getSettings() {
    return JSON.parse(localStorage.getItem('luxe_settings')) || {};
}

// WhatsApp message generator - Enhanced
function generateWhatsAppMessage(product, variation = null) {
    let message = `Hello Luxe by Icce! 👋\n\nI'm interested in your products. Please provide:\n• Current pricing\n• Availability\n• Product details\n• Delivery options\n\nItem reference: #${product.id}\n\nLooking forward to hearing from you!`;
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

// Hero Carousel - Simplified for Speed
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
        // Create slides from assets - static images only for speed
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

// Render product card - Image only
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="assets/images/${product.image}" alt="Product ${product.id}" loading="lazy">
            <div class="product-badges">
                ${product.new ? '<span class="product-badge badge-new">New Release</span>' : ''}
            </div>
        </div>
        <div class="product-info">
            <p class="product-price">Contact us on WhatsApp for pricing</p>
            <div class="product-actions">
                <a href="${getWhatsAppURL(product)}" target="_blank" class="btn btn-whatsapp btn-sm">
                    📱 Enquire on WhatsApp
                </a>
            </div>
        </div>
    `;
    return card;
}

// Render collection card
function renderCollectionCard(category, image) {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.innerHTML = `
        <img src="assets/images/${image}" alt="${category}" loading="lazy">
        <div class="collection-overlay">
            <h3>${category}</h3>
        </div>
    `;
    card.addEventListener('click', () => {
        window.location.href = 'catalogue.html';
    });
    return card;
}

// Product Modal - Simplified
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
        this.body.innerHTML = `
            <div class="modal-product-layout">
                <div class="modal-media">
                    <img src="assets/images/${product.image}" alt="Product ${product.id}" loading="lazy">
                </div>
                <div class="modal-details">
                    <h2 class="product-name">Product #${product.id}</h2>
                    <p class="product-description">Beautiful item from our collection. Contact us for full details and pricing.</p>
                    <p class="product-price">Contact us on WhatsApp for pricing and availability</p>
                    <div class="modal-actions">
                        <a href="${getWhatsAppURL(product)}" target="_blank" class="btn btn-whatsapp">
                            <span class="whatsapp-icon">📱</span>
                            Enquire on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
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
function initCatalogue() {
    const products = getProducts().filter(p => p.published);
    const grid = document.getElementById('catalogueGrid');
    const searchInput = document.getElementById('searchInput');
    const sortFilter = document.getElementById('sortFilter');
    const emptyState = document.getElementById('emptyState');
    const clearFiltersBtn = document.getElementById('clearFilters');

    // Filter and render products
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortFilter.value;

        let filtered = products.filter(product => {
            const matchesSearch = product.id.toString().includes(searchTerm);
            return matchesSearch;
        });

        // Sort
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'id-asc':
                filtered.sort((a, b) => a.id - b.id);
                break;
            case 'id-desc':
                filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                filtered.sort((a, b) => a.id - b.id);
                break;
        }

        grid.innerHTML = '';
        
        if (filtered.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filtered.forEach(product => {
                grid.appendChild(renderProductCard(product));
            });
        }
    }

    searchInput.addEventListener('input', filterAndRender);
    sortFilter.addEventListener('change', filterAndRender);
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        sortFilter.value = 'id-asc';
        filterAndRender();
    });

    // Initial render
    filterAndRender();
}

// Track Order Page
function initTrackOrder() {
    const form = document.getElementById('trackingForm');
    const resultSection = document.getElementById('trackingResult');
    const errorSection = document.getElementById('trackingError');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const trackingCode = document.getElementById('trackingCode').value.trim().toUpperCase();
        const orders = getOrders();
        const order = orders.find(o => o.trackingCode.toUpperCase() === trackingCode);

        resultSection.style.display = 'none';
        errorSection.style.display = 'none';

        if (order) {
            displayOrderResult(order);
        } else {
            errorSection.style.display = 'block';
        }
    });
}

function displayOrderResult(order) {
    const resultSection = document.getElementById('trackingResult');
    const displayCode = document.getElementById('displayTrackingCode');
    const currentStatus = document.getElementById('currentStatus');
    const lastUpdated = document.getElementById('lastUpdated');
    const timeline = document.getElementById('statusTimeline');

    displayCode.textContent = order.trackingCode;
    currentStatus.textContent = order.status;
    lastUpdated.textContent = new Date(order.updatedAt).toLocaleDateString('en-GH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Status order
    const statusOrder = [
        'Request Received',
        'Awaiting Business Verification',
        'Order Confirmed',
        'Processing',
        'Ready for Dispatch',
        'Dispatched',
        'Out for Delivery',
        'Delivered'
    ];

    const currentIndex = statusOrder.indexOf(order.status);
    if (currentIndex === -1) {
        // Handle cancelled or other statuses
        timeline.innerHTML = `
            <div class="timeline-step ${order.status === 'Delivered' ? 'completed' : 'active'}">
                <div class="step-dot">✓</div>
                <span>${order.status}</span>
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
                    <span>${status}</span>
                </div>
            `;
        }).join('');
    }

    resultSection.style.display = 'block';
}

// Homepage
function initHomepage() {
    const products = getProducts().filter(p => p.published);
    
    // Hero Carousel
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        new HeroCarousel(carousel);
    }


    // New Arrivals - Show all products
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid) {
        products.forEach(product => {
            newArrivalsGrid.appendChild(renderProductCard(product));
        });
    }

    // Editorial Gallery - Videos with autoplay
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

// Initialize
let productModal;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    initializeData();
    
    // Initialize based on current page
    const path = window.location.pathname;
    if (path.includes('catalogue.html') || path.endsWith('/catalogue')) {
        productModal = new ProductModal();
        initCatalogue();
    } else if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/index')) {
        productModal = new ProductModal();
        initHomepage();
        initChatbot();
    }
});

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
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Order related
    if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        return {
            text: 'To place an order, browse our product catalogue and click on any item. Use the WhatsApp button to enquire about pricing and availability. Our team will guide you through the process.',
            whatsapp: true
        };
    }

    // Price related
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return {
            text: 'We believe in personalized service. Prices vary based on availability and special requests. Contact us on WhatsApp for accurate and up-to-date pricing.',
            whatsapp: true
        };
    }

    // Track order
    if (lowerMessage.includes('track') || lowerMessage.includes('tracking') || lowerMessage.includes('status')) {
        return {
            text: 'Once your order is confirmed, you\'ll receive a unique tracking code. You can check your order status by contacting us on WhatsApp with your tracking code.',
            whatsapp: true
        };
    }

    // Payment
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
        return {
            text: 'We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and cash on delivery within Accra. Payment details are provided during the ordering process.',
            whatsapp: false
        };
    }

    // Shipping
    if (lowerMessage.includes('ship') || lowerMessage.includes('delivery') || lowerMessage.includes('outside ghana') || lowerMessage.includes('international')) {
        return {
            text: 'We deliver throughout Ghana. For international shipping requests, please contact us on WhatsApp to discuss options.',
            whatsapp: true
        };
    }

    // Product related
    if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('catalogue')) {
        return {
            text: 'We have a beautiful collection of bags and ladies slippers. Browse our catalogue to see all available items. Each item can be enquired about via WhatsApp.',
            whatsapp: false
        };
    }

    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('call')) {
        return {
            text: 'You can reach us on WhatsApp at 024 755 9387 or +233 247 559 387. We\'re available to help with any enquiries!',
            whatsapp: true
        };
    }

    // Default response
    return {
        text: 'I\'m here to help! You can ask me about ordering, pricing, payments, shipping, or our products. For detailed enquiries, I can connect you to WhatsApp.',
        whatsapp: true
    };
}
