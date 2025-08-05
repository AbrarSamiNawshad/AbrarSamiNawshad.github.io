// Initialize dark mode immediately to prevent flash
(function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) {
            document.body.classList.add('dark-mode');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('dark-mode');
            });
        }
    }
})();

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Special handling for blog link - redirect to blog page if not on main page
        if (href === '#blog') {
            const blogSection = document.querySelector('#blog');
            if (!blogSection || window.location.pathname.includes('blog.html')) {
                // If no blog section or already on blog page, redirect to blog.html
                window.location.href = 'blog.html';
                return;
            }
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll with enhanced effects
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (window.scrollY > 100) {
        if (isDarkMode) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
        }
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        if (isDarkMode) {
            navbar.style.background = 'rgba(20, 20, 20, 0.95)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
        navbar.style.backdropFilter = 'blur(15px)';
    }
});

// Active nav link highlighting based on scroll position
function updateActiveNavLink() {
    // Don't update active nav links on blog page
    if (window.location.pathname.includes('blog.html')) {
        return;
    }
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Use a smaller offset for better detection
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Animate elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .about-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
    this.reset();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize page when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove the problematic typing animation
    // The title will display normally with proper HTML rendering
});

// Skills animation counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (target === Infinity ? '' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target === Infinity ? '∞' : target + '+';
        }
    }
    
    updateCounter();
}

// Animate counters when about section comes into view
const aboutSection = document.querySelector('.about');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            const counters = document.querySelectorAll('.stat h3');
            counters.forEach((counter, index) => {
                const target = index === 0 ? 5 : index === 1 ? 2 : Infinity;
                setTimeout(() => {
                    animateCounter(counter, target);
                }, index * 200);
            });
            countersAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// Parallax effect removed to prevent scrolling interference
// The hero section will now stay in place for better readability

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading overlay if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Dark mode toggle (bonus feature)
function createDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    
    Object.assign(darkModeToggle.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: '#3498db',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        zIndex: '1000',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    });
    
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Update navbar immediately when switching themes
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            if (isDark) {
                navbar.style.background = 'rgba(15, 15, 15, 0.98)';
                navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
            }
        } else {
            if (isDark) {
                navbar.style.background = 'rgba(20, 20, 20, 0.95)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }
        }
        
        // Store preference
        localStorage.setItem('darkMode', isDark);
    });
    
    // Check for saved preference and ensure both html and body have dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.body.appendChild(darkModeToggle);
}

// Initialize dark mode toggle
document.addEventListener('DOMContentLoaded', createDarkModeToggle);

// Console welcome message
console.log(`
🤖 Welcome to Abrar Sami Nawshad's AI & ML Portfolio!
📧 Contact: contact@imnawshad.me
🌐 Website: https://imnawshad.me
🧠 Specializing in AI Automation & Machine Learning
`);

// Blog post toggle functionality
function toggleBlogPost(button) {
    const blogContent = button.parentElement;
    const blogBody = blogContent.querySelector('.blog-body');
    const isExpanded = blogBody.classList.contains('expanded');
    
    if (isExpanded) {
        blogBody.classList.remove('expanded');
        button.textContent = 'Read More';
        // Smooth scroll to the top of the blog post
        button.closest('.blog-post').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        blogBody.classList.add('expanded');
        button.textContent = 'Read Less';
    }
}
