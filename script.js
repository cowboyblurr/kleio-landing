const logoWrapper = document.getElementById('logo-wrapper');
const logoTrigger = document.getElementById('logo-trigger');
const socialTrigger = document.getElementById('social-trigger');
const heroVideo = document.querySelector('.hero-video');

// Toggles the radiating menu when the Kleio logo is clicked
if (logoTrigger && logoWrapper) {
    logoTrigger.addEventListener('click', (e) => {
        const isActive = logoWrapper.classList.toggle('active');
        if (!isActive) {
            logoWrapper.classList.remove('social-open');
            if (socialTrigger) socialTrigger.setAttribute('aria-expanded', 'false');
        }
        e.stopPropagation();
    });
}

if (socialTrigger && logoWrapper) {
    socialTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!logoWrapper.classList.contains('active')) {
            logoWrapper.classList.add('active');
        }

        const isOpen = logoWrapper.classList.toggle('social-open');
        socialTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

// Closes the menu if you click anywhere else on the page
document.addEventListener('click', (e) => {
    if (logoWrapper && !logoWrapper.contains(e.target)) {
        logoWrapper.classList.remove('active');
        logoWrapper.classList.remove('social-open');
        if (socialTrigger) socialTrigger.setAttribute('aria-expanded', 'false');
    }
});

// Prevent first-frame resize flash: reveal video only at ready scale
if (document.body.classList.contains('landing-page') && heroVideo) {
    const showVideo = () => {
        document.body.classList.add('video-ready');
    };

    if (heroVideo.readyState >= 1) {
        showVideo();
    } else {
        heroVideo.addEventListener('loadedmetadata', showVideo, { once: true });
        heroVideo.addEventListener('canplay', showVideo, { once: true });
        setTimeout(showVideo, 1200);
    }
}