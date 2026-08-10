document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close'),
          navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

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
    scrollHeader();

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
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
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
            const sectionTop = current.offsetTop - 120;
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

    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.setAttribute('data-target-width', targetWidth);
        bar.style.width = '0%';
    });

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const target = bar.getAttribute('data-target-width');
                    bar.style.width = target;
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       CONTACT FORM SUBMISSION — REAL EMAIL DELIVERY VIA WEB3FORMS
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    const WEB3FORMS_ACCESS_KEY = "9bd2cb14-bc8c-4344-940a-c8838e203ef3";

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields.';
                return;
            }

            if (WEB3FORMS_ACCESS_KEY === "") {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Form not configured yet: add your Web3Forms Access Key in script.js.';
                return;
            }

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
