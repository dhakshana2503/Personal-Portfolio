document.addEventListener("DOMContentLoaded", () => {
  // MOBILE MENU
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // TYPING ANIMATION
  const typingText = document.getElementById("typingText");
  const words = [
    "B.Sc Computer Science Student",
    "Aspiring Software Developer",
    "Web Development Learner"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    const word = words[wordIndex];

    if (!deleting) {
      charIndex++;
      typingText.textContent = word.substring(0, charIndex);

      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeEffect, 1300);
        return;
      }
    } else {
      charIndex--;
      typingText.textContent = word.substring(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(typeEffect, deleting ? 45 : 85);
  }

  typeEffect();

  // DARK / LIGHT MODE
  const themeToggle = document.getElementById("themeToggle");
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolioTheme");
  } catch (error) {}

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  function updateThemeButton() {
    const light = document.body.classList.contains("light-theme");
    themeToggle.textContent = light ? "🌙" : "☀️";
    themeToggle.setAttribute(
      "aria-label",
      light ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    try {
      localStorage.setItem(
        "portfolioTheme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
      );
    } catch (error) {}

    updateThemeButton();
  });

  // SCROLL REVEAL + PROGRESS BAR ANIMATION
  const revealElements = document.querySelectorAll(
    ".section-label, .section-title, .about-card, .skill-card, " +
    ".project-card, .contact-info, .contact-form"
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${(index % 4) * 90}ms`;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const element = entry.target;

        if (entry.isIntersecting) {
          element.classList.add("show");

          if (element.classList.contains("skill-card")) {
            const fill = element.querySelector(".skill-fill");

            if (fill) {
              fill.style.width = "0";

              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  fill.style.width = fill.dataset.level || "0%";
                });
              });
            }
          }
        } else {
          element.classList.remove("show");

          if (element.classList.contains("skill-card")) {
            const fill = element.querySelector(".skill-fill");
            if (fill) fill.style.width = "0";
          }
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("show"));

    document.querySelectorAll(".skill-fill").forEach(fill => {
      fill.style.width = fill.dataset.level || "0%";
    });
  }

  // PROJECT CAROUSEL
  const track = document.getElementById("projectTrack");
  const slides = Array.from(track.children);
  const dotsContainer = document.getElementById("carouselDots");
  const prev = document.getElementById("prevProject");
  const next = document.getElementById("nextProject");

  let current = 0;

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  prev.addEventListener("click", () => showSlide(current - 1));
  next.addEventListener("click", () => showSlide(current + 1));
  showSlide(0);

  // CONTACT FORM VALIDATION
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const charCount = document.getElementById("charCount");

  // Requires text before @, a domain after @, and .com at the end
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

  function checkEmail() {
    const email = emailInput.value.trim();
    const valid = emailPattern.test(email);

    if (!email) {
      emailError.textContent = "Email is required.";
    } else if (!valid) {
      emailError.textContent =
        "Enter a valid email like example@gmail.com ending in .com.";
    } else {
      emailError.textContent = "";
    }

    emailInput.classList.toggle("invalid", !valid);
    emailInput.classList.toggle("valid", valid);
    return valid;
  }

  function checkMessage() {
    const message = messageInput.value.trim();
    charCount.textContent = messageInput.value.length;

    let error = "";

    if (message.length < 20) {
      error = `Please enter at least 20 characters (${message.length}/20).`;
    } else if (message.length > 500) {
      error = "Message must be 500 characters or fewer.";
    }

    messageError.textContent = error;

    const valid = error === "";
    messageInput.classList.toggle("invalid", !valid);
    messageInput.classList.toggle("valid", valid);
    return valid;
  }

  emailInput.addEventListener("input", () => {
    checkEmail();
    formMessage.textContent = "";
  });

  messageInput.addEventListener("input", () => {
    checkMessage();
    formMessage.textContent = "";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const emailValid = checkEmail();
    const messageValid = checkMessage();

    if (!name) {
      formMessage.textContent = "Please enter your name.";
      nameInput.focus();
      return;
    }

    if (!emailValid) {
      formMessage.textContent = "Please correct your email address.";
      emailInput.focus();
      return;
    }

    if (!messageValid) {
      formMessage.textContent = "Please correct your message.";
      messageInput.focus();
      return;
    }

    // Replace with your own email address
    const yourEmail = "YOUR_EMAIL@example.com";

    if (yourEmail === "YOUR_EMAIL@example.com") {
      formMessage.textContent =
        "Please add your email address in script.js first.";
      return;
    }

    const subject = encodeURIComponent("Portfolio Contact Message");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
    );

    formMessage.textContent =
      "Opening your email app. Please send the message there.";

    window.location.href =
      `mailto:${yourEmail}?subject=${subject}&body=${body}`;
  });

  // FOOTER YEAR
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();
});