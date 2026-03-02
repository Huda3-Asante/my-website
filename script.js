document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".swiper", {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
});
// PRODUCT SEARCH FUNCTIONALITY
const searchBar = document.getElementById("searchBar");
const productCards = document.querySelectorAll(".product-card");

searchBar.addEventListener("keyup", function () {
    const searchText = searchBar.value.toLowerCase();

    productCards.forEach(card => {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        const price = card.querySelector(".price").textContent.toLowerCase();

        if (productName.includes(searchText) || price.includes(searchText)) {
            card.style.display = "block";  // show
        } else {
            card.style.display = "none";  // hide
        }
    });
});

// Cart Management System
class CartSystem {
            constructor() {
                this.cart = this.loadCart();
                this.updateCartCount();
                this.renderCartPage();
                this.setupEventListeners();
            }
            
            loadCart() {
                const cartData = localStorage.getItem('mashkeCart');
                return cartData ? JSON.parse(cartData) : [];
            }
            
            saveCart() {
                localStorage.setItem('mashkeCart', JSON.stringify(this.cart));
                this.updateCartCount();
            }
            
            updateCartCount() {
                const count = this.cart.reduce((total, item) => total + item.quantity, 0);
                const cartCountElement = document.getElementById('cart-count');
                if (cartCountElement) {
                    cartCountElement.textContent = count;
                }
            }
            
            addToCart(product) {
                const existingItem = this.cart.find(item => item.name === product.name);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                
                this.saveCart();
                this.showNotification(`${product.name} added to cart!`);
                this.renderCartPage();
            }
            
            removeFromCart(productName) {
                this.cart = this.cart.filter(item => item.name !== productName);
                this.saveCart();
                this.renderCartPage();
            }
            
            updateQuantity(productName, change) {
                const item = this.cart.find(item => item.name === productName);
                if (item) {
                    item.quantity += change;
                    if (item.quantity <= 0) {
                        this.removeFromCart(productName);
                    } else {
                        this.saveCart();
                        this.renderCartPage();
                    }
                }
            }
            
            clearCart() {
                if (this.cart.length > 0) {
                    if (confirm('Are you sure you want to clear your cart?')) {
                        this.cart = [];
                        this.saveCart();
                        this.renderCartPage();
                    }
                }
            }
            
            calculateTotal() {
                return this.cart.reduce((total, item) => total + Number.parseFloat((item.price) * item.quantity), 0);
            }
            
            renderCartPage() {
                const emptyCartState = document.getElementById('empty-cart-state');
                const cartItemsContainer = document.getElementById('cart-items-container');
                const cartStatus = document.getElementById('cart-status');
                const cartItemsList = document.getElementById('cart-items-list');
                const cartSubtotal = document.getElementById('cart-subtotal');
                const estimatedTotal = document.getElementById('estimated-total');
                const totalAmount = document.getElementById('total-amount');
                const itemsTotal = document.getElementById('items-total');
                
                const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
                
                // Update cart status
                cartStatus.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
                
                if (this.cart.length === 0) {
                    // Show empty state
                    emptyCartState.style.display = 'block';
                    cartItemsContainer.style.display = 'none';
                    totalAmount.innerHTML = 'GHS 0<span>.00</span>';
                    itemsTotal.textContent = 'GHS 0.00';
                } else {
                    // Show cart items
                    emptyCartState.style.display = 'none';
                    cartItemsContainer.style.display = 'block';
                    
                    // Generate cart items HTML
                    let cartItemsHTML = '';
                    let subtotal = 0;
                    
                    this.cart.forEach((item, index) => {
                        const itemTotal =Number.parseFloat(item.price) * item.quantity;
                        subtotal += itemTotal;
                        
                        cartItemsHTML += `
                            <div class="cart-item" data-index="${index}">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MCAzMEM0NSAzMCA0OSAzNCA0OSA0MEM0OSA0NiA0NSA1MCA0MCA1MEMzNSA1MCAzMSA0NiAzMSA0MEMzMSAzNCAzNSAzMCA0MCAzMFoiIGZpbGw9IiNlOGE1OTgiLz48cGF0aCBkPSJNNTUgNThINTVINTBDNDUgNTggNDAgNTMgNDAgNDhWNDRDNDAgMzkgNDUgMzQgNTAgMzRINTVDNjAgMzQgNjUgMzkgNjUgNDRWNDhDNjUgNTMgNjAgNTggNTUgNThaIiBmaWxsPSIjZThhNTk4Ii8+PC9zdmc+'">
                                <div class="cart-item-details">
                                    <div class="cart-item-name">${item.name}</div>
                                    <div class="cart-item-price">GHS ${Number.parseFloat(item.price).toFixed(2)}</div>
                                </div>
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus" data-name="${item.name}">-</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-name="${item.name}">+</button>
                                </div>
                                <div class="cart-item-total">GHS ${itemTotal.toFixed(2)}</div>
                                <button class="remove-item" data-name="${item.name}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `;
                    });
                    
                    cartItemsList.innerHTML = cartItemsHTML;
                    
                    // Update totals
                    const total = this.calculateTotal();
                    const [whole, decimal] = total.toFixed(2).split('.');
                    
                    cartSubtotal.textContent = `GHS ${subtotal.toFixed(2)}`;
                    estimatedTotal.textContent = `GHS ${total.toFixed(2)}`;
                    totalAmount.innerHTML = `GHS ${whole}<span>.${decimal}</span>`;
                    itemsTotal.textContent = `GHS ${total.toFixed(2)}`;
                    
                    // Add event listeners to cart controls
                    this.setupCartControls();
                }
            }
            
            setupCartControls() {
                // Quantity minus buttons
                document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productName = e.target.dataset.name;
                        this.updateQuantity(productName, -1);
                    });
                });

                // Quantity plus buttons
                document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productName = e.target.dataset.name;
                        this.updateQuantity(productName, 1);
                    });
                });

                // Remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productName = e.target.closest('.remove-item').dataset.name;
                        if (confirm('Remove this item from your cart?')) {
                            this.removeFromCart(productName);
                        }
                    });
                });
            }
            
            setupEventListeners() {
                // Clear cart button
                const clearCartBtn = document.getElementById('clear-cart-btn');
                if (clearCartBtn) {
                    clearCartBtn.addEventListener('click', () => {
                        this.clearCart();
                    });
                }
                
                // Checkout button
                const checkoutBtn = document.getElementById('checkout-btn');
                if (checkoutBtn) {
                    checkoutBtn.addEventListener('click', () => {
                        if (this.cart.length > 0) {
                            alert(`Proceeding to checkout!\n\nOrder Total: GHS ${this.calculateTotal().toFixed(2)}\n\nThis is a demo. In a real implementation, this would redirect to a payment page.`);
                        } else {
                            alert('Your cart is empty. Add some items before checkout.');
                        }
                    });
                }
                
                // Continue shopping button
                const continueShoppingBtn = document.getElementById('continue-shopping-btn');
                if (continueShoppingBtn) {
                    continueShoppingBtn.addEventListener('click', () => {
                        globalThis.location.href = 'index.html';
                    });
                }
            }
            
            showNotification(message) {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = 'cart-notification show';
                notification.innerHTML = `
                    <div class="cart-notification-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="cart-notification-content">
                        <h4>${message}</h4>
                        <p>Added to your cart</p>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 500);
                }, 3000);
            }
        }

// Initialize cart system when page loads
document.addEventListener('DOMContentLoaded', () => {
    globalThis.cartSystem = new CartSystem();
    
    // Update cart count on all pages
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }

    const params = new URLSearchParams(globalThis.location.search);
    const category = params.get("category");

    if (!category) return;

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        if (product.dataset.category !== category) {
            product.style.display = "none";
        }
    });
   document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(globalThis.location.search);
    const category = params.get("category");

    if (!category) return;

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        if (product.dataset.category !== category) {
            product.style.display = "none";
        }
    });
    // Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    createMobileMenu();
    setupTouchEvents();
    preventZoomOnInput();
});

// Create mobile menu toggle
function createMobileMenu() {
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
        // Create mobile menu button
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Open menu');
        
        // Find header and add button
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(menuToggle);
        }
        
        // Get existing nav links or create mobile nav
        let navLinks = document.querySelector('.nav-links');
        if (!navLinks) {
            navLinks = document.querySelector('.nav') || document.querySelector('nav');
            if (navLinks) {
                navLinks.classList.add('nav-links');
            }
        }
        
        if (navLinks) {
            // Create close button for mobile menu
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-menu';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.setAttribute('aria-label', 'Close menu');
            navLinks.appendChild(closeBtn);
            
            // Toggle menu on button click
            menuToggle.addEventListener('click', function() {
                navLinks.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            closeBtn.addEventListener('click', function() {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Close menu when clicking links
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Close menu when clicking outside
            navLinks.addEventListener('click', function(e) {
                if (e.target === navLinks) {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
}

// Setup touch events for better mobile experience
function setupTouchEvents() {
    // Add touch feedback to buttons
    document.querySelectorAll('button, a.btn-primary, .add-to-cart').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.9';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
    
    // Prevent text selection on tap
    document.querySelectorAll('.btn-primary, .add-to-cart, .quantity-btn').forEach(el => {
        el.style.webkitTouchCallout = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.userSelect = 'none';
    });
}

// Prevent zoom on input focus in iOS
function preventZoomOnInput() {
    let viewport = document.querySelector('meta[name="viewport"]');
    
    document.addEventListener('focusin', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        }
    });
    
    document.addEventListener('focusout', function() {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
    });
}

globalThis// Handle orientation changes
.addEventListener('orientationchange', function() {
    // Update any layout that needs to change on orientation
    setTimeout(function() {
        globalThis.dispatchEvent(new Event('resize'));
    }, 300);
});

// Update cart button position on scroll for mobile
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // Scrolling down - hide cart button
                cartBtn.style.transform = 'translateY(100px)';
            } else {
                // Scrolling up - show cart button
                cartBtn.style.transform = 'translateY(0)';
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }
    }
});
});
})
