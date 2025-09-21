document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            if (window.innerWidth <= 992) { // Sesuaikan breakpoint mobile
                const mainNav = document.querySelector('.main-nav');
                mainNav.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Add active class to current section in navigation (optional)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - sectionHeight / 3) { // Adjust as needed
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Hover effect for project items (already handled by CSS, but JS can add more complex interactions)
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('mouseover', () => {
            // Optional: Add more complex animations or tooltips with JS
        });
        item.addEventListener('mouseout', () => {
            // Optional: Revert complex animations
        });
        item.addEventListener('click', () => {
            // Placeholder for "view project details" functionality
            alert('Anda mengklik proyek: ' + item.querySelector('h3').innerText);
            // In a real application, this would open a modal or navigate to a project detail page
        });
    });

    // Form submission (placeholder for actual functionality)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan Anda telah terkirim! (Fungsi sebenarnya akan membutuhkan backend)');
            this.reset(); // Clear form fields
        });
    }
});