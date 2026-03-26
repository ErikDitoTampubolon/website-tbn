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
        } else {
          // Remove class when element is out of view so it can animate again
          const rect = entry.target.getBoundingClientRect();
          // We only reset if it's outside the viewport bounds
          if (rect.top > window.innerHeight || rect.bottom < 0) {
             entry.target.classList.remove("animate-in");
          }
        }
      });
    },
    {
      threshold: 0.15, // Slightly higher threshold for better visibility
      rootMargin: "0px 0px -80px 0px", // Trigger earlier from bottom
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
      const isDropdownTrigger = this.classList.contains("dropdown-trigger");
      if (window.innerWidth <= 992 && !isDropdownTrigger) {
        const mainNav = document.querySelector(".main-nav");
        mainNav.classList.remove("active");
      }

      // Handle mobile dropdown toggle
      if (window.innerWidth <= 992 && isDropdownTrigger) {
        e.preventDefault();
        const parent = this.closest(".nav-dropdown");
        parent.classList.toggle("active");
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
  // 8. PROYEK KAMI — HISTORICAL LINEAR TIMELINE
  // =================================================================
  const timelineDots = document.querySelectorAll(".timeline-dot");
  const yearPanels = document.querySelectorAll(".project-year-panel");
  const projectCards = document.querySelectorAll(".project-item, .reason-item");

  if (timelineDots.length > 0 && yearPanels.length > 0) {
    const timelineProgress = document.querySelector(".timeline-progress");
    const timelineContainer = document.querySelector(".historical-timeline-container");
    const timelineTrack = document.querySelector(".timeline-track");

    const updateProgress = (year) => {
      if (!timelineProgress) return;
      timelineProgress.style.width = year === "2025" ? "100%" : "0%";
    };

    // Initial state
    const activeBtn = document.querySelector(".timeline-dot.active");
    if (activeBtn) updateProgress(activeBtn.dataset.year);

    timelineDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const year = dot.dataset.year;
        updateProgress(year);

        // Update active dot
        timelineDots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        // Switch panels with staggered reveal
        yearPanels.forEach((panel) => {
          if (panel.dataset.panel === year) {
            panel.classList.add("active");
            
            // Staggered reveal for cards inside the panel
            const cardsInPanel = panel.querySelectorAll(".project-item");
            cardsInPanel.forEach((card, index) => {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              setTimeout(() => {
                card.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, index * 100);
            });
          } else {
            panel.classList.remove("active");
          }
        });
      });
    });

    // Parallax Effect
    if (timelineContainer && timelineTrack) {
      timelineContainer.addEventListener("mousemove", (e) => {
        const rect = timelineContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        timelineTrack.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
      });

      timelineContainer.addEventListener("mouseleave", () => {
        timelineTrack.style.transform = `rotateY(0deg) rotateX(0deg)`;
      });
    }
  }

  // 3D Tilt Effect
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)`;
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
      const { project, location, img, category, desc, link } = marker.dataset;
      
      mapTooltip.querySelector(".tooltip-project").textContent = project;
      mapTooltip.querySelector(".tooltip-location").textContent = location;
      mapTooltip.querySelector(".tooltip-category").textContent = category;
      mapTooltip.querySelector(".tooltip-desc").textContent = desc || "";
      
      const imgEl = mapTooltip.querySelector(".tooltip-img");
      if (img) {
        imgEl.src = img;
        mapTooltip.querySelector(".tooltip-img-wrapper").style.display = "block";
      } else {
        mapTooltip.querySelector(".tooltip-img-wrapper").style.display = "none";
      }
      
      const detailBtn = mapTooltip.querySelector(".btn-tooltip");
      if (link) {
        detailBtn.dataset.link = link;
        detailBtn.onclick = () => window.location.href = link;
      }

      let finalX = x + 20;
      let finalY = y - 40;

      // Temporarily show to get dimensions
      mapTooltip.classList.add("visible");
      const rect = mapContainer.getBoundingClientRect();
      const tooltipRect = mapTooltip.getBoundingClientRect();

      // Horizontal boundary check
      if (finalX + tooltipRect.width > rect.width) {
        finalX = x - tooltipRect.width - 20;
      }
      if (finalX < 0) finalX = 10;

      // Vertical boundary check
      if (finalY + tooltipRect.height > rect.height) {
        finalY = y - tooltipRect.height - 20;
      }
      if (finalY < 0) finalY = 10;

      mapTooltip.style.left = finalX + "px";
      mapTooltip.style.top = finalY + "px";
    };

    let hideTimeout;

    const hideTooltip = () => {
      hideTimeout = setTimeout(() => {
        mapTooltip.classList.remove("visible");
      }, 300); // 300ms grace period to move cursor to tooltip
    };

    mapTooltip.addEventListener("mouseenter", () => {
      clearTimeout(hideTimeout);
    });

    mapTooltip.addEventListener("mouseleave", () => {
      hideTooltip();
    });

    mapMarkers.forEach((marker, index) => {
      marker.addEventListener("mouseenter", function (e) {
        clearTimeout(hideTimeout);
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
        clearTimeout(hideTimeout);
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

  // =================================================================
  // 10. SPOTLIGHT HOVER EFFECT — Local Mouse Tracking
  // =================================================================
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // =================================================================
  // 11. EQUIPMENT GALLERY SLIDER
  // =================================================================
  const equipmentSection = document.querySelector(".equipment-section");
  const track = equipmentSection?.querySelector(".equipment-track");
  const slides = equipmentSection?.querySelectorAll(".equipment-slide");
  const nextBtn = equipmentSection?.querySelector(".next-btn");
  const prevBtn = equipmentSection?.querySelector(".prev-btn");
  const dotsContainer = equipmentSection?.querySelector(".slider-dots");

  if (track && slides.length > 0) {
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
      });
    }

    // Optional: Auto-play
    let autoPlay = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }, 6000);

    const stopAutoPlay = () => clearInterval(autoPlay);
    if (nextBtn) nextBtn.addEventListener("click", stopAutoPlay);
    if (prevBtn) prevBtn.addEventListener("click", stopAutoPlay);
    dots.forEach(dot => dot.addEventListener("click", stopAutoPlay));
  }

  // =================================================================
  // 12. EQUIPMENT MAGNIFYING GLASS EFFECT
  // =================================================================
  const magnifierLens = document.querySelector(".magnifier-lens");
  const equipmentSlides = document.querySelectorAll(".equipment-slide");

  if (magnifierLens && equipmentSlides.length > 0) {
    equipmentSlides.forEach((slide) => {
      const img = slide.querySelector("img");
      
      slide.addEventListener("mousemove", (e) => {
        const rect = slide.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position the lens
        const lensWidth = magnifierLens.offsetWidth;
        const lensHeight = magnifierLens.offsetHeight;
        
        // Offset to center the lens on the cursor
        // Since the lens is absolute to the container (which might be the slider wrapper), 
        // we need to be careful. But better set it fixed or relative to the slide.
        // For simplicity, let's use the container's relative position.
        const containerRect = document.querySelector(".equipment-slider-container").getBoundingClientRect();
        const lensX = e.clientX - containerRect.left - lensWidth / 2;
        const lensY = e.clientY - containerRect.top - lensHeight / 2;

        magnifierLens.style.left = `${lensX}px`;
        magnifierLens.style.top = `${lensY}px`;

        // Background zoom logic
        const zoom = 2; // 2x Zoom
        const bgX = (x / rect.width) * 100;
        const bgY = (y / rect.height) * 100;

        magnifierLens.style.backgroundImage = `url('${img.src}')`;
        magnifierLens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
        magnifierLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
      });

      slide.addEventListener("mouseenter", () => {
        magnifierLens.classList.add("magnifier-active");
      });

      slide.addEventListener("mouseleave", () => {
        magnifierLens.classList.remove("magnifier-active");
      });
    });
  }
});

// =================================================================
// LANGUAGE SWITCHING LOGIC (ID, EN, ZH)
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
  const langBtns = document.querySelectorAll('.lang-btn');
  
  function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;

    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        // Check if element has an icon child to preserve it
        const icon = el.querySelector('i');
        if (icon) {
          const iconHtml = icon.outerHTML;
          // If it's a dropdown trigger, we might need to handle the placement
          if (el.classList.contains('dropdown-trigger')) {
             el.innerHTML = `${translations[lang][key]} ${iconHtml}`;
          } else {
             // For buttons with icons at the end
             el.innerHTML = `${translations[lang][key]} ${iconHtml}`;
          }
        } else {
          el.innerHTML = translations[lang][key];
        }
      }
    });

    // Update active button state
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Save preference
    localStorage.setItem('tbn-lang', lang);
    document.documentElement.lang = lang;
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
    });
  });

  // Init language on load
  const savedLang = localStorage.getItem('tbn-lang') || 'id';
  if (savedLang !== 'id') {
    setLanguage(savedLang);
  }
  // =================================================================
  // 11. Project Statistics Counter Animation
  // =================================================================
  const statsSection = document.querySelector(".map-stats");
  const statNumbers = document.querySelectorAll(".stat-number");
  let started = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    // Add a slight delay before starting to sync with entrance animation
    setTimeout(() => {
      const timer = setInterval(() => {
        current += 1;
        el.textContent = current;
        if (current === target) {
          clearInterval(timer);
        }
      }, stepTime);
    }, 400);
  }

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            statNumbers.forEach((num) => animateCounter(num));
            started = true; // Only animate once per page load
          }
        });
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
  }
  // ============================================
  // DOCUMENT PREVIEW MODAL — ADVANCED LOGIC
  // ============================================
  const docModal = document.getElementById('docPreviewModal');
  const docImg = document.getElementById('docPreviewImg');
  const docTitle = document.getElementById('docModalTitle');
  const docLoader = document.getElementById('docLoader');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');
  const rotateDocBtn = document.getElementById('rotateDoc');
  const printDocBtn = document.getElementById('printDoc');
  const downloadDocBtn = document.getElementById('downloadDoc');
  const prevDocBtn = document.getElementById('prevDoc');
  const nextDocBtn = document.getElementById('nextDoc');
  const docZoomContainer = document.querySelector('.doc-zoom-container');
  const docModalBody = document.querySelector('.doc-modal-body');
  const closeDocModal = document.querySelector('.doc-modal-close');
  const docOverlay = document.querySelector('.doc-modal-overlay');

  let currentZoom = 1;
  let currentRotation = 0;
  let allPreviewBtns = [];
  let currentIndex = -1;

  // Drag-to-Pan State
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  if (docModal) {
    allPreviewBtns = Array.from(document.querySelectorAll('.btn-preview-doc'));

    const updateDoc = (index) => {
      if (index < 0 || index >= allPreviewBtns.length) return;
      
      currentIndex = index;
      const btn = allPreviewBtns[currentIndex];
      const src = btn.getAttribute('data-doc-src');
      const title = btn.getAttribute('data-doc-title');

      // Show loader
      if (docLoader) docLoader.classList.add('active');
      docImg.style.opacity = '0';
      
      docImg.src = src;
      docTitle.textContent = title || "Preview Dokumen";
      
      resetZoom();
      currentRotation = 0;
      updateTransform();
    };

    docImg.onload = () => {
      if (docLoader) docLoader.classList.remove('active');
      docImg.style.opacity = '1';
    };

    const updateTransform = () => {
      docImg.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
      if (zoomResetBtn) zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
    };

    function resetZoom() {
      currentZoom = 1;
      updateTransform();
    }

    // Open Modal
    allPreviewBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        updateDoc(idx);
        docModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModalFunc = () => {
      docModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeDocModal) closeDocModal.addEventListener('click', closeModalFunc);
    if (docOverlay) docOverlay.addEventListener('click', closeModalFunc);

    // Zoom Controls
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 4) { currentZoom += 0.2; updateTransform(); }
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 0.4) { currentZoom -= 0.2; updateTransform(); }
      });
    }
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);

    // Rotation
    if (rotateDocBtn) {
      rotateDocBtn.addEventListener('click', () => {
        currentRotation += 90;
        updateTransform();
      });
    }

    // Carousel
    if (prevDocBtn) {
      prevDocBtn.addEventListener('click', () => {
        let newIdx = currentIndex - 1;
        if (newIdx < 0) newIdx = allPreviewBtns.length - 1;
        updateDoc(newIdx);
      });
    }
    if (nextDocBtn) {
      nextDocBtn.addEventListener('click', () => {
        let newIdx = (currentIndex + 1) % allPreviewBtns.length;
        updateDoc(newIdx);
      });
    }

    // Print
    if (printDocBtn) {
      printDocBtn.addEventListener('click', () => {
        const printWin = window.open('', '_blank');
        printWin.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center;"><img src="${docImg.src}" style="max-width:100%;"></body></html>`);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 500);
      });
    }

    // Download
    if (downloadDocBtn) {
      downloadDocBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = docImg.src;
        link.download = docTitle.textContent.replace(/\s+/g, '-').toLowerCase() || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Drag-to-Pan Logic
    if (docModalBody) {
      docModalBody.addEventListener('mousedown', (e) => {
        if (currentZoom <= 1 && currentRotation % 360 === 0) return;
        isDragging = true;
        docModalBody.style.cursor = 'grabbing';
        startX = e.pageX - docModalBody.offsetLeft;
        startY = e.pageY - docModalBody.offsetTop;
        scrollLeft = docModalBody.scrollLeft;
        scrollTop = docModalBody.scrollTop;
      });

      docModalBody.addEventListener('mouseleave', () => { isDragging = false; docModalBody.style.cursor = 'grab'; });
      docModalBody.addEventListener('mouseup', () => { isDragging = false; docModalBody.style.cursor = 'grab'; });

      docModalBody.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - docModalBody.offsetLeft;
        const y = e.pageY - docModalBody.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        docModalBody.scrollLeft = scrollLeft - walkX;
        docModalBody.scrollTop = scrollTop - walkY;
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!docModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModalFunc();
      if (e.key === 'ArrowLeft') prevDocBtn.click();
      if (e.key === 'ArrowRight') nextDocBtn.click();
      if (e.key === '=') zoomInBtn.click();
      if (e.key === '-') zoomOutBtn.click();
      if (e.key === 'r' || e.key === 'R') rotateDocBtn.click();
    });
  }

  // =================================================================
  // 13. UNIVERSAL MOBILE CAROUSEL ENGINE (Swipe, Infinite, Auto-play)
  // =================================================================
  class UniversalCarousel {
    constructor(selector, options = {}) {
      this.track = document.querySelector(selector);
      if (!this.track) return;
      this.container = this.track.parentElement;
      this.options = { 
        autoplay: false, 
        interval: 4000, 
        gap: 20, 
        isInfinite: true,
        ...options 
      };
      
      this.originalItems = Array.from(this.track.children);
      if (this.originalItems.length === 0) return;

      // Only enable on mobile if specified
      if (this.options.mobileOnly && window.innerWidth > 768) return;

      this.init();
    }

    init() {
      // Setup Infinite Loop Clones
      if (this.options.isInfinite) {
        this.originalItems.forEach(item => this.track.appendChild(item.cloneNode(true)));
        this.originalItems.forEach(item => this.track.prepend(item.cloneNode(true)));
      }

      this.items = Array.from(this.track.children);
      this.setSize = this.options.isInfinite ? this.originalItems.length : 0;
      this.currentIndex = this.setSize;
      this.isDragging = false;
      this.startPos = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.animationID = 0;
      this.autoPlayInterval = null;

      this.updateWidths();
      this.setInitialPosition();
      this.setupEventListeners();
      if (this.options.autoplay) this.startAutoPlay();

      window.addEventListener('resize', () => {
        this.updateWidths();
        this.setInitialPosition();
      });
    }

    updateWidths() {
      this.itemWidth = this.items[0].offsetWidth + this.options.gap;
    }

    setInitialPosition() {
      this.currentTranslate = -this.itemWidth * this.setSize;
      this.prevTranslate = this.currentTranslate;
      this.setPosition();
    }

    setPosition() {
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    setupEventListeners() {
      // Nav Buttons
      if (this.options.nextBtn) {
        const next = document.querySelector(this.options.nextBtn);
        if (next) next.addEventListener('click', () => { this.stopAutoPlay(); this.handleNext(); });
      }
      if (this.options.prevBtn) {
        const prev = document.querySelector(this.options.prevBtn);
        if (prev) prev.addEventListener('click', () => { this.stopAutoPlay(); this.handlePrev(); });
      }

      // Mouse/Touch Events
      this.track.addEventListener('mousedown', (e) => this.dragStart(e));
      this.track.addEventListener('mousemove', (e) => this.dragMove(e));
      window.addEventListener('mouseup', () => this.dragEnd());
      
      this.track.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
      this.track.addEventListener('touchmove', (e) => this.dragMove(e), { passive: true });
      this.track.addEventListener('touchend', () => this.dragEnd());

      // Hover
      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => { if(this.options.autoplay) this.startAutoPlay(); });
    }

    dragStart(e) {
      if (window.innerWidth > 768 && this.options.mobileOnly) return;
      this.stopAutoPlay();
      this.isDragging = true;
      this.startPos = this.getPositionX(e);
      this.track.style.transition = 'none';
      this.animationID = requestAnimationFrame(() => this.animation());
      this.track.classList.add('grabbing');
    }

    dragMove(e) {
      if (this.isDragging) {
        const currentPosition = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + (currentPosition - this.startPos);
      }
    }

    dragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      cancelAnimationFrame(this.animationID);
      this.track.classList.remove('grabbing');
      
      const movedBy = this.currentTranslate - this.prevTranslate;
      if (movedBy < -100) this.handleNext();
      else if (movedBy > 100) this.handlePrev();
      else {
        this.snapToCurrent();
      }
    }

    getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    animation() {
      this.setPosition();
      if (this.isDragging) requestAnimationFrame(() => this.animation());
    }

    handleNext() {
      this.currentTranslate -= this.itemWidth;
      this.animateAndCheckInfinite();
    }

    handlePrev() {
      this.currentTranslate += this.itemWidth;
      this.animateAndCheckInfinite();
    }

    snapToCurrent() {
      this.track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      this.currentTranslate = this.prevTranslate;
      this.setPosition();
    }

    animateAndCheckInfinite() {
      this.track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      this.setPosition();
      this.prevTranslate = this.currentTranslate;

      setTimeout(() => {
        const totalWidth = this.itemWidth * this.originalItems.length;
        if (this.currentTranslate <= -totalWidth * 2) {
          this.currentTranslate += totalWidth;
          this.track.style.transition = 'none';
          this.setPosition();
          this.prevTranslate = this.currentTranslate;
        } else if (this.currentTranslate >= 0) {
          this.currentTranslate -= totalWidth;
          this.track.style.transition = 'none';
          this.setPosition();
          this.prevTranslate = this.currentTranslate;
        }
      }, 600);
    }

    startAutoPlay() {
      if (this.autoPlayInterval) return;
      this.autoPlayInterval = setInterval(() => this.handleNext(), this.options.interval);
    }

    stopAutoPlay() {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // --- Initialize Global Carousels ---
  const initCarousels = () => {
    // 1. News (Keep Existing IDs)
    new UniversalCarousel('.news-carousel-track', { 
      autoplay: true, 
      nextBtn: '.news-home-section .next-btn', 
      prevBtn: '.news-home-section .prev-btn',
      gap: 40 
    });

    // 2. Layanan (Services) - Mobile Only
    new UniversalCarousel('.services-grid', { 
      autoplay: true, 
      mobileOnly: true,
      nextBtn: '.services-section .next-btn',
      prevBtn: '.services-section .prev-btn'
    });

    // 3. Equipment
    new UniversalCarousel('.equipment-track', { 
      autoplay: true, 
      nextBtn: '.equipment-section .next-btn', 
      prevBtn: '.equipment-section .prev-btn',
      gap: 30 
    });

    // 4. Mitra
    new UniversalCarousel('.mitra-track', { 
      autoplay: true, 
      gap: 60,
      interval: 3000
    });

    // 5. Projects (Handle Active Panels)
    const initProjectCarousels = () => {
      document.querySelectorAll('.project-grid').forEach(grid => {
        new UniversalCarousel(grid, { 
          mobileOnly: true,
          nextBtn: '.projects-section .next-btn',
          prevBtn: '.projects-section .prev-btn'
        });
      });
    };
    initProjectCarousels();
  };

  initCarousels();

  // =================================================================
  // 14. FIELD GALLERY CAROUSEL (Infinite, Looping, Responsive)
  // =================================================================
  const galleryCarousel = () => {
    const track = document.querySelector(".gallery-carousel-track");
    const nextBtn = document.querySelector(".gallery-carousel-nav .next-btn");
    const prevBtn = document.querySelector(".gallery-carousel-nav .prev-btn");
    if (!track || !nextBtn || !prevBtn) return;

    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    // Clone items for infinite effect (3 sets)
    originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
    originalItems.forEach(item => track.prepend(item.cloneNode(true)));

    const items = Array.from(track.children);
    const getItemWidth = () => items[0].offsetWidth + 30; // width + gap
    let itemWidth = getItemWidth();
    const setSize = originalItems.length;
    
    let currentTranslate = -itemWidth * setSize;
    let isDragging = false;
    let startPos = 0;
    let animationID = 0;
    let prevTranslate = currentTranslate;
    let autoPlayInterval;

    const setPosition = () => {
      track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const updateInfinite = () => {
      itemWidth = getItemWidth();
      const totalWidth = itemWidth * setSize;
      
      if (currentTranslate <= -totalWidth * 2) {
        currentTranslate += totalWidth;
        track.style.transition = 'none';
        setPosition();
        track.offsetHeight;
        track.style.transition = '';
      }
      if (currentTranslate >= 0) {
        currentTranslate -= totalWidth;
        track.style.transition = 'none';
        setPosition();
        track.offsetHeight;
        track.style.transition = '';
      }
      prevTranslate = currentTranslate;
    };

    const handleNext = () => {
      itemWidth = getItemWidth();
      currentTranslate -= itemWidth;
      track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      setPosition();
      setTimeout(updateInfinite, 600);
    };

    const handlePrev = () => {
      itemWidth = getItemWidth();
      currentTranslate += itemWidth;
      track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      setPosition();
      setTimeout(updateInfinite, 600);
    };

    nextBtn.addEventListener("click", () => {
      stopAutoPlay();
      handleNext();
    });

    prevBtn.addEventListener("click", () => {
      stopAutoPlay();
      handlePrev();
    });

    // Touch/Drag
    const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const animation = () => {
      setPosition();
      if (isDragging) animationID = requestAnimationFrame(animation);
    };

    const touchStart = (event) => {
      stopAutoPlay();
      isDragging = true;
      startPos = getPositionX(event);
      track.classList.add('grabbing');
      track.style.transition = 'none';
      animationID = requestAnimationFrame(animation);
    };

    const touchMove = (event) => {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + (currentPosition - startPos);
      }
    };

    const touchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
      track.classList.remove('grabbing');
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -100) handleNext();
      else if (movedBy > 100) handlePrev();
      else {
        track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        currentTranslate = prevTranslate;
        setPosition();
      }
    };

    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    // Initial positioning
    const init = () => {
      itemWidth = getItemWidth();
      currentTranslate = -itemWidth * setSize;
      setPosition();
      prevTranslate = currentTranslate;
    };

    window.addEventListener('load', init);
    window.addEventListener('resize', init);

    // Auto-play (Slower than news)
    const startAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(handleNext, 5000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  };

  galleryCarousel();

  // =================================================================
  // 15. PRO-GRADE GALLERY LIGHTBOX MODAL
  // =================================================================
  const galleryLightbox = () => {
    const track = document.querySelector(".gallery-carousel-track");
    if (!track) return;

    // 1. Inject Advanced Lightbox HTML
    if (!document.getElementById("galleryLightbox")) {
      const lightboxHTML = `
        <div id="galleryLightbox" class="gallery-lightbox">
          <div class="lightbox-header">
            <div class="lightbox-counter">PHOTO 1 / 1</div>
            <div class="lightbox-actions">
              <button class="lightbox-btn btn-zoom" title="Zoom In/Out"><i class="fas fa-search-plus"></i></button>
              <button class="lightbox-btn btn-download" title="Download Image"><i class="fas fa-download"></i></button>
              <button class="lightbox-btn btn-share" title="Copy Link"><i class="fas fa-share-alt"></i></button>
              <button class="lightbox-btn btn-fullscreen" title="Toggle Fullscreen"><i class="fas fa-expand"></i></button>
              <button class="lightbox-btn btn-close" title="Close"><i class="fas fa-times"></i></button>
            </div>
          </div>
          
          <button class="lightbox-nav prev"><i class="fas fa-chevron-left"></i></button>
          <button class="lightbox-nav next"><i class="fas fa-chevron-right"></i></button>
          
          <div class="lightbox-main">
            <div class="lightbox-img-wrapper">
              <div class="lightbox-loader"></div>
              <img id="lightboxImg" src="" alt="Gallery Preview">
              <div id="lightboxCaption" class="lightbox-caption"></div>
            </div>
          </div>

          <div class="lightbox-footer">
            <div class="lightbox-thumbnails"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", lightboxHTML);
    }

    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = lightbox.querySelector(".lightbox-counter");
    const thumbContainer = lightbox.querySelector(".lightbox-thumbnails");
    const loader = lightbox.querySelector(".lightbox-loader");
    
    // Action Buttons
    const zoomBtn = lightbox.querySelector(".btn-zoom");
    const downloadBtn = lightbox.querySelector(".btn-download");
    const shareBtn = lightbox.querySelector(".btn-share");
    const fsBtn = lightbox.querySelector(".btn-fullscreen");
    const closeBtn = lightbox.querySelector(".btn-close");
    const prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    const nextBtn = lightbox.querySelector(".lightbox-nav.next");

    let originalItems = [];
    let currentIndex = 0;

    const buildThumbnails = () => {
      thumbContainer.innerHTML = "";
      originalItems.forEach((item, index) => {
        const imgSrc = item.querySelector("img").src;
        const thumb = document.createElement("div");
        thumb.className = `thumb-item ${index === currentIndex ? "active" : ""}`;
        thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
        thumb.onclick = () => updateLightbox(index);
        thumbContainer.appendChild(thumb);
      });
    };

    const updateLightbox = (index) => {
      const item = originalItems[index];
      const img = item.querySelector("img");
      const info = item.querySelector(".gallery-info");

      // Show loader
      loader.classList.add("active");
      lightboxImg.style.opacity = "0.3";
      
      lightboxImg.src = img.src;
      lightboxImg.classList.remove("zoomed"); // Reset zoom on change
      
      lightboxImg.onload = () => {
        loader.classList.remove("active");
        lightboxImg.style.opacity = "1";
      };

      lightboxCaption.innerHTML = info ? info.innerHTML : "";
      currentIndex = index;
      
      // Update Counter
      lightboxCounter.textContent = `PHOTO ${index + 1} / ${originalItems.length}`;
      
      // Update Thumbnails
      const thumbs = thumbContainer.querySelectorAll(".thumb-item");
      thumbs.forEach((t, i) => t.classList.toggle("active", i === index));
      
      // Scroll active thumb into view
      const activeThumb = thumbs[index];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };

    const toggleZoom = () => {
      lightboxImg.classList.toggle("zoomed");
      const icon = zoomBtn.querySelector("i");
      if (lightboxImg.classList.contains("zoomed")) {
        icon.className = "fas fa-search-minus";
      } else {
        icon.className = "fas fa-search-plus";
      }
    };

    const downloadImage = () => {
      const a = document.createElement("a");
      a.href = lightboxImg.src;
      a.download = `TBN-Gallery-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const shareImage = () => {
      navigator.clipboard.writeText(lightboxImg.src).then(() => {
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => shareBtn.innerHTML = originalText, 2000);
      });
    };

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        lightbox.requestFullscreen();
        fsBtn.innerHTML = '<i class="fas fa-compress"></i>';
      } else {
        document.exitFullscreen();
        fsBtn.innerHTML = '<i class="fas fa-expand"></i>';
      }
    };

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
      if (document.fullscreenElement) document.exitFullscreen();
    };

    // Listeners
    track.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (!item) return;

      const allItems = Array.from(track.querySelectorAll(".gallery-item"));
      const originalCount = allItems.length / 3;
      originalItems = allItems.slice(originalCount, originalCount * 2);
      
      const clickedIndex = allItems.indexOf(item);
      const normalizedIndex = clickedIndex % originalCount;

      currentIndex = normalizedIndex;
      buildThumbnails();
      updateLightbox(currentIndex);
      
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", closeLightbox);
    zoomBtn.addEventListener("click", toggleZoom);
    downloadBtn.addEventListener("click", downloadImage);
    shareBtn.addEventListener("click", shareImage);
    fsBtn.addEventListener("click", toggleFullscreen);
    prevBtn.addEventListener("click", () => updateLightbox((currentIndex - 1 + originalItems.length) % originalItems.length));
    nextBtn.addEventListener("click", () => updateLightbox((currentIndex + 1) % originalItems.length));

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
      if (e.key === "z" || e.key === "Z") toggleZoom();
    });
  };

  galleryLightbox();
});
