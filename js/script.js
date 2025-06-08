
// Menu toggle
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
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




