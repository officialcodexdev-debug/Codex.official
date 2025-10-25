// Animations and Interactive Components for Portfolio Website

// ========================================
// Typed Text Animation
// ========================================
class TypedText {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            ...options
        };
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ========================================
// React-style Scroll Reveal Animation
// ========================================
class ScrollReveal {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
            animationType: 'fadeInUp',
            staggerDelay: 100,
            ...options
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll("[data-reveal]");
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.reveal || this.options.animationType;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    this.animateElement(element, animationType);
                }, delay);

                this.observer.unobserve(element);
            }
        });
    }

    animateElement(element, animationType) {
        // Remove any existing animation classes
        element.classList.remove('animate-fade-in-up', 'animate-slide-in-left', 'animate-slide-in-right',
            'animate-scale-in', 'animate-bounce-in', 'animate-zoom-in',
            'animate-flip-in-x', 'animate-rotate-in');

        // Add the appropriate animation class
        element.classList.add(`animate-${animationType}`);
        element.classList.add('revealed');
    }
}

// ========================================
// Parallax Effect
// ========================================
class ParallaxEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: 0.5,
            ...options
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        this.element.style.transform = `translate3d(${x * this.options.speed}px, ${y * this.options.speed}px, 0)`;
    }
}

// ========================================
// Skill Bar Animation
// ========================================
class SkillBarAnimation {
    constructor(options = {}) {
        this.options = {
            threshold: 0.5,
            ...options
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
        this.observeSkillBars();
    }

    observeSkillBars() {
        const skillBars = document.querySelectorAll(".skill__progress");
        skillBars.forEach(bar => {
            this.observer.observe(bar);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.getAttribute("data-percent");

                setTimeout(() => {
                    progressBar.style.width = `${percentage}%`;
                }, 200);

                this.observer.unobserve(progressBar);
            }
        });
    }
}

// ========================================
// Project Filter Animation
// ========================================
class ProjectFilter {
    constructor(container, projects) {
        this.container = container;
        this.projects = projects;
        this.currentFilter = "all";
        this.init();
    }

    init() {
        console.log("ProjectFilter initialized with", this.projects.length, "projects");
        this.renderProjects();
        this.bindEvents();
    }

    renderProjects() {
        const filteredProjects = this.currentFilter === "all" ?
            this.projects :
            this.projects.filter(project => project.category === this.currentFilter);

        console.log("Rendering", filteredProjects.length, "projects");
        this.container.innerHTML = "";

        // Add React-style stagger animation
        this.container.classList.add('fade-in-stagger');

        filteredProjects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project);
            projectElement.style.animationDelay = `${index * 0.1}s`;
            projectElement.classList.add('animate-fade-in-up');
            this.container.appendChild(projectElement);
        });
    }

    createProjectElement(project) {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project-card card-hover-lift image-hover-zoom";

        const tagsHtml = project.tags.map(tag => `<span class="project-card__tag">${tag}</span>`).join("");

        projectDiv.innerHTML = `
      <div class="project-card__image">
        <img src="${project.image}" alt="${project.title}" class="project-card__img" loading="lazy">
      </div>
      <div class="project-card__content">
        <h3 class="project-card__title text-hover-glow">${project.title}</h3>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">
          ${tagsHtml}
        </div>
        <div class="project-card__links">
          <a href="${project.liveUrl}" class="project-card__link btn-hover-lift" target="_blank" rel="noopener">Live Demo</a>
          <a href="${project.githubUrl}" class="project-card__link project-card__link--secondary btn-hover-lift" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    `;

        // Add click event for modal
        projectDiv.addEventListener("click", () => {
            this.openProjectModal(project);
        });

        return projectDiv;
    }

    bindEvents() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.setActiveFilter(button);
                this.currentFilter = button.getAttribute("data-filter");
                this.animateFilterChange();
            });
        });
    }

    setActiveFilter(activeButton) {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(button => {
            button.classList.remove("filter-btn--active");
        });
        activeButton.classList.add("filter-btn--active");
    }

    animateFilterChange() {
        const projectCards = this.container.querySelectorAll(".project-card");

        // Animate out
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("is-exiting");
            }, index * 50);
        });

        // Render new projects after animation
        setTimeout(() => {
            this.renderProjects();
        }, projectCards.length * 50 + 300);
    }

    openProjectModal(project) {
        const modal = document.getElementById("projectModal");
        const modalBody = document.getElementById("modalBody");

        if (modal && modalBody) {
            const tagsHtml = project.tags.map(tag => `<span class="project-modal__tag">${tag}</span>`).join("");

            modalBody.innerHTML = `
        <div class="project-modal">
          <div class="project-modal__image">
            <img style="border-Radius:30px " src="${project.image}" alt="${project.title}" class="project-modal__img">
          </div>
          <div class="project-modal__content">
            <h2 class="project-modal__title">${project.title}</h2>
            <p class="project-modal__description">${project.description}</p>
            <div class="project-modal__tags">
              ${tagsHtml}
            </div>
            <div class="project-modal__links">
              <a href="${project.liveUrl}" class="btn btn--primary" target="_blank" rel="noopener">Live Demo</a>
              <a href="${project.githubUrl}" class="btn btn--secondary" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </div>
      `;

            modal.classList.add("modal--active");

            // Add direct event listener to close button
            const closeButton = modal.querySelector(".modal__close");
            if (closeButton) {
                closeButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Close button clicked directly");
                    modal.classList.remove("modal--active");
                });
            }
        }
    }
}

// ========================================
// Modal Management
// ========================================
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Close modal on backdrop click
        document.addEventListener("click", (e) => {
            if (e.target.hasAttribute("data-modal-close")) {
                console.log("Close button clicked");
                this.closeAllModals();
            }
        });

        // Close modal on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                console.log("Escape key pressed");
                this.closeAllModals();
            }
        });

        // Direct close button event listeners
        document.addEventListener("click", (e) => {
            if (e.target.closest(".modal__close")) {
                console.log("Direct close button clicked");
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        const modals = document.querySelectorAll(".modal--active");
        console.log("Closing modals:", modals.length);
        modals.forEach(modal => {
            modal.classList.remove("modal--active");
            console.log("Modal closed:", modal.id);
        });
    }
}

// ========================================
// Scroll Progress Bar
// ========================================
class ScrollProgress {
    constructor() {
        this.init();
    }

    init() {
        this.createProgressBar();
        this.bindEvents();
    }

    createProgressBar() {
        const progressBar = document.createElement("div");
        progressBar.className = "scroll-progress";
        progressBar.id = "scrollProgress";
        document.body.appendChild(progressBar);
    }

    bindEvents() {
        window.addEventListener("scroll", this.updateProgress.bind(this));
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const progressBar = document.getElementById("scrollProgress");
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }
}

// ========================================
// Smooth Scrolling
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener("click", (e) => {
            if (e.target.hasAttribute("data-scroll-to")) {
                e.preventDefault();
                const targetId = e.target.getAttribute("data-scroll-to");
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Get the navigation height for offset
                    const nav = document.getElementById("nav");
                    const navHeight = nav ? nav.offsetHeight : 0;

                    // Smooth scroll to the target section with offset
                    const targetPosition = targetElement.offsetTop - navHeight - 20; // 20px extra padding

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    }
}

// ========================================
// Form Management
// ========================================
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.addEventListener("submit", this.handleSubmit.bind(this));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Simulate form submission
        setTimeout(() => {
            this.showToast("Message sent successfully!");
            form.reset();
        }, 1000);
    }

    showToast(message) {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

        console.log("Toast elements:", { toast, toastMessage }); // Debug log

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add("toast--active");
            console.log("Toast activated with message:", message); // Debug log

            setTimeout(() => {
                toast.classList.remove("toast--active");
                console.log("Toast deactivated"); // Debug log
            }, 3000);
        } else {
            console.error("Toast elements not found:", { toast, toastMessage });
        }
    }
}

// ========================================
// React-style Micro-interactions
// ========================================
class MicroInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.addRippleEffect();
        this.addMagneticEffect();
        this.addTiltEffect();
        this.addGlowEffect();
    }

    addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .filter-btn, .project-card__link');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.service-card, .project-card');
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    addTiltEffect() {
        const tiltElements = document.querySelectorAll('.hero__image, .service-card__icon');
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    addGlowEffect() {
        const glowElements = document.querySelectorAll('.nav__logo, .hero__title-accent');
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.textShadow = '0 0 20px var(--color-primary), 0 0 40px var()';
                element.style.transition = 'text-shadow 0.3s ease';
            });

            element.addEventListener('mouseleave', () => {
                element.style.textShadow = 'none';
            });
        });
    }
}

// ========================================
// React-style Loading Animation
// ========================================
class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingScreen();
        this.simulateLoading();
    }

    createLoadingScreen() {
        // Hide all main content
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');

        if (mainContent) mainContent.style.display = 'none';
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';

        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.innerHTML = `
      <div class="loading-content" style="font-family: 'Poppins', sans-serif;">
        <div class="loading-logo">
          <div class="loading-logo-text" style="  font-family: Permanent Marker, cursive; font-size:60px;">CODE<img src="assets/images/x-font.png" style="height: 100px; width: auto; vertical-align: middle; margin-left: -15px; " alt="X"></div>
        </div>
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">Loading amazing experiences...</div>
      </div>
    `;

        loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: opacity 0.5s ease;
      overflow: hidden;
    `;

        document.body.appendChild(loader);
    }

    simulateLoading() {
        setTimeout(() => {
            const loader = document.getElementById('loading-screen');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    // Show all main content again
                    const mainContent = document.querySelector('main');
                    const header = document.querySelector('header');
                    const footer = document.querySelector('footer');

                    if (mainContent) mainContent.style.display = '';
                    if (header) header.style.display = '';
                    if (footer) footer.style.display = '';

                    loader.remove();
                }, 500);
            }
        }, 3000);
    }
}

// ========================================
// Counter Animation
// ========================================
class CounterAnimation {
    constructor(options = {}) {
        this.options = {
            threshold: 0.5,
            duration: 2000,
            easing: 'easeOutCubic',
            ...options
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this), {
                threshold: this.options.threshold,
                rootMargin: '0px 0px -100px 0px' // Trigger 100px before element comes into view
            }
        );
        this.observeCounters();

        // Fallback: trigger animation after 3 seconds if not already triggered
        setTimeout(() => {
            this.triggerFallbackAnimation();
        }, 3000);

        // Additional fallback: trigger on scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    observeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        console.log("Found counters:", counters.length, counters);
        counters.forEach(counter => {
            console.log("Observing counter:", counter, "Target:", counter.getAttribute('data-count'));
            this.observer.observe(counter);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            console.log("Intersection detected:", entry.isIntersecting, entry.target);
            if (entry.isIntersecting) {
                const counter = entry.target;
                console.log("Starting animation for:", counter);
                counter.classList.add('animated');
                this.animateCounter(counter);
                this.observer.unobserve(counter);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = this.options.duration;
        const startTime = performance.now();

        console.log("Animating counter:", element, "Target:", target, "Suffix:", suffix);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easedProgress = this.easeOutCubic(progress);

            const currentValue = Math.floor(easedProgress * target);
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + suffix;
                console.log("Animation complete:", target + suffix);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    triggerFallbackAnimation() {
        const counters = document.querySelectorAll('[data-count]');
        console.log("Fallback animation triggered");

        counters.forEach(counter => {
            // Check if already animated
            if (!counter.classList.contains('animated')) {
                console.log("Running fallback animation for:", counter);
                counter.classList.add('animated');
                this.animateCounter(counter);
            }
        });
    }

    handleScroll() {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;

        const rect = aboutSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            console.log("About section is visible, triggering counters");
            this.triggerFallbackAnimation();
            // Remove scroll listener after triggering
            window.removeEventListener('scroll', this.handleScroll.bind(this));
        }
    }
}

// ========================================
// Export for use in other modules
// ========================================
window.Animations = {
    TypedText,
    ScrollReveal,
    ParallaxEffect,
    SkillBarAnimation,
    ProjectFilter,
    ModalManager,
    ScrollProgress,
    SmoothScroll,
    FormManager,
    MicroInteractions,
    LoadingAnimation,
    CounterAnimation
};