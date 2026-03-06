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

    // Handle "Let's Work Together" button navigation
    const workTogetherBtn = document.querySelector('a[href="#contact"].btn-primary');
    if (workTogetherBtn) {
        workTogetherBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            // Find and activate contact section
            const contactSection = document.getElementById('contact');
            const contactLink = document.querySelector('a[href="#contact"].nav-link');
            
            if (contactSection) {
                contactSection.classList.add('active');
            }
            
            if (contactLink) {
                contactLink.classList.add('active');
            }
        });
    }

    // Ensure About section is visible on load
    const aboutSection = document.getElementById('about');
    const aboutLink = document.querySelector('a[href="#about"]');
    
    if (aboutSection && aboutLink) {
        aboutSection.classList.add('active');
        aboutLink.classList.add('active');
    }

    // Handle pending demo clicks
    const pendingDemoButtons = document.querySelectorAll('.project-card:has(.pending-badge) .btn-primary-pill');
    
    pendingDemoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create pending animation overlay
            const pendingOverlay = document.createElement('div');
            pendingOverlay.className = 'pending-overlay';
            pendingOverlay.innerHTML = `
                <div class="pending-modal">
                    <div class="pending-icon">
                        <div class="pending-spinner"></div>
                    </div>
                    <h3>Project Pending</h3>
                    <p>This project is currently under development and will be available soon!</p>
                    <button class="pending-close-btn">Got it!</button>
                </div>
            `;
            
            document.body.appendChild(pendingOverlay);
            
            // Add fade-in animation
            setTimeout(() => {
                pendingOverlay.classList.add('active');
            }, 10);
            
            // Handle close button
            const closeBtn = pendingOverlay.querySelector('.pending-close-btn');
            closeBtn.addEventListener('click', () => {
                pendingOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(pendingOverlay);
                }, 300);
            });
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                if (document.body.contains(pendingOverlay)) {
                    pendingOverlay.classList.remove('active');
                    setTimeout(() => {
                        if (document.body.contains(pendingOverlay)) {
                            document.body.removeChild(pendingOverlay);
                        }
                    }, 300);
                }
            }, 5000);
        });
    });
});