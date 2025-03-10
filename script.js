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



document.addEventListener("DOMContentLoaded", () => {
    const textOverlay = document.querySelector(".text-overlay");
    const blackCover = document.querySelector(".black-cover");
    const transImageSection = document.querySelector(".trans-image");

    let scale = 1; 
    let opacity = 1; 
    const maxScale = 6; 
    const unlockScale = 5; 
    let isLocked = false; 
    let isScrollingDown = true; 

    function lockScroll(lock) {
        document.documentElement.style.overflow = lock ? "hidden" : "auto";
        isLocked = lock;
    }

    function checkScrollUnlock() {
        const sectionRect = transImageSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Lock when reaching the section bottom
        if (sectionRect.bottom <= windowHeight && scale === 1) {
            lockScroll(true);
        } 
        // Unlock when scaling is complete
        else if (scale >= unlockScale) {
            lockScroll(false);
        }
    }

    window.addEventListener("scroll", checkScrollUnlock);

    window.addEventListener("wheel", (e) => {
        if (!isLocked) return;

        let deltaY = e.deltaY;
        isScrollingDown = deltaY > 0;

        if (isScrollingDown && scale < maxScale) { 
            scale = Math.min(maxScale, scale + 0.5);  // Gradual increase
            textOverlay.style.transform = `scale(${scale})`;

            // Smooth opacity decrease
            opacity = Math.max(0, 1 - (scale - 1) / (maxScale - 1));
            textOverlay.style.opacity = opacity;
            blackCover.style.opacity = opacity;

            if (scale >= unlockScale) {
                lockScroll(false);
            }
        } else if (!isScrollingDown) { 
            scale = Math.max(1, scale - 0.3); // Smooth reduction
            textOverlay.style.transform = `scale(${scale})`;

            // Restore opacity smoothly
            opacity = Math.min(1, 1 - (scale - 1) / (maxScale - 1));
            textOverlay.style.opacity = opacity;
            blackCover.style.opacity = opacity;

            if (scale === 1) {
                lockScroll(false);
            }
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    let counter = document.getElementById("speedCounter");
    let audio = document.getElementById("engineSound");
    let speed = 0;
    let revving = false;
    let interval = null;

    // Start revving when "W" is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "w" && !revving) {
            revving = true;
            audio.play();

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
  