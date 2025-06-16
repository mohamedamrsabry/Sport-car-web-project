async function inject(el) {
    const file = el.dataset.include;
    el.innerHTML = await (await fetch(file)).text();
    el.removeAttribute('data-include');
}
async function includeHTML() {
    const holders = document.querySelectorAll('[data-include]');
    for (const h of holders) await inject(h);
    window.initNav && window.initNav();
    if (document.getElementById('newsletterForm')) {
        const overlay = document.getElementById('newsletterOverlay');
        if (overlay) {
            overlay.addEventListener('click', window.closeNewsletterMessage);
        }
        window.initNewsletter && window.initNewsletter();
    }
}
document.addEventListener('DOMContentLoaded', includeHTML);