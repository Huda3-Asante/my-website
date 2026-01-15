// Mashke Finesse Cart System - Updated for checkout
let cartItems = [];

// Cart summary data
let cartSummary = {
    subtotal: 0,
    taxRate: 0,
    deliveryFee: 0,
    discount: 0
};

// Delivery zones and fees
const deliveryZones = {
    'community-5': { name: 'Community 5', fee: 5, time: '15-20 mins' },
    'community-6': { name: 'Community 6', fee: 7, time: '20-25 mins' },
    'community-7': { name: 'Community 7', fee: 8, time: '25-30 mins' },
    'community-8': { name: 'Community 8', fee: 9, time: '30-35 mins' },
    'community-9': { name: 'Community 9', fee: 10, time: '35-40 mins' },
    'ashaiman': { name: 'Ashaiman', fee: 12, time: '40-50 mins' },
    'batsonaa': { name: 'Batsonaa', fee: 15, time: '45-55 mins' },
    'spintex': { name: 'Spintex', fee: 18, time: '50-60 mins' },
    'east-legon': { name: 'East Legon', fee: 20, time: '55-65 mins' },
    'accra-central': { name: 'Accra Central', fee: 25, time: '60-75 mins' }
};

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

function initCart() {
    loadCartFromStorage();
    
    // Only run cart-specific code if we're on cart.html
    if (document.getElementById('cartContent')) {
        loadCart();
    }
    
    // Update cart count on all pages
    updateCartCount();
}

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('mashkeCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cartItems = [];
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('mashkeCart', JSON.stringify(cartItems));
}

// Load cart page
function loadCart() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any delicious items to your cart yet. Browse our products and add some tasty treats!</p>
                <a href="products.html" class="shop-now-btn">
                    <i class="fas fa-utensils"></i> Browse Products
                </a>
            </div>
        `;
        return;
    }
    
    // Calculate totals
    calculateCartTotals();
    
    // Get delivery zone
    const savedZone = localStorage.getItem('deliveryZone') || 'community-5';
    const zoneData = deliveryZones[savedZone] || deliveryZones['community-5'];
    cartSummary.deliveryFee = zoneData.fee;
    
    // Render cart
    cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-section">
                <div class="cart-items-container">
                    ${renderCartItems()}
                </div>
            </div>
            
            <div class="cart-summary-section">
                <div class="cart-summary">
                    <h2>Order Summary</h2>
                    
                    <div class="summary-row">
                        <span>Subtotal (${getTotalItems()} items)</span>
                        <span>GHS ${cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div class="summary-row">
                        <span>Delivery Fee</span>
                        <span>GHS ${cartSummary.deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    ${cartSummary.discount > 0 ? `
                    <div class="summary-row" style="color: var(--secondary-color);">
                        <span>Discount</span>
                        <span>-GHS ${cartSummary.discount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>GHS ${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <div class="promo-code">
                        <h3>Have a promo code?</h3>
                        <div class="promo-input-group">
                            <input type="text" class="promo-input" id="promoCode" placeholder="Enter promo code">
                            <button class="apply-promo" onclick="applyPromoCode()">Apply</button>
                        </div>
                        <p id="promoMessage" style="font-size: 14px; margin-top: 8px;"></p>
                    </div>
                    
                    <button class="checkout-btn" onclick="proceedToCheckout()">
                        <i class="fas fa-lock"></i> Proceed to Checkout
                    </button>
                    
                    <a href="products.html" class="continue-shopping">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Render cart items
function renderCartItems() {
    return cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.name}">
            </div>
            
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-desc">${item.description || 'Delicious treat from Mashke Finesse'}</p>
                <div class="item-price">GHS ${item.price.toFixed(2)}</div>
            </div>
            
            <div class="item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                
                <button class="remove-item" onclick="removeItem('${item.id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Update quantity
function updateQuantity(itemId, newQuantity) {
    newQuantity = Number.parseInt(newQuantity);
    if (Number.isNaN(newQuantity) || newQuantity < 1) {
        removeItem(itemId);
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = newQuantity;
        saveCartToStorage();
        loadCart();
        updateCartCount();
    }
}

// Remove item
function removeItem(itemId) {
    if (confirm("Remove this item from cart?")) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        saveCartToStorage();
        loadCart();
        updateCartCount();
    }
}

// Calculate totals
function calculateCartTotals() {
    cartSummary.subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateTotal() {
    return cartSummary.subtotal + cartSummary.deliveryFee - cartSummary.discount;
}

function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count, #cartCount');
    const totalItems = getTotalItems();
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    });
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    
    if (!promoInput || !promoMessage) return;
    
    const promoCode = promoInput.value.toUpperCase();
    const validPromos = {
        'MASHKE10': 10,
        'FINANCE15': 15,
        'WELCOME5': 5
    };
    
    if (validPromos[promoCode]) {
        cartSummary.discount = validPromos[promoCode];
        promoMessage.textContent = `GHS ${cartSummary.discount.toFixed(2)} discount applied!`;
        promoMessage.style.color = "var(--secondary-color)";
        loadCart();
    } else {
        promoMessage.textContent = "Invalid code. Try MASHKE10, FINANCE15, or WELCOME5";
        promoMessage.style.color = "var(--primary-color)";
    }
}

// PROCEED TO CHECKOUT - REDIRECT TO CHECKOUT PAGE
function proceedToCheckout() {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Add items first!");
        return;
    }
    
    // Save current cart state
    saveCartToStorage();
    
    // Redirect to checkout page
    globalThis.location.href = "checkout.html";
}

// Add to cart function
function addToCart(product, redirect = true) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity || 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description || '',
            quantity: product.quantity || 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
    
    // Redirect to cart if specified
    if (redirect) {
        setTimeout(() => {
            globalThis.location.href = "cart.html";
        }, 1000);
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.cart-notification').forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--secondary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animations
if (!document.querySelector('#cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Setup Add to Cart buttons
document.addEventListener('DOMContentLoaded', function() {
    // Handle Add to Cart button clicks
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (!addToCartBtn) return;
        
        e.preventDefault();
        
        // Get product data
        const productName = addToCartBtn.dataset.name || 
                           addToCartBtn.closest('.product-card')?.querySelector('h3')?.textContent || 
                           'Product';
        
        const productPrice = Number.parseFloat(addToCartBtn.dataset.price) || 
                           Number.parseFloat(addToCartBtn.closest('.product-card')?.querySelector('.price')?.textContent.replaceAll(/[^0-9.]/g, '')) || 
                           0;
        
        const productImage = addToCartBtn.dataset.image || 
                           addToCartBtn.closest('.product-card')?.querySelector('img')?.src || 
                           '';
        
        const productId = (productName.toLowerCase().replaceAll(/[^a-z0-9]/g, '-') + '-' + Date.now()).slice(0, 50);
        
        // Add to cart
        addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        });
    });
});

// Make functions available globally
globalThis.addToCart = addToCart;
globalThis.updateCartCount = updateCartCount;