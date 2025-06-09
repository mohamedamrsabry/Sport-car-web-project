/* nav.js – put ALL nav behaviour inside initNav() */
function initNav () {
  const nav           = document.querySelector('nav');
  const toggle        = document.getElementById('sidebarToggle');
  const overlay       = document.getElementById('sidebarOverlay');
  if (!nav || !toggle || !overlay) return;      // fragment missing

  /* hide-on-scroll */
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-hidden', window.scrollY > last);
    last = window.scrollY;
  });

  /* hamburger open / close */
  toggle.addEventListener('click', () => overlay.classList.toggle('open'));
}

/* make it visible for include.js */
window.initNav = initNav;