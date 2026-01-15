// Checkout System - Simple and Working
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
                        </div>
                        
                        <div class="form-section">
                            <h3><i class="fas fa-truck"></i> Delivery Details</h3>
                            <div class="form-group">
                                <label class="form-label">Delivery Address *</label>
                                <textarea class="form-input" name="address" required rows="3" placeholder="House number, Street, Landmark"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Delivery Zone *</label>
                                <select class="form-input" name="zone" required>
                                    <option value="community-5">Community 5 - GHS 5.00</option>
                                    <option value="community-6">Community 6 - GHS 7.00</option>
                                    <option value="community-7">Community 7 - GHS 8.00</option>
                                    <option value="community-8">Community 8 - GHS 9.00</option>
                                    <option value="community-9">Community 9 - GHS 10.00</option>
                                    <option value="ashaiman">Ashaiman - GHS 12.00</option>
                                    <option value="batsonaa">Batsonaa - GHS 15.00</option>
                                    <option value="spintex">Spintex - GHS 18.00</option>
                                    <option value="east-legon">East Legon - GHS 20.00</option>
                                    <option value="accra-central">Accra Central - GHS 25.00</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
                            <div class="mobile-money-options">
                                <div class="momo-option">
                                    <input type="radio" id="mtn" name="payment" value="mtn" checked class="momo-radio">
                                    <label for="mtn" class="momo-label">
                                        <div class="momo-icon mtn">MTN</div>
                                        <span>Mobile Money</span>
                                    </label>
                                </div>
                                <div class="momo-option">
                                    <input type="radio" id="vodafone" name="payment" value="vodafone" class="momo-radio">
                                    <label for="vodafone" class="momo-label">
                                        <div class="momo-icon vodafone">Voda</div>
                                        <span>Vodafone Cash</span>
                                    </label>
                                </div>
                                <div class="momo-option">
                                    <input type="radio" id="airteltigo" name="payment" value="airteltigo" class="momo-radio">
                                    <label for="airteltigo" class="momo-label">
                                        <div class="momo-icon airteltigo">AT</div>
                                        <span>AirtelTigo Money</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mobile Money Number *</label>
                                <input type="tel" class="form-input" name="momoNumber" required placeholder="0551234567">
                            </div>
                        </div>
                        
                        <button type="submit" class="payment-btn">
                            <i class="fas fa-lock"></i> Pay GHS ${total.toFixed(2)} Now
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
                        <span>Subtotal (${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>GHS ${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div class="summary-row">
                        <span>Delivery Fee</span>
                        <span>GHS ${deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>GHS ${total.toFixed(2)}</span>
                    </div>
                    
                    <p style="color: var(--gray-color); font-size: 14px; margin-top: 20px;">
                        <i class="fas fa-shield-alt"></i> Secure payment
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

// Process checkout
function processCheckout(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());
    
    // Validate
    if (!orderData.phone || orderData.phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Save delivery zone
    localStorage.setItem('deliveryZone', orderData.zone);
    
    // Get cart data
    let cartItems = [];
    try {
        const savedCart = localStorage.getItem('mashkeCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error:', e);
    }
    
    // Calculate total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFees = {
        'community-5': 5, 'community-6': 7, 'community-7': 8,
        'community-8': 9, 'community-9': 10, 'ashaiman': 12,
        'batsonaa': 15, 'spintex': 18, 'east-legon': 20,
        'accra-central': 25
    };
    const deliveryFee = deliveryFees[orderData.zone] || 5;
    const total = subtotal + deliveryFee;
    
    // Generate order number
    const orderNumber = 'MF' + Date.now().toString().slice(-8);
    
    // Show payment modal
    showPaymentModal(orderData, total, orderNumber);
}

// Show payment modal
function showPaymentModal(orderData, total, orderNumber) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('paymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'paymentModal';
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <h2 class="modal-title">Complete Payment</h2>
                <p class="modal-text">Check your phone to complete payment</p>
                <div class="payment-code" id="paymentCode">*170#</div>
                <p class="modal-text">Reference: <strong id="paymentRef">${orderNumber}</strong></p>
                <p class="modal-text">Amount: <strong>GHS ${total.toFixed(2)}</strong></p>
                <button class="modal-btn" onclick="completePayment()">
                    <i class="fas fa-check"></i> I've Paid
                </button>
                <button class="modal-btn" onclick="cancelPayment()" style="background-color: #ccc; color: #333; margin-left: 10px;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update modal content
    document.getElementById('paymentRef').textContent = orderNumber;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Simulate sending payment request
    setTimeout(() => {
        console.log(`📱 Payment request sent to ${orderData.momoNumber} for GHS ${total.toFixed(2)}`);
    }, 1000);
}

// Complete payment
function completePayment() {
    // Hide modal
    document.getElementById('paymentModal').style.display = 'none';
    
    // Get order data from form
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());
    
    // Get cart data
    let cartItems = [];
    try {
        const savedCart = localStorage.getItem('mashkeCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error:', e);
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFees = {
        'community-5': 5, 'community-6': 7, 'community-7': 8,
        'community-8': 9, 'community-9': 10, 'ashaiman': 12,
        'batsonaa': 15, 'spintex': 18, 'east-legon': 20,
        'accra-central': 25
    };
    const deliveryFee = deliveryFees[orderData.zone] || 5;
    const total = subtotal + deliveryFee;
    
    // Generate order number
    const orderNumber = 'MF' + Date.now().toString().slice(-8);
    
    // Show confirmation
    showOrderConfirmation(orderData, cartItems, total, orderNumber);
    
    // Clear cart
    localStorage.removeItem('mashkeCart');
    
    // Update cart count
    if (globalThis.updateCartCount) {
        globalThis.updateCartCount();
    }
    
    // Send SMS notification (simulated)
    sendSMSNotification(orderData.phone, orderNumber, total);
}

// Cancel payment
function cancelPayment() {
    document.getElementById('paymentModal').style.display = 'none';
    alert('Payment cancelled. You can try again.');
}

// Show order confirmation
function showOrderConfirmation(orderData, cartItems, total, orderNumber) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    // Zone names mapping
    const zoneNames = {
        'community-5': 'Community 5',
        'community-6': 'Community 6',
        'community-7': 'Community 7',
        'community-8': 'Community 8',
        'community-9': 'Community 9',
        'ashaiman': 'Ashaiman',
        'batsonaa': 'Batsonaa',
        'spintex': 'Spintex',
        'east-legon': 'East Legon',
        'accra-central': 'Accra Central'
    };
    
    // Payment method names
    const paymentMethods = {
        'mtn': 'MTN Mobile Money',
        'vodafone': 'Vodafone Cash',
        'airteltigo': 'AirtelTigo Money'
    };
    
    checkoutContent.innerHTML = `
        <div class="confirmation-container">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 class="confirmation-title">Order Confirmed!</h2>
            <p class="confirmation-subtitle">Thank you for your order!</p>
            
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
                    <span>Delivery Address:</span>
                    <span>${orderData.address}</span>
                </div>
                <div class="order-detail">
                    <span>Delivery Zone:</span>
                    <span>${zoneNames[orderData.zone] || 'Community 5'}</span>
                </div>
                <div class="order-detail">
                    <span>Payment Method:</span>
                    <span>${paymentMethods[orderData.payment] || 'Mobile Money'}</span>
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
            
            <button class="whatsapp-btn" onclick="openWhatsApp()">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </button>
            
            <a href="index.html" class="continue-btn">
                <i class="fas fa-home"></i> Continue Shopping
            </a>
        </div>
    `;
}

// Send SMS notification
function sendSMSNotification(phone, orderNumber, total) {
    console.log(`📱 SMS sent to ${phone}: Your Mashke Finesse order ${orderNumber} for GHS ${total.toFixed(2)} has been confirmed!`);
    
    // Show notification
    showNotification('Order confirmation sent to your phone!');
}

// Open WhatsApp
function openWhatsApp() {
    const message = 'Hello Mashke Finesse! I just placed an order. Can you check the status?';
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
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.querySelector('#checkout-animations')) {
    const style = document.createElement('style');
    style.id = 'checkout-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .payment-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            width: 90%;
            max-width: 500px;
            text-align: center;
        }
        .modal-icon {
            font-size: 60px;
            color: #2A9D8F;
            margin-bottom: 20px;
        }
        .modal-title {
            font-size: 24px;
            margin-bottom: 15px;
        }
        .modal-text {
            color: #666;
            margin-bottom: 15px;
        }
        .payment-code {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 24px;
            margin: 20px 0;
            border: 2px dashed #2A9D8F;
        }
        .modal-btn {
            background-color: #2A9D8F;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 30px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
        }
    `;
    document.head.appendChild(style);
}