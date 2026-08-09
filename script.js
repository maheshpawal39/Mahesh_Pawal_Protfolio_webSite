document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close'),
          navLinks = document.querySelectorAll('.nav-link');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Hide mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* ==========================================================================
       STICKY NAVBAR
       ========================================================================== */
    const header = document.getElementById('header');

    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    window.addEventListener('scroll', scrollHeader);
    scrollHeader(); // Run once in case page loads scrolled

    /* ==========================================================================
       TYPING EFFECT FOR HERO SUBTITLE
       ========================================================================== */
    const typingElement = document.getElementById('typing-element');
    const words = ["Data Analyst", "BCA Graduate", "SQL Developer", "Power BI Designer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            // Remove character
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Add character
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Type slower
        }

        // State changes
        if (!isDeleting && charIndex === currentWord.length) {
            // Finished typing, wait before delete
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingElement) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       SCROLL SECTION ACTIVE LINK TRACKING
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for nav height
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    scrollActive();

    /* ==========================================================================
       SKILL PROGRESS BARS INTERSECTION OBSERVER
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');

    // Reset progress width to 0 first to animate from start
    progressBars.forEach(bar => {
        // Keep target width in dataset for transition trigger
        const targetWidth = bar.style.width;
        bar.setAttribute('data-target-width', targetWidth);
        bar.style.width = '0%';
    });

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Populate the widths to trigger transitions
                progressBars.forEach(bar => {
                    const target = bar.getAttribute('data-target-width');
                    bar.style.width = target;
                });
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of section is visible
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       CONTACT FORM SUBMISSION — REAL EMAIL DELIVERY VIA WEB3FORMS
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // 1) Go to https://web3forms.com , enter your email (maheshpawal39@gmail.com),
    //    it will send you a FREE Access Key by email in a few seconds.
    // 2) Paste that key below, replacing the placeholder text.
    const WEB3FORMS_ACCESS_KEY = "PASTE_YOUR_ACCESS_KEY_HERE";

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            // Basic validation check
            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            if (WEB3FORMS_ACCESS_KEY === "PASTE_YOUR_ACCESS_KEY_HERE") {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Form not configured yet: add your Web3Forms Access Key in script.js.';
                return;
            }

            // Show sending state
            formStatus.className = 'form-status';
            formStatus.style.color = '#3b82f6';
            formStatus.textContent = 'Sending message...';

            const submitBtn = contactForm.querySelector('.btn-submit');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        from_name: "Portfolio Contact Form"
                    })
                });

                const result = await response.json();

                if (result.success) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
                }
            } catch (error) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Network error. Please check your connection and try again.';
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 6000);
            }
        });
    }
});