

const sections=document.querySelectorAll('section');
const observer=new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold:0.1
});

sections.forEach(section => {
    observer.observe(section);
}
);


let scaleValue = 1;
    let opacityValue = 1;
    let scrollingEnabled = false;

    window.addEventListener('wheel', (event) => {
        if (!scrollingEnabled) {
            event.preventDefault(); // Prevent native scrolling
            

            if (event.deltaY > 0) {
                scaleValue = Math.min(scaleValue + event.deltaY * 0.005, 6);
                opacityValue = Math.max(opacityValue - event.deltaY * 0.002, 0);
            }
            else {
                scaleValue = Math.max(scaleValue + event.deltaY * 0.005, 1);
                opacityValue = Math.min(opacityValue - event.deltaY * 0.002, 1);
            }


            const cover = document.querySelector('.black-cover');
            cover.style.transform = `scale(${scaleValue})`;
            cover.style.opacity = opacityValue;

            if (opacityValue <= 0) {
                scrollingEnabled = true;
                document.body.style.overflowY = 'auto'; 
                cover.style.display = 'none'; 
            }
        }
    }, { passive: false });


document.addEventListener("DOMContentLoaded", () => {
    let counter = document.getElementById("speedCounter");
    let video= document.getElementById("car-image");
    let audio = document.getElementById("engineSound");
    let speed = 0;
    let revving = false;
    let interval = null;
    let text=document.querySelector(".start");

    // Start revving when "W" is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "w" && !revving) {
            revving = true;
            audio.play();
            video.play();
            text.style.backgroundColor="#0000008f";
            text.textContent="-KEEP HOLDING W-";
            interval = setInterval(() => {
                if (speed < 325) {
                    speed += 0.7;
                    counter.textContent = Math.floor(speed) + " km/h";
                }
            }, 50);
        }
    });

    // Stop revving when "W" is released
    document.addEventListener("keyup", (event) => {
        if (event.key.toLowerCase() === "w") {
            revving = false;
            audio.pause();
            video.pause();
            video.currentTime=0;
            text.style.backgroundColor="#0000003a";
            text.textContent="-PRESS W TO START-";
            audio.currentTime = 0;
            speed = 0; // Reset speed
            counter.textContent = "0 km/h";
            clearInterval(interval);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.schedule-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Scheduling...';
                submitBtn.disabled = true;
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Visit scheduled successfully! We will contact you shortly to confirm.');
                    form.reset();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('An error occurred. Please try again later.');
                console.error('Error:', error);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});


var swiper = new Swiper(".vehicles-slider", {
    allowTouchMove: true,
    simulateTouch: true,
    touchStartPreventDefault: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 1.5, // Shows half of the next and previous slides
    spaceBetween: 20, // Adjust spacing between slides
    autoplay: {
      delay: 9500,
      disableOnInteraction: false,
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 0, // No rotation
      stretch: 0, // No stretch
      depth: 200, // Adjust depth for a 3D effect
      modifier: 1,
      slideShadows: false,
      scale: 0.9, // Slightly smaller side slides
      opacity: 0.5, // Make side slides less prominent
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "bullets",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    
  });










  // Subscription form handling
document.getElementById('subscribeForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('subscribeEmail');
    const submitBtn = this.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('subscribeMessage');
    
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput.value })
        });
        
        const result = await response.json();
        
        messageDiv.style.display = 'block';
        messageDiv.textContent = result.message;
        messageDiv.style.color = result.success ? '#4CAF50' : '#F44336';
        
        if (result.success) {
            emailInput.value = '';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'Network error. Please try again later.';
        messageDiv.style.color = '#F44336';
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});