// DOM Elements
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");

// Mobile Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Add transition class for smooth theme change
  document.documentElement.style.transition = "all 0.3s ease";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Force navbar background update
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.style.background =
      newTheme === "dark" ? "var(--bg-primary)" : "var(--bg-primary)";
  }

  // Update theme toggle icon
  const icon = themeToggle.querySelector("i");
  if (icon) {
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  // Remove transition after animation completes
  setTimeout(() => {
    document.documentElement.style.transition = "";
    if (navbar) {
      navbar.style.background = "";
    }
  }, 300);
});

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.98)";
    }
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      navbar.style.background = "rgba(17, 24, 39, 0.95)";
    }
  }
});

// Modern scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-in-up");
    }
  });
}, observerOptions);

// Staggered animation observer
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-stagger");
    }
  });
}, observerOptions);

// Observe elements for animations
document.addEventListener("DOMContentLoaded", () => {
  // Single element animations
  const animatedElements = document.querySelectorAll(
    ".hero-content, .about-content, .contact-content"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Staggered animations for grids
  const staggerElements = document.querySelectorAll(
    ".skills-grid, .projects-grid, .timeline"
  );
  staggerElements.forEach((el) => {
    staggerObserver.observe(el);
  });

  // Add modern classes to elements
  const cards = document.querySelectorAll(
    ".skill-category, .project-card, .timeline-content"
  );
  cards.forEach((card) => {
    card.classList.add("hover-lift");
  });

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.classList.add("btn-modern", "focus-ring");
  });

  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.classList.add("focus-ring");
  });
});

// Contact form handling
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    // Method 1: Try Web3Forms first (most reliable)
    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: "a8883343-aa03-4f02-8b93-ed44e5dc1b79",
        name: name,
        email: email,
        subject: subject,
        message: message,
        from_name: name,
        reply_to: email,
      }),
    });

    const result = await web3formsResponse.json();

    if (result.success) {
      showNotification(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
      contactForm.reset();
      return;
    } else {
      throw new Error(result.message || "Web3Forms failed");
    }
  } catch (error) {
    console.log("Web3Forms failed, trying Formspree...");
  }

  try {
    // Method 2: Fallback to Formspree
    const formspreeResponse = await fetch("https://formspree.io/f/xpwgkqzv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
        _replyto: email,
        _subject: `Portfolio Contact: ${subject}`,
      }),
    });

    if (formspreeResponse.ok) {
      showNotification(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
      contactForm.reset();
      return;
    }
  } catch (error) {
    console.log("Formspree also failed, trying mailto...");
  }

  // Method 2: Fallback to mailto (always works)
  try {
    const mailtoLink = `mailto:afnanahmed7874@gmail.com?subject=${encodeURIComponent(
      `Portfolio Contact: ${subject}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoLink;
    showNotification(
      "Opening your email client. Please send the message manually.",
      "info"
    );
    contactForm.reset();
  } catch (error) {
    console.error("All methods failed:", error);
    showNotification(
      "Please email me directly at afnanahmed7874@gmail.com",
      "error"
    );
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success" ? "check-circle" : "info-circle"
            }"></i>
            <span>${message}</span>
        </div>
    `;

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-color);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
  // Split the text into parts: before span, span content, after span
  const spanStart = text.indexOf('<span class="highlight">');
  const spanEnd = text.indexOf("</span>");

  if (spanStart === -1 || spanEnd === -1) {
    // No span tags, use simple typing
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
    return;
  }

  const spanTag = '<span class="highlight">';
  const beforeSpan = text.substring(0, spanStart);
  const spanContent = text.substring(spanStart + spanTag.length, spanEnd);
  const afterSpan = text.substring(spanEnd + 7); // 7 = length of '</span>'

  let currentText = "";
  let i = 0;

  function type() {
    if (i < beforeSpan.length) {
      // Type the text before span
      currentText += beforeSpan.charAt(i);
      element.innerHTML = currentText;
      i++;
      setTimeout(type, speed);
    } else if (i === beforeSpan.length) {
      // Add opening span tag
      currentText += '<span class="highlight">';
      element.innerHTML = currentText;
      i++;
      setTimeout(type, speed);
    } else if (i < beforeSpan.length + 1 + spanContent.length) {
      // Type the span content
      const spanCharIndex = i - beforeSpan.length - 1;
      currentText += spanContent.charAt(spanCharIndex);
      element.innerHTML = currentText;
      i++;
      setTimeout(type, speed);
    } else if (i === beforeSpan.length + 1 + spanContent.length) {
      // Add closing span tag
      currentText += "</span>";
      element.innerHTML = currentText;
      i++;
      setTimeout(type, speed);
    } else if (
      i <
      beforeSpan.length + 2 + spanContent.length + afterSpan.length
    ) {
      // Type the text after span
      const afterCharIndex = i - beforeSpan.length - 2 - spanContent.length;
      currentText += afterSpan.charAt(afterCharIndex);
      element.innerHTML = currentText;
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing animation on page load
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    console.log("Original text:", originalText);
    console.log(
      "Span start:",
      originalText.indexOf('<span class="highlight">')
    );
    console.log("Span end:", originalText.indexOf("</span>"));
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50);
    }, 1000);
  }
});

// Parallax effect for hero section (disabled to prevent blinking)
// window.addEventListener("scroll", () => {
//   const scrolled = window.pageYOffset;
//   const hero = document.querySelector(".hero");
//   if (hero) {
//     const rate = scrolled * -0.5;
//     hero.style.transform = `translateY(${rate}px)`;
//   }
// });

// Skill tags hover effect
document.addEventListener("DOMContentLoaded", () => {
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      tag.style.transform = "translateY(-3px) scale(1.05)";
    });

    tag.addEventListener("mouseleave", () => {
      tag.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Project cards tilt effect
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
    });
  });
});

// Active navigation link highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Add active class styles
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .notification-success {
        border-left: 4px solid var(--accent-color);
    }
`;
document.head.appendChild(style);

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Add loading styles
const loadingStyle = document.createElement("style");
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);
