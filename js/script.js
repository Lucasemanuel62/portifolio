// Menu toggle
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  // Cria overlay (só uma vez)
  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9';
    overlay.style.display = 'none';
    overlay.style.transition = 'opacity 0.2s';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    nav.classList.add('active');
    toggle.classList.add('active');
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    toggle.setAttribute('aria-expanded', 'true');
    // bloquear scroll do corpo
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('active');
    toggle.classList.remove('active');
    overlay.style.opacity = '0';
    toggle.setAttribute('aria-expanded', 'false');
    // desbloquear scroll do corpo
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!nav.classList.contains('active')) overlay.style.display = 'none';
    }, 200);
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fechar menu ao clicar em um link
  const menuLinks = nav.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });

  // Fechar menu ao clicar no overlay
  overlay.addEventListener('click', closeMenu);
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
    // Se for o link de voltar ao topo, deixe o handler específico gerenciar a animação
    if (this.classList.contains('voltar-topo')) return;
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

// --- Ping-pong video loop suave (vai e volta infinito) ---
(function () {
  const video = document.querySelector('.videoagua');
  if (!video) return;

  // Zona de desaceleração/aceleração (segundos)
  const EASE_ZONE = 2.0;
  // Ponto onde inverte a direção (segundos a partir do fim/início)
  const TURN_POINT = 0.3;
  // playbackRate mínimo na desaceleração (antes de parar)
  const MIN_RATE = 0.07;

  let phase = 'forward'; // 'forward' | 'decelerating' | 'reverse' | 'accelerating'
  let rafId = null;
  let lastTimestamp = null;

  // --- Fase REVERSE: rebobina frame a frame com easing ---
  function reverseStep(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const duration = video.duration;
    const current = video.currentTime;

    // Progresso do reverse: 0 = começou a voltar, 1 = chegou no início
    const reverseTotal = duration - TURN_POINT - TURN_POINT;
    const reversed = (duration - TURN_POINT) - current;
    const progress = Math.min(1, reversed / reverseTotal);

    // Easing suave: desacelera nas pontas, rápido no meio (curva seno)
    const speed = 0.15 + 0.85 * Math.sin(progress * Math.PI);

    video.currentTime = Math.max(0, current - delta * speed);

    // Quando chega perto do início, transição suave pra forward
    if (video.currentTime <= TURN_POINT + EASE_ZONE) {
      phase = 'accelerating';
      lastTimestamp = null;
      cancelAnimationFrame(rafId);
      rafId = null;
      video.playbackRate = MIN_RATE;
      video.play();
      rafId = requestAnimationFrame(accelerateStep);
      return;
    }

    rafId = requestAnimationFrame(reverseStep);
  }

  // --- Fase ACCELERATING: aumenta playbackRate gradualmente ---
  function accelerateStep(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    lastTimestamp = timestamp;

    const current = video.currentTime;
    // Quanto já andou desde o ponto de virada
    const traveled = current - TURN_POINT;
    // Progresso de 0 a 1 na zona de aceleração
    const progress = Math.min(1, traveled / EASE_ZONE);
    // Easing ease-in: começa devagar, acelera
    const eased = progress * progress;
    const rate = MIN_RATE + (1.0 - MIN_RATE) * eased;

    video.playbackRate = Math.min(1.0, Math.max(MIN_RATE, rate));

    if (progress >= 1) {
      video.playbackRate = 1.0;
      phase = 'forward';
      lastTimestamp = null;
      cancelAnimationFrame(rafId);
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(accelerateStep);
  }

  // --- Monitora o forward play ---
  video.addEventListener('timeupdate', function () {
    if (!video.duration) return;
    const remaining = video.duration - video.currentTime;

    // Fase FORWARD: quando entra na zona de desaceleração
    if (phase === 'forward' && remaining <= EASE_ZONE) {
      phase = 'decelerating';
    }

    // Fase DECELERATING: reduz playbackRate gradualmente
    if (phase === 'decelerating') {
      const progress = Math.max(0, (remaining - TURN_POINT) / (EASE_ZONE - TURN_POINT));
      // Easing ease-out: desacelera suavemente
      const eased = progress * progress;
      const rate = MIN_RATE + (1.0 - MIN_RATE) * eased;
      video.playbackRate = Math.max(MIN_RATE, rate);

      // Quando chega no ponto de virada, começa o reverse
      if (remaining <= TURN_POINT) {
        video.pause();
        video.playbackRate = 1.0;
        phase = 'reverse';
        lastTimestamp = null;
        rafId = requestAnimationFrame(reverseStep);
      }
    }
  });
})();

// Handler explícito para o link "Voltar ao topo" — evita conflitos com overlays
(function() {
  const backToTop = document.querySelector('.voltar-topo');
  if (!backToTop) return;

  function smoothScrollTo(targetY, duration = 900) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let startTime = null;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const time = Math.min(1, (timestamp - startTime) / duration);
      const eased = easeInOutQuad(time);
      window.scrollTo(0, Math.round(startY + diff * eased));
      if (time < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollTo(0, 900);
  });
})();

// Capture global clicks early to detect when an overlay intercepts the click
// and the user actually clicked on the visual area of the back-to-top link.
document.addEventListener('click', function(e) {
  const backToTop = document.querySelector('.voltar-topo');
  if (!backToTop) return;
  const rect = backToTop.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  // If the click happened within the visible bounds of the link, trigger scroll
  if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    // prevent other handlers
    e.preventDefault();
    e.stopPropagation();

    // close nav overlay if present
    const overlay = document.getElementById('nav-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
    }

    // close nav if open
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('menu-toggle');
    if (nav) nav.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';

    // perform smooth scroll (same easing)
    if (typeof smoothScrollTo === 'function') {
      try { smoothScrollTo(0, 900); } catch (err) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}, true);
