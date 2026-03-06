document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    (function() {
        emailjs.init("GFn0FaPdvV9wU85_T"); // Replace with your EmailJS public key
    })();

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

    // Handle contact form submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Send email using EmailJS
            emailjs.send('service_1iridbm', 'template_9zf6ira', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    showNotification('Failed to send message. Please try again.', 'error');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Function to show notifications
    function showNotification(message, type) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
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