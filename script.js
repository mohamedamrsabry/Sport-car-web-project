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

const goldLight = document.createElement("div");
goldLight.id = "gold-light";
document.body.appendChild(goldLight);

document.addEventListener("mousemove", (e) => {
    goldLight.style.left = `${e.clientX}px`;
    goldLight.style.top = `${e.clientY}px`; 
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
        document.body.style.overflow = lock ? "hidden" : "auto";
        isLocked = lock;
    }

    function checkScrollUnlock() {
        const sectionRect = transImageSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (sectionRect.bottom <= windowHeight && scale === 1) {
            lockScroll(true);
        } else if (scale <= 1) {
            lockScroll(false);
        }
    }

    window.addEventListener("scroll", checkScrollUnlock);

    window.addEventListener("wheel", (e) => {
        if (!isLocked) return;

        let deltaY = e.deltaY;
        isScrollingDown = deltaY > 0;

        if (isScrollingDown && scale < maxScale) { 
            scale += 5;
            textOverlay.style.transform = `scale(${scale})`;

            // Gradually decrease opacity based on scale
            opacity = Math.max(0, 1 - (scale - 1) / (maxScale - 1));
            textOverlay.style.opacity = opacity;
            blackCover.style.opacity = opacity; // Makes black cover fade out gradually

            if (scale >= maxScale) {
                lockScroll(false);
            }
        } else if (!isScrollingDown) { 
            scale -= 0.1;
            scale = Math.max(1, scale);
            textOverlay.style.transform = `scale(${scale})`;

            // Gradually restore opacity when scrolling up
            opacity = Math.min(1, 1 - (scale - 1) / (maxScale - 1));
            textOverlay.style.opacity = opacity;
            blackCover.style.opacity = opacity;

            if (scale === 1) {
                lockScroll(false);
                textOverlay.style.opacity = "1";
                blackCover.style.opacity = "1";
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
    grabCursor: true,
    centeredSlides: true,  
    spaceBetween: 20,
    loop:true,
    autoplay: {
      delay: 9500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable:true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });