
let cookiePreferences = {
    essential: true,
    analytics: false,
    marketing: false
};


window.addEventListener('load', function() {
    if (!getCookie('cookieConsent')) {
        setTimeout(() => {
            document.getElementById('cookieConsentOverlay').classList.add('show');
        }, 1000);
    }
});

function acceptAllCookies() {
    cookiePreferences = {
        essential: true,
        analytics: true,
        marketing: true
    };
    setCookie('cookieConsent', JSON.stringify(cookiePreferences), 365);
    hidePopup();
    

    initializeAnalytics();
    initializeMarketing();
    
    console.log('All cookies accepted');
}

function declineCookies() {
    cookiePreferences = {
        essential: true,
        analytics: false,
        marketing: false
    };
    setCookie('cookieConsent', JSON.stringify(cookiePreferences), 365);
    hidePopup();
    
    console.log('Cookies declined');
}

function toggleSettings() {
    const settings = document.getElementById('cookieSettings');
    settings.classList.toggle('show');
}

function toggleCookie(element, type) {
    if (element.dataset.required === 'true') return;
    
    element.classList.toggle('active');
    cookiePreferences[type] = element.classList.contains('active');
}

function saveCustomSettings() {
    setCookie('cookieConsent', JSON.stringify(cookiePreferences), 365);
    hidePopup();
    
    
    if (cookiePreferences.analytics) {
        initializeAnalytics();
    }
    if (cookiePreferences.marketing) {
        initializeMarketing();
    }
    
    console.log('Custom preferences saved:', cookiePreferences);
}

function hidePopup() {
    document.getElementById('cookieConsentOverlay').classList.remove('show');
}


function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function initializeAnalytics() {
    
    console.log('Analytics initialized');
    
   
}

function initializeMarketing() {
    
    console.log('Marketing cookies initialized');
    
   
}


window.addEventListener('load', function() {
    const existingConsent = getCookie('cookieConsent');
    if (existingConsent) {
        try {
            cookiePreferences = JSON.parse(existingConsent);
            
           
            if (cookiePreferences.analytics) {
                initializeAnalytics();
            }
            if (cookiePreferences.marketing) {
                initializeMarketing();
            }
        } catch (e) {
            console.error('Error parsing cookie preferences:', e);
        }
    }
});