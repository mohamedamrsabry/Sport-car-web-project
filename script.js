let lastScrollY = window.scrollY;
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling Down - Hide Navbar
        navbar.classList.add("nav-hidden");
    } else {
        // Scrolling Up - Show Navbar
        navbar.classList.remove("nav-hidden");
    }
    lastScrollY = window.scrollY;
});

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
            text.style.backgroundColor="#0000003a";
            text.textContent="-PRESS W TO START-";
            audio.currentTime = 0;
            speed = 0; // Reset speed
            counter.textContent = "0 km/h";
            clearInterval(interval);
        }
    });
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
  