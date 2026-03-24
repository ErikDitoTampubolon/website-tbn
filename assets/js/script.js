document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // 1. SCROLL-REVEAL ANIMATION (Intersection Observer)
  // =================================================================
  const animateElements = document.querySelectorAll("[data-animate]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          revealObserver.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animateElements.forEach((el) => revealObserver.observe(el));

  // =================================================================
  // 2. GLASSMORPHISM HEADER on Scroll
  // =================================================================
  const header = document.querySelector(".main-header");

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // =================================================================
  // 3. Smooth Scrolling for internal nav links
  // =================================================================
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.offsetTop - headerHeight - 10;
        window.scrollTo({ top: elementPosition, behavior: "smooth" });
      }

      // Close mobile menu after click (except for dropdown triggers)
      if (window.innerWidth <= 992 && !this.classList.contains("dropdown-trigger")) {
        const mainNav = document.querySelector(".main-nav");
        mainNav.classList.remove("active");
      }
    });
  });

  // =================================================================
  // 4. Mobile menu toggle & Dropdown
  // =================================================================
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownTrigger = document.querySelector(".dropdown-trigger");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
    });

    // Mobile Dropdown Toggle
    if (dropdownTrigger && navDropdown) {
      dropdownTrigger.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          navDropdown.classList.toggle("active");
        }
      });
    }

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove("active");
        if (navDropdown) navDropdown.classList.remove("active");
      }
    });
  }

  // =================================================================
  // 5. Active navigation link (Scroll Spy)
  // =================================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav ul li a");

  const updateActiveLink = () => {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");

      // For non-index pages (legalitas.html, organisasi.html, etc.)
      if (
        linkHref === currentPath ||
        (linkHref.includes(currentPath) && !linkHref.includes("#"))
      ) {
        link.classList.add("active");
        return;
      }

      // Scroll spy for index page
      if (currentPath === "index.html" || currentPath === "") {
        let current = "";
        const headerElement = document.querySelector(".main-header");
        const headerHeight = headerElement ? headerElement.offsetHeight : 0;
        const scrollPosition = window.scrollY + headerHeight + 50;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            current = section.getAttribute("id");
          }
        });

        if (
          linkHref.includes("#" + current) &&
          (linkHref.startsWith("#") || linkHref.includes("index.html"))
        ) {
          link.classList.add("active");
        }

        if (
          window.scrollY < headerHeight &&
          (linkHref.includes("#beranda") || linkHref === "index.html")
        ) {
          link.classList.add("active");
        }
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
  updateActiveLink();

  // =================================================================
  // 6. Image Zoom Modal (project detail pages)
  // =================================================================
  if (document.querySelector(".project-gallery-section")) {
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const closeBtn = document.querySelector(".close-button");
    const galleryCards = document.querySelectorAll(".gallery-card");

    galleryCards.forEach((card) => {
      card.addEventListener("click", function () {
        imageModal.style.display = "block";
        modalImg.src = this.dataset.src;
        document.body.style.overflow = "hidden";
      });
    });

    closeBtn.addEventListener("click", function () {
      imageModal.style.display = "none";
      document.body.style.overflow = "auto";
    });

    imageModal.addEventListener("click", function (e) {
      if (e.target === imageModal) {
        imageModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  // =================================================================
  // 7. HERO SLIDESHOW — Smooth horizontal slide
  // =================================================================
  const heroSlideshow = document.querySelector(".hero-slideshow");
  if (heroSlideshow) {
    let currentSlide = 0;
    const totalSlides = heroSlideshow.querySelectorAll(".hero-slide").length;

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      const translateX = -currentSlide * 25;
      heroSlideshow.style.transform = `translateX(${translateX}%)`;
    }

    setInterval(nextSlide, 6000);
  }

  // =================================================================
  // 8. PROJECT TIMELINE — Year Tab Switching
  // =================================================================
  const timelineDots = document.querySelectorAll(".timeline-dot");
  const yearPanels = document.querySelectorAll(".project-year-panel");

  timelineDots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const selectedYear = this.dataset.year;

      // Update active dot
      timelineDots.forEach((d) => d.classList.remove("active"));
      this.classList.add("active");

      // Show matching panel with animation
      yearPanels.forEach((panel) => {
        if (panel.dataset.panel === selectedYear) {
          panel.classList.add("active");
          // Re-trigger animation by removing and re-adding class
          panel.style.animation = "none";
          panel.offsetHeight; // Force reflow
          panel.style.animation = "";

          // Make cards visible immediately (they may have data-animate)
          panel.querySelectorAll("[data-animate]").forEach((el) => {
            el.classList.add("animate-in");
          });
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // =================================================================
  // 9. INTERACTIVE MAP — Tooltips, Sidebar, & Filtering
  // =================================================================
  const mapMarkers = document.querySelectorAll(".map-marker");
  const mapTooltip = document.getElementById("mapTooltip");
  const mapContainer = document.querySelector(".map-container");
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (mapMarkers.length && mapTooltip && mapContainer) {
    
    // --- Tooltip Logic ---
    const showTooltip = (marker, x, y) => {
      const { project, location, img, category } = marker.dataset;
      
      mapTooltip.querySelector(".tooltip-project").textContent = project;
      mapTooltip.querySelector(".tooltip-location").textContent = location;
      mapTooltip.querySelector(".tooltip-category").textContent = category;
      
      const imgEl = mapTooltip.querySelector(".tooltip-img");
      if (img) {
        imgEl.src = img;
        mapTooltip.querySelector(".tooltip-img-wrapper").style.display = "block";
      } else {
        mapTooltip.querySelector(".tooltip-img-wrapper").style.display = "none";
      }
      
      mapTooltip.style.left = x + 20 + "px";
      mapTooltip.style.top = y - 40 + "px";
      mapTooltip.classList.add("visible");
      
      // Keep tooltip from going off-screen right
      const rect = mapContainer.getBoundingClientRect();
      const tooltipRect = mapTooltip.getBoundingClientRect();
      if (tooltipRect.right > rect.right) {
        mapTooltip.style.left = x - tooltipRect.width - 20 + "px";
      }
    };

    const hideTooltip = () => {
      mapTooltip.classList.remove("visible");
    };

    mapMarkers.forEach((marker, index) => {
      marker.addEventListener("mouseenter", function (e) {
        const rect = mapContainer.getBoundingClientRect();
        showTooltip(this, e.clientX - rect.left, e.clientY - rect.top);
        
        // Sync with sidebar
        sidebarItems.forEach(item => {
          if (parseInt(item.dataset.markerIndex) === index) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      });

      marker.addEventListener("mousemove", function (e) {
        const rect = mapContainer.getBoundingClientRect();
        showTooltip(this, e.clientX - rect.left, e.clientY - rect.top);
      });

      marker.addEventListener("mouseleave", function () {
        hideTooltip();
        sidebarItems.forEach(item => item.classList.remove("active"));
      });
      
      // Touch for mobile
      marker.addEventListener("touchstart", function (e) {
        e.preventDefault();
        const rect = mapContainer.getBoundingClientRect();
        const touch = e.touches[0];
        showTooltip(this, touch.clientX - rect.left, touch.clientY - rect.top);
      });
    });

    // --- Sidebar Interaction ---
    sidebarItems.forEach(item => {
      item.addEventListener("mouseenter", function() {
        const markerIndex = parseInt(this.dataset.markerIndex);
        const targetMarker = mapMarkers[markerIndex];
        
        if (targetMarker) {
          targetMarker.classList.add("active");
          // Trigger tooltip at marker position
          const rect = mapContainer.getBoundingClientRect();
          const markerRect = targetMarker.getBoundingClientRect();
          showTooltip(targetMarker, markerRect.left - rect.left + 6, markerRect.top - rect.top + 6);
        }
      });
      
      item.addEventListener("mouseleave", function() {
        const markerIndex = parseInt(this.dataset.markerIndex);
        const targetMarker = mapMarkers[markerIndex];
        if (targetMarker) targetMarker.classList.remove("active");
        hideTooltip();
      });
    });

    // --- Filtering Logic ---
    filterBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const filter = this.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        
        // Update markers and sidebar items
        mapMarkers.forEach((marker, index) => {
          const category = marker.dataset.category;
          const sidebarItem = Array.from(sidebarItems).find(si => parseInt(si.dataset.markerIndex) === index);
          
          if (filter === "all" || category === filter) {
            marker.classList.remove("hidden");
            if (sidebarItem) sidebarItem.style.display = "flex";
          } else {
            marker.classList.add("hidden");
            if (sidebarItem) sidebarItem.style.display = "none";
          }
        });
      });
    });
  }
});
