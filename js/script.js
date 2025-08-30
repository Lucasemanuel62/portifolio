// Menu toggle
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  const menuLinks = nav.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const carrosel = document.getElementById("carrosel");
const slides = document.querySelectorAll(".slide");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

let currentIndex = 0;
const totalSlides = slides.length;

function goToSlide(index, smooth = true) {
  const slideWidth = slides[0].clientWidth;

  // remove scroll-smooth do CSS temporariamente
  if (!smooth) {
    carrosel.style.scrollBehavior = "auto";
  } else {
    carrosel.style.scrollBehavior = "smooth";
  }

  carrosel.scrollTo({
    left: index * slideWidth
  });

  currentIndex = index;
}

btnPrev.addEventListener("click", () => {
  if (currentIndex === 0) {
    goToSlide(totalSlides - 1, false); // pulo direto
  } else {
    goToSlide(currentIndex - 1);
  }
});

btnNext.addEventListener("click", () => {
  if (currentIndex === totalSlides - 1) {
    goToSlide(0, false); // pulo direto
  } else {
    goToSlide(currentIndex + 1);
  }
});

let intervalId;

function startAutoSlide() {
  intervalId = setInterval(() => {
    let nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  }, 16000);
}

function stopAutoSlide() {
  clearInterval(intervalId);
}

carrosel.addEventListener('mouseover', stopAutoSlide);
carrosel.addEventListener('mouseout', startAutoSlide);

// Inicia o carrossel automático
startAutoSlide();

// Scroll suave para links internos com compensação do menu fixo
const linksInternos = document.querySelectorAll('a[href^="#"]');
linksInternos.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      const header = document.querySelector('header');
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset - 10; // 10px extra de margem
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});




