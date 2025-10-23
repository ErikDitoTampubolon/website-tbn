document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // 1. Smooth Scrolling untuk link navigasi internal (link yang diawali '#')
  // =================================================================
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }

      // Tutup menu mobile setelah mengklik link (jika di tampilan mobile)
      if (window.innerWidth <= 992) {
        const mainNav = document.querySelector(".main-nav");
        mainNav.classList.remove("active");
      }
    });
  });

  // =================================================================
  // 2. Toggle menu mobile
  // =================================================================
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
    });
  }

  // =================================================================
  // 3. Menambahkan kelas 'active' ke tautan navigasi (FIX UTAMA)
  // =================================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav ul li a");

  const updateActiveLink = () => {
    // Mendapatkan nama file saat ini (contoh: index.html, ongoing-projects.html, atau string kosong jika di root)
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");

      // --- Logika untuk Halaman Non-Index (ongoing-projects.html, legalitas.html) ---
      // Cek apakah linkHref mengandung nama file saat ini DAN BUKAN link internal ('#')
      if (
        linkHref === currentPath ||
        (linkHref.includes(currentPath) && !linkHref.includes("#"))
      ) {
        link.classList.add("active");
        return; // Hentikan pemeriksaan scroll untuk halaman non-index
      }

      // --- Logika Scroll Spy untuk Halaman Index (index.html) ---
      if (currentPath === "index.html" || currentPath === "") {
        let current = "";
        // Ambil offset untuk header agar penandaan aktif lebih akurat
        const headerElement = document.querySelector(".main-header");
        const headerHeight = headerElement ? headerElement.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 50;

        // 1. Tentukan bagian (section) saat ini
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            current = section.getAttribute("id");
          }
        });

        // 2. Berikan kelas 'active' pada tautan internal yang sesuai
        if (
          linkHref.includes("#" + current) &&
          (linkHref.startsWith("#") || linkHref.includes("index.html"))
        ) {
          link.classList.add("active");
        }

        // Atur Beranda aktif saat di bagian paling atas
        if (
          window.scrollY < headerHeight &&
          (linkHref.includes("#beranda") || linkHref === "index.html")
        ) {
          link.classList.add("active");
        }
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
  // Jalankan sekali saat DOM selesai dimuat untuk mengatur link default
  updateActiveLink();

  // =================================================================
  // 4. Fungsionalitas Image Zoom Modal (project-detail.html)
  // =================================================================
  if (document.querySelector(".project-gallery-section")) {
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const closeBtn = document.querySelector(".close-button");
    const galleryCards = document.querySelectorAll(".gallery-card");

    // Membuka Modal saat kartu diklik
    galleryCards.forEach((card) => {
      card.addEventListener("click", function () {
        imageModal.style.display = "block";
        modalImg.src = this.dataset.src;
        document.body.style.overflow = "hidden"; // Mencegah scroll pada body
      });
    });

    // Menutup Modal saat tombol 'x' diklik
    closeBtn.addEventListener("click", function () {
      imageModal.style.display = "none";
      document.body.style.overflow = "auto"; // Mengaktifkan scroll kembali
    });

    // Menutup modal jika mengklik di luar gambar
    imageModal.addEventListener("click", function (e) {
      if (e.target === imageModal) {
        imageModal.style.display = "none";
        document.body.style.overflow = "auto"; // Mengaktifkan scroll kembali
      }
    });
  }

  // =================================================================
  // 5. Animate progress circle (jika ada) atau progress bar di halaman detail
  // =================================================================
  if (document.querySelector(".project-detail-content")) {
    // Logika tambahan untuk animasi progress bar jika ada di halaman detail.
    // Karena kodenya tidak lengkap, ini hanya sebagai placeholder.
  }

  // =================================================================
  // 6. SLIDESHOW HORIZONTAL - BERGESER KE KANAN (LOOPING)
  // =================================================================
  const heroSlideshow = document.querySelector(".hero-slideshow");
  if (heroSlideshow) {
    let currentSlide = 0;
    const totalSlides = 3; // Sesuaikan dengan jumlah gambar

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      const translateX = -currentSlide * 25; // 25% per slide
      heroSlideshow.style.transform = `translateX(${translateX}%)`;
    }

    // Mulai slideshow - ganti setiap 8 detik (8000ms)
    setInterval(nextSlide, 8000);
  }
}); // Tutup dari DOMContentLoaded
