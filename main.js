document.addEventListener("DOMContentLoaded", function() {

    // Function to load HTML components
    const loadComponent = (selector, url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                } else {
                    console.error(`Selector ${selector} not found in the DOM.`);
                }
            });
    };

    // Use Promise.all to wait for all components to load
    Promise.all([
        loadComponent('#header-placeholder', 'components/header.html'),
        loadComponent('#hero-placeholder', 'components/hero.html'),
        loadComponent('#about-placeholder', 'components/about.html'),
        loadComponent('#products-placeholder', 'components/products.html'),
        loadComponent('#contact-placeholder', 'components/contact.html'),
        loadComponent('#footer-placeholder', 'components/footer.html')
    ]).then(() => {
        // All components are loaded, now initialize scripts
        initializePageScripts();
    }).catch(error => console.error("Error loading components:", error));

});

function initializePageScripts() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));
    }
    
    // Explore button functionality
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- NEW: Active Nav Link Logic ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        let currentSectionId = '';
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const scrollPosition = window.scrollY + navbarHeight + 50;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Set active link on page load


    // Smooth scrolling with offset for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetTop = targetElement.offsetTop - navbarHeight;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Animation on scroll observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('animate-on-scroll')) {
                    const animationType = entry.target.dataset.animType || 'slide-in-left';
                    entry.target.classList.add(animationType);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.anim-reveal, .animate-on-scroll, .title-underline').forEach(el => observer.observe(el));

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = e.target.name.value;
            alert(`Thank you, ${name}! Your message has been received.`);
            e.target.reset();
        });
    }

    // Inquire button functionality
    document.querySelectorAll('.inquire-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const messageTextarea = document.getElementById('message');
            const contactSection = document.getElementById('contact');

            if (messageTextarea) {
                messageTextarea.value = `I would like to inquire about your ${productName}.`;
            }
            
            if (contactSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetTop = contactSection.offsetTop - navbarHeight;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                setTimeout(() => {
                    if (messageTextarea) messageTextarea.focus();
                }, 500); // Delay focus until scroll is likely complete
            }
        });
    });

    // --- On Page Load Animations ---
    document.querySelectorAll('#hero .anim-reveal').forEach(el => el.classList.add('visible'));
    const navbar = document.getElementById('navbar');
    if (navbar) {
        setTimeout(() => {
            navbar.classList.remove('opacity-0', '-translate-y-full');
        }, 100);
    }

    // --- Dynamic Floating Buttons ---
    function createFloatingButton(id, iconClass, colorClasses, positionClasses, clickHandler) {
        if (document.getElementById(id)) return; // Avoid creating duplicate buttons
        const button = document.createElement('button');
        button.id = id;
        button.className = `fixed p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${colorClasses} ${positionClasses}`;
        button.innerHTML = `<i class="${iconClass}"></i>`;
        button.onclick = clickHandler;
        document.body.appendChild(button);
        return button;
    }

    // WhatsApp Button
    createFloatingButton('whatsappBtn', 'fab fa-whatsapp text-2xl', 'bg-green-500 hover:bg-green-600 text-white pulse-animation', 'bottom-6 right-6', () => window.open('https://wa.me/919876543210?text=Hi! I would like to know more about your bag parts.', '_blank'));

    // Scroll to Top Button
    const scrollTopBtn = createFloatingButton('scrollTopBtn', 'fas fa-arrow-up text-xl', 'bg-primary hover:bg-secondary text-black', 'bottom-6 left-6 opacity-(-1) invisible', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.remove('opacity-0', 'invisible');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'invisible');
            }
        }
    });
}
