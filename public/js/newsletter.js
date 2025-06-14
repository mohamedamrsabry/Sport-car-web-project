
let newsletterInitialized = false; 

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
            
            // Create form data
            const formData = new FormData();
            formData.append('email', email);
            
            // Send AJAX request
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
                // Try to parse as JSON
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error('Invalid response from server');
                }
                
                // Reset button state
                resetSubscribeButton();
                
                if (data.success) {
                    // Show success message
                    showNewsletterMessage('success', data.message);
                    // Clear the form
                    newsletterForm.reset();
                } else {
                    // Show error message
                    showNewsletterMessage('error', data.message);
                }
            })
            .catch(error => {
                console.error('Newsletter subscription error:', error);
                resetSubscribeButton();
                showNewsletterMessage('error', 'There was an error processing your subscription. Please try again later.');
            });
        });
        
        // Mark as initialized
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

// Initialize newsletter when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure footer is loaded
    setTimeout(initNewsletter, 100);
});

// Make functions globally available
window.showNewsletterMessage = showNewsletterMessage;
window.closeNewsletterMessage = closeNewsletterMessage;