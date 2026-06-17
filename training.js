// Coupon Configuration
const COUPONS = {
    'BIRTHDAY2026': {
        discount: 20,
        expiry: '2026-07-31'
    }
};

function applyCoupon(planId, originalAmount, email) {
    const couponInput = document.getElementById('couponInput-' + planId);
    const couponStatus = document.getElementById('couponStatus-' + planId);
    const code = couponInput.value.trim().toUpperCase();

    // No coupon entered — just return original
    if (!code) return originalAmount;

    const coupon = COUPONS[code];

    // Check if coupon exists
    if (!coupon) {
        couponStatus.textContent = '❌ Invalid coupon code';
        couponStatus.style.color = 'red';
        return originalAmount;
    }

    // Check if expired
    const today = new Date();
    const expiry = new Date(coupon.expiry);
    if (today > expiry) {
        couponStatus.textContent = '❌ This coupon has expired';
        couponStatus.style.color = 'red';
        return originalAmount;
    }

    // Check if already used by this email
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons') || '[]');
    const usedKey = email + '_' + code;
    if (usedCoupons.includes(usedKey)) {
        couponStatus.textContent = '❌ You have already used this coupon';
        couponStatus.style.color = 'red';
        return originalAmount;
    }

    // Apply discount
    const discountAmount = (originalAmount * coupon.discount) / 100;
    const newAmount = originalAmount - discountAmount;
    const savedGHS = (discountAmount / 100).toFixed(2);

    couponStatus.textContent = `✅ ${coupon.discount}% off applied! You saved GHS ${savedGHS} 🎉`;
    couponStatus.style.color = 'green';

    return newAmount;
}

function markCouponUsed(planId, email) {
    const couponInput = document.getElementById('couponInput-' + planId);
    const code = couponInput.value.trim().toUpperCase();

    if (code && COUPONS[code]) {
        const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons') || '[]');
        const usedKey = email + '_' + code;
        if (!usedCoupons.includes(usedKey)) {
            usedCoupons.push(usedKey);
            localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
        }
    }
}

function payForTraining(planName, amountInPesewas, planId) {
    const status = document.getElementById('status-' + planId);

    const email = prompt('Enter your email address to complete enrollment:');
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const phone = prompt('Enter your WhatsApp number (we will add you to the group):');
    if (!phone || phone.length < 10) {
        alert('Please enter a valid WhatsApp number');
        return;
    }

    // Apply coupon
    const finalAmount = applyCoupon(planId, amountInPesewas, email);
    const originalGHS = (amountInPesewas / 100).toFixed(2);
    const finalGHS = (finalAmount / 100).toFixed(2);
    const orderRef = 'MF-TRAIN-' + Date.now().toString().slice(-8);

    const handler = PaystackPop.setup({
        key: 'pk_test_b25ea69dfb238d79355f758f5a506933629792ac',
        email: email,
        amount: finalAmount,
        currency: 'GHS',
        ref: orderRef,
        channels: ['mobile_money', 'card'],
        metadata: {
            custom_fields: [
                { display_name: "Training Package", variable_name: "package", value: planName },
                { display_name: "WhatsApp Number", variable_name: "whatsapp", value: phone },
                { display_name: "Original Price", variable_name: "original_price", value: `GHS ${originalGHS}` },
                { display_name: "Amount Paid", variable_name: "amount_paid", value: `GHS ${finalGHS}` }
            ]
        },
        callback: function(response) {
            markCouponUsed(planId, email);
            if (status) {
                status.textContent = '✅ Payment successful! You will be added within 24 hours.';
                status.style.color = 'green';
            }
            const message = `Hello Mashke Finesse! I just paid for the ${planName}. My email is ${email} and WhatsApp is ${phone}. Ref: ${orderRef}. Please add me to the training group.`;
            window.open(`https://wa.me/233559815445?text=${encodeURIComponent(message)}`, '_blank');
        },
        onClose: function() {
            if (status) {
                status.textContent = '❌ Payment cancelled. Try again.';
                status.style.color = 'red';
            }
        }
    });

    handler.openIframe();
}