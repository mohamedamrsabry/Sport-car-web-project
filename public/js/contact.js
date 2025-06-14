document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const rateForm = document.querySelector('.rate-form');
    

    const starRating = rateForm ? rateForm.querySelector('.star-rating') : null;
    const rateRatingInput = document.getElementById('rateRating');

   
    if (rateForm && !document.getElementById('rate-success-message')) {
        const msgDiv = document.createElement('div');
        msgDiv.id = 'rate-success-message';
        msgDiv.style.display = 'none';
        msgDiv.style.marginTop = '12px';
        msgDiv.style.color = '#ffca66';
        msgDiv.style.fontWeight = 'bold';
        rateForm.parentNode.insertBefore(msgDiv, rateForm.nextSibling);
    }
    const rateSuccessMsg = document.getElementById('rate-success-message');

  
    if (starRating && rateRatingInput) {
        let selectedValue = 0;
       

        const stars = Array.from(starRating.querySelectorAll('.star'));
        console.log('Found stars:', stars.length);
        const ratingStrings = [
            '',
            'One star',
            'Two stars',
            'Three stars',
            'Four stars',
            'Five stars'
        ];

        function updateStars(value) {
            stars.forEach((star, idx) => {
                

                for (let i = 1; i <= 5; i++) {
                    star.classList.remove('selected-' + i);
                }
                if (idx < value) {
                    star.classList.add('selected-' + (idx + 1));
                }
            });
            console.log('Selected stars:', value);
        }

        function highlightStars(value) {
            stars.forEach((star, idx) => {
                
                for (let i = 1; i <= 5; i++) {
                    star.classList.remove('selected-' + i);
                }
                if (idx < value) {
                    star.classList.add('selected-' + (idx + 1));
                }
            });
        }

        stars.forEach((star, idx) => {
            star.addEventListener('mouseenter', () => highlightStars(idx + 1));
            star.addEventListener('mouseleave', () => highlightStars(0));
            star.addEventListener('click', () => {
                if (selectedValue === idx + 1) {
                    
                    selectedValue = 0;
                    updateStars(0);
                    rateRatingInput.value = '';
                } else {
                    selectedValue = idx + 1;
                    updateStars(selectedValue);
                    rateRatingInput.value = selectedValue;
                }
                if (rateSuccessMsg) {
                    rateSuccessMsg.style.display = 'none';
                }
            });
        });
        
        starRating.addEventListener('mouseleave', () => {
            highlightStars(0);
            updateStars(selectedValue);
        });
        
        updateStars(0);
    }

   
    const contactModal = document.getElementById('contact-modal');
    const contactModalMsg = document.getElementById('contact-modal-message');
    const contactModalClose = document.getElementById('contact-modal-close');
    function showContactModal(message, isError = false) {
        if (contactModal && contactModalMsg) {
            contactModalMsg.textContent = message;
            contactModalMsg.style.color = isError ? 'red' : '#ffca66';
            contactModal.style.display = 'flex';
        }
    }
    function hideContactModal() {
        if (contactModal) contactModal.style.display = 'none';
    }
    if (contactModalClose) contactModalClose.onclick = hideContactModal;
    if (contactModal) contactModal.onclick = function(e) {
        if (e.target === contactModal) hideContactModal();
    };

  
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
               
                const formData = {
                    firstName: contactForm.querySelector('[name="firstName"]').value,
                    lastName: contactForm.querySelector('[name="lastName"]').value,
                    email: contactForm.querySelector('[name="email"]').value,
                    phone: contactForm.querySelector('[name="phone"]').value,
                    message: contactForm.querySelector('[name="message"]').value,
                    carOfInterest: contactForm.querySelector('[name="carOfInterest"]')?.value || ''
                };
                
                
                console.log('Sending data:', formData); 
                
                const response = await fetch('http://localhost:8080/contact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('Response status:', response.status); 
                console.log('Response headers:', response.headers); 
                
                const responseText = await response.text();
                console.log('Raw response:', responseText); 
                
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    console.log('Response was not valid JSON:', responseText);
                    throw new Error('Invalid response from server');
                }
                
                if (response.ok && result.success) {
                    
                    showContactModal(result.message || 'Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    
                    showContactModal('Error: ' + (result.message || 'Something went wrong. Please try again.'), true);
                }
            } catch (error) {
                console.error('Error:', error);
                showContactModal('An error occurred. Please try again later.', true);
            } finally {
               
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    
    if (rateForm) {
        rateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = rateForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            try {
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
                const formData = {
                    name: rateForm.querySelector('[name="name"]').value,
                    rating: rateForm.querySelector('[name="rating"]').value,
                    message: rateForm.querySelector('[name="message"]').value
                };
                if (!formData.rating) {
                    if (rateSuccessMsg) {
                        rateSuccessMsg.textContent = 'Please select a rating.';
                        rateSuccessMsg.style.display = 'block';
                        rateSuccessMsg.style.color = 'red';
                    }
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }
                const response = await fetch('http://localhost:3000/api/rate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (response.ok) {
                    if (rateSuccessMsg) {
                        rateSuccessMsg.textContent = 'Thank you for your rating!';
                        rateSuccessMsg.style.display = 'block';
                        rateSuccessMsg.style.color = '#ffca66';
                    }
                    
                    rateForm.querySelector('[name="name"]').value = '';
                    rateForm.querySelector('[name="rating"]').value = '';
                    rateForm.querySelector('[name="message"]').value = '';
                    
                    
                    const stars = rateForm.querySelectorAll('.star');
                    stars.forEach(s => s.classList.remove('selected-' + 1, 'selected-' + 2, 'selected-' + 3, 'selected-' + 4, 'selected-' + 5));
                    rateRatingInput.value = '';
                    if (typeof selectedValue !== 'undefined') selectedValue = 0;
                } else {
                    if (rateSuccessMsg) {
                        rateSuccessMsg.textContent = 'Error: ' + (result.message || 'Something went wrong. Please try again.');
                        rateSuccessMsg.style.display = 'block';
                        rateSuccessMsg.style.color = 'red';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (rateSuccessMsg) {
                    rateSuccessMsg.textContent = 'An error occurred. Please try again later.';
                    rateSuccessMsg.style.display = 'block';
                    rateSuccessMsg.style.color = 'red';
                }
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});