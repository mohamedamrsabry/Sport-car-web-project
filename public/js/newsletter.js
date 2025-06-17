
let newsletterInitialized = false; // Flag to prevent multiple initializations

function initNewsletter() {

    if (newsletterInitialized) {
        return;
    }
    
    const newsletterForm = document.getElementById('newsletterForm');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeText = document.getElementById('subscribeText');
    const subscribeLoading = document.getElementById('subscribeLoading');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterEmail.value.trim();

            if (!email || !isValidEmail(email)) {
                showNewsletterMessage('error', 'Please enter a valid email address.');
                return;
            }

            subscribeBtn.disabled = true;
            subscribeText.style.display = 'none';
            subscribeLoading.style.display = 'inline-block';

            const formData = new FormData();
            formData.append('email', email);

            fetch('http://localhost:8080/newsletter-subscribe.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error('Invalid response from server');
                }

                resetSubscribeButton();
                
                if (data.success) {

                    showNewsletterMessage('success', data.message);

                    newsletterForm.reset();
                } else {

                    showNewsletterMessage('error', data.message);
                }
            })
            .catch(error => {
                console.error('Newsletter subscription error:', error);
                resetSubscribeButton();
                showNewsletterMessage('error', 'There was an error processing your subscription. Please try again later.');
            });
        });
        newsletterInitialized = true;
    }
    function resetSubscribeButton() {
        subscribeBtn.disabled = false;
        subscribeText.style.display = 'inline';
        subscribeLoading.style.display = 'none';
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
function showNewsletterMessage(type, message) {
    const overlay = document.getElementById('newsletterOverlay');
    const successMsg = document.getElementById('newsletterSuccess');
    const errorMsg = document.getElementById('newsletterError');
    
    if (type === 'success') {
        document.getElementById('successText').textContent = message;
        overlay.style.display = 'block';
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
    } else {
        document.getElementById('errorText').textContent = message;
        overlay.style.display = 'block';
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    }
}
function closeNewsletterMessage() {
    const overlay = document.getElementById('newsletterOverlay');
    const successMsg = document.getElementById('newsletterSuccess');
    const errorMsg = document.getElementById('newsletterError');
    
    overlay.style.display = 'none';
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {

    setTimeout(initNewsletter, 100);
});
window.showNewsletterMessage = showNewsletterMessage;
window.closeNewsletterMessage = closeNewsletterMessage;