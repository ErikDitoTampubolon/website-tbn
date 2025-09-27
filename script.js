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

    // Menambahkan kelas 'active' ke tautan navigasi berdasarkan posisi scroll
    const sections = document.querySelectorAll('section[id]'); // Hanya ambil section yang punya ID
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    const updateActiveLink = () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Tambahkan offset 100px

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Cek jika link mengarah ke section yang sedang aktif
            if (link.getAttribute('href').includes(current) && !link.getAttribute('href').includes('.html')) {
                link.classList.add('active');
            }
        });

        // Logika khusus untuk halaman `ongoing-projects.html`
        if (window.location.pathname.includes('ongoing-projects.html')) {
            document.querySelector('.main-nav ul li a[href="ongoing-projects.html"]').classList.add('active');
        } else if (window.location.pathname.includes('project-detail.html')) {
            document.querySelector('.main-nav ul li a[href="ongoing-projects.html"]').classList.add('active');
        } else {
             // Jika di halaman utama, berikan kelas active pada link "Beranda" saat scroll di atas
            if (window.scrollY < document.querySelector('.hero-section').offsetTop) {
                 document.querySelector('.main-nav ul li a[href="#beranda"]').classList.add('active');
            }
        }
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
    // ... (Kode JavaScript sebelumnya) ...

    // --- Fungsionalitas Image Zoom Modal (BARU) ---
    if (document.querySelector('.project-gallery-section')) {
        const imageModal = document.getElementById('imageModal');
        const modalImg = document.getElementById('img01');
        const closeBtn = document.querySelector('.close-button');
        const galleryCards = document.querySelectorAll('.gallery-card');

        // 1. Membuka Modal saat kartu diklik
        galleryCards.forEach(card => {
            card.addEventListener('click', function() {
                imageModal.style.display = 'block';
                // Menggunakan atribut data-src untuk sumber gambar yang diperbesar
                modalImg.src = this.dataset.src; 
                // Mencegah scroll pada body saat modal terbuka
                document.body.style.overflow = 'hidden'; 
            });
        });

        // 2. Menutup Modal saat tombol 'x' diklik
        closeBtn.addEventListener('click', function() {
            imageModal.style.display = 'none';
            // Mengaktifkan scroll kembali
            document.body.style.overflow = 'auto'; 
        });

        // 3. Menutup modal jika mengklik di luar gambar
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                imageModal.style.display = 'none';
                // Mengaktifkan scroll kembali
                document.body.style.overflow = 'auto'; 
            }
        });
    }

});

