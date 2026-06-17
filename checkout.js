// Checkout System with Paystack Integration
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutPage();
});

function loadCheckoutPage() {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    // Load cart data
    let cartItems = [];
    try {
        const savedCart = localStorage.getItem('mashkeCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
    }
    
    // If cart is empty, show message
    if (cartItems.length === 0) {
        checkoutContent.innerHTML = `
            <div class="confirmation-container">
                <div class="confirmation-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h2 class="confirmation-title">Your Cart is Empty</h2>
                <p class="confirmation-text">Add some delicious items to your cart first!</p>
                <a href="products.html" class="continue-btn">
                    <i class="fas fa-utensils"></i> Browse Products
                </a>
            </div>
        `;
        return;
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryZone = localStorage.getItem('deliveryZone') || 'community-5';
    const deliveryFees = {
        'community-5': 5, 'community-6': 7, 'community-7': 8,
        'community-8': 9, 'community-9': 10, 'ashaiman': 12,
        'batsonaa': 15, 'spintex': 18, 'east-legon': 20,
        'accra-central': 25
    };
    const deliveryFee = deliveryFees[deliveryZone] || 5;
    const total = subtotal + deliveryFee;
    
    // Render checkout form
    checkoutContent.innerHTML = `
        <div class="checkout-layout">
            <div class="checkout-form-section">
                <div class="checkout-form-container">
                    <form id="checkoutForm" onsubmit="processCheckout(event)">
                        <div class="form-section">
                            <h3><i class="fas fa-user"></i> Your Information</h3>
                            <div class="form-group">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-input" name="name" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone Number *</label>
                                <input type="tel" class="form-input" name="phone" required placeholder="0551234567">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email Address *</label>
                                <input type="email" class="form-input" name="email" required placeholder="yourname@email.com">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3><i class="fas fa-truck"></i> Delivery Details</h3>
                            <div class="form-group">
                                <label class="form-label">Delivery Address *</label>
                                <textarea class="form-input" name="address" required rows="3" placeholder="House number, Street, Landmark"></textarea>
                            </div>
                            <div class="form-group">
                            <label class="form-label">Your Location *</label>
                            <input type="text" class="form-input" name="location" required 
                             placeholder="e.g. Tema Community 5, Ashaiman, Spintex...">
                            <p style="color:#d63384; font-size:13px; margin-top:8px;">
                            📦 Delivery fee is based on your location. We will confirm the exact fee via WhatsApp before delivery.
                            </p>
                        </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
                            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                                <i class="fas fa-shield-alt"></i> Secure payment powered by Paystack. 
                                Supports MTN MoMo, Vodafone Cash, AirtelTigo & Cards.
                            </p>
                        </div>
                        
                        <button type="submit" class="payment-btn">
                           <i class="fas fa-lock"></i> Pay GHS ${subtotal.toFixed(2)} Now
                           <span style="display:block; font-size:12px; opacity:0.8;">
                             (Delivery fee confirmed separately)
                           </span>
                        </button>
                    </form>
                    
                    <a href="cart.html" class="back-to-cart">
                        <i class="fas fa-arrow-left"></i> Back to Cart
                    </a>
                </div>
            </div>
            
            <div class="order-summary-section">
                <div class="order-summary">
                    <h2>Order Summary</h2>
                    <div class="order-items">
                        ${cartItems.map(item => `
                            <div class="order-item">
                                <div>
                                    <div class="order-item-name">${item.name}</div>
                                    <div class="order-item-qty">Qty: ${item.quantity}</div>
                                </div>
                                <div class="order-item-price">GHS ${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-row">
                      <span>Delivery Fee</span>
                      <span style="color:#d63384; font-size:13px;">Confirmed via WhatsApp</span>
                    </div>

                    <p style="color: var(--gray-color); font-size: 14px; margin-top: 20px;">
                        <i class="fas fa-shield-alt"></i> Secured by Paystack
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Set saved zone
    const zoneSelect = document.querySelector('select[name="zone"]');
    if (zoneSelect && deliveryZone) {
        zoneSelect.value = deliveryZone;
    }
}

// Update total when zone changes
function updateTotal(zone) {
    const cartItems = JSON.parse(localStorage.getItem('mashkeCart') || '[]');
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFees = {
        'community-5': 5, 'community-6': 7, 'community-7': 8,
        'community-8': 9, 'community-9': 10, 'ashaiman': 12,
        'batsonaa': 15, 'spintex': 18, 'east-legon': 20,
        'accra-central': 25
    };
    const deliveryFee = deliveryFees[zone] || 5;
    const total = subtotal + deliveryFee;

    const deliveryDisplay = document.getElementById('deliveryFeeDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    const payBtn = document.querySelector('.payment-btn');

    if (deliveryDisplay) deliveryDisplay.textContent = `GHS ${deliveryFee.toFixed(2)}`;
    if (totalDisplay) totalDisplay.textContent = `GHS ${total.toFixed(2)}`;
    if (payBtn) payBtn.innerHTML = `<i class="fas fa-lock"></i> Pay GHS ${total.toFixed(2)} Now`;

    localStorage.setItem('deliveryZone', zone);
}

// Process checkout with Paystack
function processCheckout(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());

    // Validate phone
    if (!orderData.phone || orderData.phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Validate email
    if (!orderData.email || !orderData.email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    // Save delivery zone
    localStorage.setItem('deliveryZone', orderData.zone);

    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('mashkeCart') || '[]');

    // Calculate total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;
    const orderNumber = 'MF' + Date.now().toString().slice(-8);

    // Launch Paystack
    const handler = PaystackPop.setup({
        key: 'pk_test_b25ea69dfb238d79355f758f5a506933629792ac',
        email: orderData.email,
        amount: total * 100, // Paystack uses pesewas (1 GHS = 100 pesewas)
        currency: 'GHS',
        ref: orderNumber,
        channels: ['mobile_money', 'card'],
        metadata: {
            custom_fields: [
                { display_name: "Customer Name", variable_name: "name", value: orderData.name },
                { display_name: "Phone", variable_name: "phone", value: orderData.phone },
                { display_name: "Address", variable_name: "address", value: orderData.address },
                { display_name: "Delivery Zone", variable_name: "zone", value: orderData.zone },
                { display_name: "Order Number", variable_name: "order_number", value: orderNumber }
            ]
        },
        callback: function(response) {
            // Payment successful!
            console.log('Payment successful:', response);
            showOrderConfirmation(orderData, cartItems, total, orderNumber);
            sendSMSNotification(orderData.phone, orderNumber, total, orderData.name);
            localStorage.removeItem('mashkeCart');
            if (globalThis.updateCartCount) {
                globalThis.updateCartCount();
            }
        },
        onClose: function() {
            alert('Payment cancelled. You can try again.');
        }
    });

    handler.openIframe();
}

// Show order confirmation
function showOrderConfirmation(orderData, cartItems, total, orderNumber) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    const zoneNames = {
        'community-5': 'Community 5', 'community-6': 'Community 6',
        'community-7': 'Community 7', 'community-8': 'Community 8',
        'community-9': 'Community 9', 'ashaiman': 'Ashaiman',
        'batsonaa': 'Batsonaa', 'spintex': 'Spintex',
        'east-legon': 'East Legon', 'accra-central': 'Accra Central'
    };
    
    checkoutContent.innerHTML = `
        <div class="confirmation-container">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 class="confirmation-title">Order Confirmed! 🎉</h2>
            <p class="confirmation-subtitle">Thank you for your order, ${orderData.name}!</p>
            
            <div class="order-details">
                <div class="order-detail">
                    <span>Order Number:</span>
                    <span><strong>${orderNumber}</strong></span>
                </div>
                <div class="order-detail">
                    <span>Customer:</span>
                    <span>${orderData.name}</span>
                </div>
                <div class="order-detail">
                    <span>Phone:</span>
                    <span>${orderData.phone}</span>
                </div>
                <div class="order-detail">
                    <span>Email:</span>
                    <span>${orderData.email}</span>
                </div>
                <div class="order-detail">
                    <span>Delivery Address:</span>
                    <span>${orderData.address}</span>
                </div>
                <div class="order-detail">
                    <span>Delivery Zone:</span>
                    <span>${zoneNames[orderData.zone] || 'Community 5'}</span>
                </div>
                <div class="order-detail total">
                    <span>Total Paid:</span>
                    <span>GHS ${total.toFixed(2)}</span>
                </div>
            </div>
            
            <p class="confirmation-text">
                Your order is being prepared. Delivery time: <strong>15-30 minutes</strong>
            </p>
            
            <p class="confirmation-text">
                <i class="fas fa-phone"></i> Need help? Call: <strong>0559815445</strong>
            </p>
            
            <button class="whatsapp-btn" onclick="openWhatsApp('${orderNumber}', '${orderData.name}')">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </button>
            
            <a href="index.html" class="continue-btn">
                <i class="fas fa-home"></i> Continue Shopping
            </a>
        </div>
    `;
}

// Send SMS notification 
function sendSMSNotification(phone, orderNumber, total, name) {
    console.log(` SMS to ${phone}: Hello ${name}! Your Mashke Finesse order ${orderNumber} of GHS ${total.toFixed(2)} is confirmed. Delivery in 15-30 mins!`);
    showNotification('✅ Order confirmed! SMS notification sent.');
}

// Open WhatsApp with order details
function openWhatsApp(orderNumber, name, location) {
    const message = `Hello Mashke Finesse! I just placed order ${orderNumber}. My name is ${name} and I am located at ${location}. Please confirm my delivery fee.`;
    const phone = '233559815445';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2A9D8F;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        font-size: 15px;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}