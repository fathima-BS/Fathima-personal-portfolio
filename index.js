/* ==========================================================================
   Fathima B S - Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Dark / Light Theme System
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve theme preference from localStorage or check system setting
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to dark, but check system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  // Toggle Theme
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Refresh Canvas background color variables
    initCanvasColors();
  });


  // ==========================================================================
  // 2. Navigation & Mobile Menu Drawer
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Mobile Menu Drawer
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navbar.classList.toggle('menu-open');
    navMenu.classList.toggle('open');
  });

  // Close Mobile Menu on NavLink Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navbar.classList.remove('menu-open');
      navMenu.classList.remove('open');
    });
  });


  // ==========================================================================
  // 3. Dynamic Typing Effect (Hero Subtitle)
  // ==========================================================================
  const typingTextContainer = document.getElementById('typing-text');
  const words = [
    'Full-Stack Developer.',
    'MERN Stack Specialist.',
    'BTech CS Graduate.',
    'Passionate Self-Taught Coder.'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove characters
      typingTextContainer.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      // Add characters
      typingTextContainer.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Natural typing speed
    }

    // Word boundary logic
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Shift to next word
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Small delay before starting next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Kickstart typing
  if (typingTextContainer) {
    setTimeout(typeEffect, 1000);
  }


  // ==========================================================================
  // 4. Floating Particles Canvas Engine
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let particleColor = 'rgba(99, 102, 241, 0.2)'; // Primary theme color default
  let connectionColor = 'rgba(168, 85, 247, 0.05)';

  function initCanvasColors() {
    const theme = htmlElement.getAttribute('data-theme');
    if (theme === 'dark') {
      particleColor = 'rgba(99, 102, 241, 0.25)';
      connectionColor = 'rgba(168, 85, 247, 0.05)';
    } else {
      particleColor = 'rgba(79, 70, 229, 0.15)';
      connectionColor = 'rgba(147, 51, 234, 0.04)';
    }
  }
  initCanvasColors();

  // Resize canvas handler
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse cursor positions
  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, speed) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.speed = speed;
    }
    
    // Draw single node
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
    
    // Update node positions and boundaries
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }
      
      // Check collision with mouse cursor
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 2;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 2;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 2;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 2;
        }
      }
      
      // Move particle
      this.x += this.directionX * this.speed;
      this.y += this.directionY * this.speed;
      
      this.draw();
    }
  }

  // Populate Particle inventory
  function initParticles() {
    particlesArray = [];
    // Number of particles depends on screen resolution width
    const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 100);
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 3) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 2) - 1;
      let directionY = (Math.random() * 2) - 1;
      let speed = (Math.random() * 0.4) + 0.1;
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, speed));
    }
  }
  initParticles();

  // Create connections between close particles
  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < 110) {
          ctx.strokeStyle = connectionColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Main animation render loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }
  animate();

  // Re-initialize particles inventory on window resize
  window.addEventListener('resize', () => {
    initParticles();
  });


  // ==========================================================================
  // 5. Scroll Reveals, Active Nav Links, and Skill Fill Animations
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const sections = document.querySelectorAll('section');
  const skillFills = document.querySelectorAll('.progress-fill');

  // Trigger animations when elements enter viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Custom trigger for skill progress bars if skills section enters
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => revealObserver.observe(el));
  // Observe skills section wrapper to trigger animations
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    revealObserver.observe(skillsSection);
  }

  function animateSkillBars() {
    skillFills.forEach(fill => {
      const targetPercent = fill.style.width;
      // Reset width to 0 and trigger transition frame
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = targetPercent;
      }, 100);
    });
  }

  // Highlight current active section link in Navigation
  const navLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35, // Trigger when 35% of the section is visible
    rootMargin: '-80px 0px 0px 0px' // Align with navbar height scroll padding
  });

  sections.forEach(section => navLinkObserver.observe(section));


  // ==========================================================================
  // 6. Contact Form Management & Validations
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Basic validations
      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all details.', 'error');
        return;
      }

      // Mock submitting states
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      
      setTimeout(() => {
        // Success response
        showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1500);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status'; // Reset styling
    formStatus.classList.add(type);
    
    // Auto clear status after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }

});
