document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling untuk link navigasi
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Tutup menu mobile setelah mengklik link
            if (window.innerWidth <= 992) {
                const mainNav = document.querySelector('.main-nav');
                mainNav.classList.remove('active');
            }
        });
    });

    // Toggle menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Menambahkan kelas 'active' ke tautan navigasi
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    // Fungsi untuk memperbarui tautan aktif
    const updateActiveLink = () => {
        const currentPath = window.location.pathname.split('/').pop();

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href').split('/').pop();
            
            // Logika untuk halaman "Proyek Kami" dan "Detail Proyek"
            if (currentPath === 'ongoing-projects.html' || currentPath === 'project-detail.html') {
                if (linkPath === 'ongoing-projects.html') {
                    link.classList.add('active');
                }
            } else if (link.getAttribute('href').includes(currentPath) || (link.getAttribute('href') === 'index.html#beranda' && currentPath === '')) {
                // Logika untuk halaman utama berdasarkan section ID
                const sections = document.querySelectorAll('section[id]');
                let currentSection = '';
                const scrollPosition = window.scrollY + 100;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });

                if (link.getAttribute('href').includes(currentSection)) {
                    link.classList.add('active');
                }
                
                // Jika di bagian paling atas, tandai "Beranda" aktif
                if (window.scrollY === 0) {
                    document.querySelector('a[href="index.html#beranda"]').classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    
    // Animate progress circle for project detail page
    function animateProgressCircle() {
        const progressCircles = document.querySelectorAll('.progress-circle');

        progressCircles.forEach(circle => {
            const progress = circle.dataset.progress;
            const deg = (progress / 100) * 360;
            const fill = circle.querySelector('.circle-fill');
            const fillFix = circle.querySelector('.circle-fill-fix');
            const halfMask = circle.querySelector('.circle-mask-half');

            if (progress > 50) {
                halfMask.style.zIndex = 1;
                fillFix.style.transform = 'rotate(180deg)';
                fill.style.transform = `rotate(${deg}deg)`;
            } else {
                halfMask.style.zIndex = 0;
                fillFix.style.transform = 'rotate(0deg)';
                fill.style.transform = `rotate(${deg}deg)`;
            }
        });
    }

    if (document.querySelector('.project-detail-content')) {
        animateProgressCircle();
    }
});