async function inject(el) {
  const file = el.dataset.include;
  el.innerHTML = await (await fetch(file)).text();
  el.removeAttribute('data-include');
}

async function includeHTML () {
  const holders = document.querySelectorAll('[data-include]');
  for (const h of holders) await inject(h);

  /* fragments are now in the DOM – wire their JS */
  window.initNav && window.initNav();
}

document.addEventListener('DOMContentLoaded', includeHTML);