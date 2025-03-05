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

