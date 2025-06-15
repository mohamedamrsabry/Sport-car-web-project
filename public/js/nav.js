
function initNav () {
  const nav           = document.querySelector('nav');
  const toggle        = document.getElementById('sidebarToggle');
  const overlay       = document.getElementById('sidebarOverlay');
  if (!nav || !toggle || !overlay) return;

  
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-hidden', window.scrollY > last);
    last = window.scrollY;
  });

  
  toggle.addEventListener('click', () => overlay.classList.toggle('open'));
}


window.initNav = initNav;