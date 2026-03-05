document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Find target section and make it active
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Ensure About section is visible on load
    const aboutSection = document.getElementById('about');
    const aboutLink = document.querySelector('a[href="#about"]');
    
    if (aboutSection && aboutLink) {
        aboutSection.classList.add('active');
        aboutLink.classList.add('active');
    }
});