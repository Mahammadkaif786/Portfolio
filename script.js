/**
 * Mahammad Kaif - Premium Portfolio Script
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. LOADING SCREEN
       ========================================================================== */
    const loader = document.getElementById('loader');
    
    // Safety timeout to ensure loader clears even if resource loading stalls
    const safetyLoaderTimeout = setTimeout(clearLoader, 3000);

    window.addEventListener('load', () => {
        clearTimeout(safetyLoaderTimeout);
        clearLoader();
    });

    function clearLoader() {
        if (loader && !loader.classList.contains('loaded')) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.classList.add('loaded');
                // Trigger entry animations for hero section elements
                document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 600);
        }
    }


    /* ==========================================================================
       2. CUSTOM INTERACTIVE CURSOR
       ========================================================================== */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorOutline = document.getElementById('custom-cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Smoothness interpolation constant
    const lerpFactor = 0.15;
    let isMoving = false;

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            if (cursorDot) cursorDot.style.opacity = '1';
            if (cursorOutline) cursorOutline.style.opacity = '1';
        }
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Custom outline trailing animation
    function animateCursor() {
        outlineX += (mouseX - outlineX) * lerpFactor;
        outlineY += (mouseY - outlineY) * lerpFactor;
        
        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover state expansions
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .theme-toggle, .mobile-menu-btn, .project-card, .dot');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('custom-cursor-hovering');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('custom-cursor-hovering');
        });
    });

    // Handle mouse down/up states
    window.addEventListener('mousedown', () => {
        if (cursorOutline) cursorOutline.classList.add('custom-cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
        if (cursorOutline) cursorOutline.classList.remove('custom-cursor-clicking');
    });

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.style.opacity = '0';
        if (cursorOutline) cursorOutline.style.opacity = '0';
        isMoving = false;
    });


    /* ==========================================================================
       3. INTERACTIVE PARTICLE BACKGROUND
       ========================================================================== */
    let updateParticleColors = () => {};
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let connectionDistance = 120;
        let mouseRadius = 150;
        
        // Define colors based on theme context
        let particleColor = 'rgba(99, 102, 241, 0.25)'; // Indigo
        let lineAccentColor = 'rgba(6, 182, 212, 0.12)'; // Cyan
        
        updateParticleColors = function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                particleColor = 'rgba(99, 102, 241, 0.15)';
                lineAccentColor = 'rgba(6, 182, 212, 0.08)';
            } else {
                particleColor = 'rgba(99, 102, 241, 0.25)';
                lineAccentColor = 'rgba(6, 182, 212, 0.12)';
            }
        };
        updateParticleColors();

        // Canvas sizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1.5;
                this.baseRadius = this.radius;
            }

            update() {
                // Move particle
                this.x += this.vx;
                this.y += this.vy;

                // Screen bounce/wrap
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Interaction with mouse pointer
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    // Push particles away slowly
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                    this.radius = this.baseRadius * (1 + force * 0.5);
                } else {
                    if (this.radius > this.baseRadius) {
                        this.radius -= 0.05;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Base density calculation
            const count = Math.floor((canvas.width * canvas.height) / 13000);
            const cappedCount = Math.min(count, 120); // Cap on large monitors for performance
            for (let i = 0; i < cappedCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - (dist / connectionDistance)) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = lineAccentColor.replace('0.12', alpha).replace('0.08', alpha);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }


    /* ==========================================================================
       4. STICKY HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });


    /* ==========================================================================
       5. THEME SWITCHER (DARK & LIGHT MODES)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Load initial preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateToggleIcon(newTheme);
            
            // Refresh particle theme configurations
            if (typeof updateParticleColors === 'function') {
                updateParticleColors();
            }
        });
    }

    function updateToggleIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'light') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }


    /* ==========================================================================
       6. MOBILE DRAWER NAVIGATION MENU
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        navMenu.classList.add('open');
        mobileMenuBtn.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
    }

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });


    /* ==========================================================================
       7. HERO SECTION TYPING TEXT EFFECT
       ========================================================================== */
    const typingTextEl = document.getElementById('typing-text');
    const phrases = [
        'AI Agent Builder',
        'Python Developer',
        'Web Developer',
        'AI Enthusiast',
        'Future Entrepreneur'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTyping() {
        if (!typingTextEl) return;
        
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting speed
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Phrase completely typed out
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at completion
        } 
        // Phrase completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(handleTyping, typingSpeed);
    }
    
    if (typingTextEl) {
        setTimeout(handleTyping, 1000); // Initial delay
    }


    /* ==========================================================================
       8. SCROLL SPY - NAV ACTIVE HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + 150; // offset for nav header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (targetLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);


    /* ==========================================================================
       9. SCROLL PROGRESS & BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const progressPath = document.querySelector('.progress-circle path');
    
    if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;

        function updateProgressScroll() {
            const scrollDistance = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight <= 0) return;
            
            const progressPercent = (scrollDistance / docHeight) * 100;
            
            // Update sticky navbar top bar
            if (scrollProgressBar) {
                scrollProgressBar.style.width = `${progressPercent}%`;
            }

            // Update Back to Top SVG Circle Dashoffset
            const offset = pathLength - (scrollDistance * pathLength / docHeight);
            progressPath.style.strokeDashoffset = offset;

            // Display or hide Back to Top button
            if (scrollDistance > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }

        window.addEventListener('scroll', updateProgressScroll);
        updateProgressScroll(); // init on load
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* ==========================================================================
       10. REVEAL-ON-SCROLL ANIMATIONS & PARALLAX GLOW
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Add base transition wrapper class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        // Set delay styling if declared in markup data attribute
        const delay = el.getAttribute('data-delay');
        if (delay) {
            el.style.transitionDelay = `${delay}s`;
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.12, // Element is 12% visible before triggering
        rootMargin: '0px 0px -50px 0px' // Offset bottom
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Subtly animate floating nodes depending on speeds
    const floatingNodes = document.querySelectorAll('.floating-node');
    window.addEventListener('mousemove', (e) => {
        const mouseXPercent = e.clientX / window.innerWidth;
        const mouseYPercent = e.clientY / window.innerHeight;
        
        floatingNodes.forEach(node => {
            const speed = parseFloat(node.getAttribute('data-speed')) || 1.5;
            const x = (mouseXPercent - 0.5) * speed * 25;
            const y = (mouseYPercent - 0.5) * speed * 25;
            node.style.transform = `translate(${x}px, ${y}px)`;
        });
    });


    /* ==========================================================================
       11. DYNAMIC STATISTICS INTERACTIVE COUNTER
       ========================================================================== */
    const statsSection = document.querySelector('.about-stats-panel');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersInitiated = false;

    function startCounters() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepDuration = duration / steps;
            let current = 0;
            const increment = target / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toFixed(decimals);
                    clearInterval(timer);
                } else {
                    stat.textContent = current.toFixed(decimals);
                }
            }, stepDuration);
        });
    }

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersInitiated) {
                    countersInitiated = true;
                    startCounters();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }


    /* ==========================================================================
       12. TESTIMONIALS SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideTimer;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlideInterval() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 7000); // Rotate every 7 seconds
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideInterval(); // Reset timer after click
        });
    });

    if (slides.length > 1) {
        startSlideInterval();
    }


    /* ==========================================================================
       13. CONTACT FORM CLIENT-SIDE VALIDATION & FEEDBACK TOAST
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const btnSubmit = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');
    const toast = document.getElementById('toast-notification');
    const toastClose = document.getElementById('toast-close');

    // Inputs
    const inputName = document.getElementById('form-name');
    const inputEmail = document.getElementById('form-email');
    const inputSubject = document.getElementById('form-subject');
    const inputMessage = document.getElementById('form-message');

    // Error Labels
    const errorName = document.getElementById('error-name');
    const errorEmail = document.getElementById('error-email');
    const errorSubject = document.getElementById('error-subject');
    const errorMessage = document.getElementById('error-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Run validations
            const isNameValid = validateField(inputName, errorName, 'Name field cannot be left blank.');
            const isEmailValid = validateEmailField();
            const isSubjectValid = validateField(inputSubject, errorSubject, 'Subject field cannot be left blank.');
            const isMessageValid = validateField(inputMessage, errorMessage, 'Please add some description.');

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                submitFormMock();
            }
        });

        // Setup real-time blur clearers
        setupRealTimeValidation(inputName, errorName);
        setupRealTimeValidation(inputEmail, errorEmail, true);
        setupRealTimeValidation(inputSubject, errorSubject);
        setupRealTimeValidation(inputMessage, errorMessage);
    }

    function validateField(input, errorLabel, message) {
        if (!input) return false;
        if (input.value.trim() === '') {
            showInputError(input, errorLabel, message);
            return false;
        } else {
            clearInputError(input, errorLabel);
            return true;
        }
    }

    function validateEmailField() {
        if (!inputEmail) return false;
        const emailVal = inputEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailVal === '') {
            showInputError(inputEmail, errorEmail, 'Email field cannot be left blank.');
            return false;
        } else if (!emailRegex.test(emailVal)) {
            showInputError(inputEmail, errorEmail, 'Please enter a valid email address.');
            return false;
        } else {
            clearInputError(inputEmail, errorEmail);
            return true;
        }
    }

    function showInputError(input, errorLabel, message) {
        input.style.borderColor = '#EF4444';
        if (errorLabel) {
            errorLabel.textContent = message;
            errorLabel.style.display = 'block';
        }
    }

    function clearInputError(input, errorLabel) {
        input.style.borderColor = '';
        if (errorLabel) {
            errorLabel.style.display = 'none';
        }
    }

    function setupRealTimeValidation(input, errorLabel, isEmail = false) {
        if (!input) return;
        
        // Clear warning dynamically as user types
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                if (isEmail) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(input.value.trim())) {
                        clearInputError(input, errorLabel);
                    }
                } else {
                    clearInputError(input, errorLabel);
                }
            }
        });

        input.addEventListener('blur', () => {
            if (isEmail) {
                validateEmailField();
            } else {
                validateField(input, errorLabel, `${input.placeholder} is required.`);
            }
        });
    }

    // Mock Form submission to handle visual response
    function submitFormMock() {
        if (!btnSubmit || !submitText || !submitIcon) return;
        
        // Activate Loading State
        btnSubmit.classList.add('loading');
        btnSubmit.disabled = true;
        submitText.textContent = 'Sending...';
        submitIcon.className = 'fa-solid fa-spinner'; // loading spinner icon

        // Mock network delay (1.5 seconds)
        setTimeout(() => {
            // Restore button details
            btnSubmit.classList.remove('loading');
            btnSubmit.disabled = false;
            submitText.textContent = 'Send Message';
            submitIcon.className = 'fa-solid fa-paper-plane';

            // Reset inputs
            contactForm.reset();
            
            // Show Success Notification Toast
            showToast();
        }, 1500);
    }

    function showToast() {
        if (!toast) return;
        toast.classList.add('active');
        
        // Auto remove toast notification after 5 seconds
        const toastAutoRemove = setTimeout(hideToast, 5000);
        
        if (toastClose) {
            toastClose.onclick = () => {
                clearTimeout(toastAutoRemove);
                hideToast();
            };
        }
    }

    function hideToast() {
        if (toast) {
            toast.classList.remove('active');
        }
    }

});
