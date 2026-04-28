const logoWrapper = document.getElementById('logo-wrapper');
const logoTrigger = document.getElementById('logo-trigger');

// Toggles the radiating menu when the Kleio logo is clicked
logoTrigger.addEventListener('click', (e) => {
    logoWrapper.classList.toggle('active');
    e.stopPropagation();
});

// Closes the menu if you click anywhere else on the page
document.addEventListener('click', (e) => {
    if (!logoWrapper.contains(e.target)) {
        logoWrapper.classList.remove('active');
    }
});