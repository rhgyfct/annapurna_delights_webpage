document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-screen');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrollTop = document.getElementById('scrollTop');
  const promoBanner = document.getElementById('promoBanner');
  const closePromo = document.getElementById('closePromo');
  const tickerContent = document.getElementById('tickerContent');
  const tickerClone = document.getElementById('tickerClone');
  const tickerClock = document.getElementById('tickerClock');
  const tickerCountdown = document.getElementById('tickerCountdown');

  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 700);
    });
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  if (closePromo) {
    closePromo.addEventListener('click', () => promoBanner.classList.add('hidden'));
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const getIndiaTimeParts = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const parts = formatter.formatToParts(now);
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return {
      hour: Number(map.hour),
      minute: Number(map.minute),
      second: Number(map.second)
    };
  };

  const getTickerState = () => {
    const { hour, minute } = getIndiaTimeParts();
    const currentMinutes = hour * 60 + minute;

    if (currentMinutes >= 7 * 60 + 30 && currentMinutes <= 11 * 60 + 30) {
      return {
        mode: 'breakfast',
        title: 'NOW SERVING BREAKFAST',
        body: 'Breakfast • Poha • Upma • Bread & Butter • Tea • Coffee • Banana • Fresh & Hygienic • Visit Annapurna Delights Today • Freshly Prepared Every Morning • Limited Time Breakfast Menu',
        badge: 'Breakfast',
        countdownLabel: 'Breakfast Ends In',
        next: 11 * 60 + 31
      };
    }

    if (currentMinutes >= 12 * 60 && currentMinutes <= 15 * 60 + 30) {
      return {
        mode: 'lunch',
        title: 'NOW SERVING LUNCH',
        body: 'Lunch • Rice • Dal • Unlimited Roti • Seasonal Sabzi • Salad • Pickle • Papad • Fresh Home Style Food • Order Your Lunch Now • Healthy & Delicious',
        badge: 'Lunch',
        countdownLabel: 'Lunch Ends In',
        next: 15 * 60 + 31
      };
    }

    if (currentMinutes >= 19 * 60 && currentMinutes <= 22 * 60 + 30) {
      return {
        mode: 'dinner',
        title: 'NOW SERVING DINNER',
        body: 'Dinner • Fresh Roti • Rice • Dal • Paneer / Soyabean Curry • Seasonal Sabzi • Salad • Homemade Taste • Order Dinner Now • Freshly Cooked Every Evening',
        badge: 'Dinner',
        countdownLabel: 'Dinner Ends In',
        next: 22 * 60 + 31
      };
    }

    return {
      mode: 'closed',
      title: 'KITCHEN IS CURRENTLY CLOSED',
      body: 'Our Kitchen is Currently Closed. We are preparing fresh meals for the next serving. Thank you for choosing Annapurna Delights.',
      badge: 'Closed',
      countdownLabel: 'Next Meal Starts In',
      next: currentMinutes < 7 * 60 + 30 ? 7 * 60 + 30 : currentMinutes < 12 * 60 ? 12 * 60 : 19 * 60
    };
  };

  const formatCountdown = (targetMinutes, currentMinutes) => {
    const diff = Math.max(0, targetMinutes * 60 - currentMinutes * 60);
    const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const renderTicker = () => {
    const state = getTickerState();
    const { hour, minute, second } = getIndiaTimeParts();
    const timeText = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    if (tickerClock) tickerClock.textContent = timeText;

    const currentMinutes = hour * 60 + minute;
    const countdownText = state.mode === 'closed'
      ? `${state.countdownLabel}: ${formatCountdown(state.next, currentMinutes)}`
      : `${state.countdownLabel}: ${formatCountdown(state.next, currentMinutes)}`;
    if (tickerCountdown) tickerCountdown.textContent = countdownText;

    const content = `${state.title} • ${state.body}`;
    if (tickerContent) tickerContent.innerHTML = content;
    if (tickerClone) tickerClone.innerHTML = content;
  };

  renderTicker();
  setInterval(renderTicker, 1000);

  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const update = () => {
      if (current < target) {
        current += Math.ceil(target / 35);
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        update();
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(counter);
  });

  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (dot && outline) {
    window.addEventListener('mousemove', e => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      outline.style.left = `${e.clientX}px`;
      outline.style.top = `${e.clientY}px`;
    });
  }

  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section').forEach(section => {
    gsap.fromTo(section, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 80%' }
    });
  });

  gsap.from('.hero h1', { y: 36, opacity: 0, duration: 1.1, ease: 'power3.out' });
  gsap.from('.hero p, .hero .btn', { y: 20, opacity: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out', delay: 0.2 });
  gsap.from('.live-menu-ticker', { y: -12, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 });

  AOS.init({ duration: 800, once: true, offset: 80 });

  new Swiper('.testimonial-slider', {
    loop: true,
    autoplay: { delay: 4000 },
    slidesPerView: 1,
    spaceBetween: 24,
    breakpoints: { 768: { slidesPerView: 2 } }
  });

  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50 },
        color: { value: ['#FF6B35', '#2ECC71', '#F4C542'] },
        opacity: { value: 0.35 },
        size: { value: 2 },
        move: { enable: true, speed: 1.4, out_mode: 'out' }
      },
      interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
      retina_detect: true
    });
  }

  if (window.THREE) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      hero.appendChild(renderer.domElement);
      renderer.domElement.classList.add('three-canvas');

      const geometry = new THREE.TorusKnotGeometry(1.2, 0.32, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6b35, roughness: 0.3, metalness: 0.2 });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

      const light = new THREE.PointLight(0xffffff, 2.4, 100);
      light.position.set(10, 10, 10);
      scene.add(light);

      camera.position.z = 4;

      const animate = () => {
        requestAnimationFrame(animate);
        knot.rotation.x += 0.004;
        knot.rotation.y += 0.007;
        renderer.render(scene, camera);
      };
      animate();
    }
  }

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = 'Request Sent';
      setTimeout(() => {
        if (button) button.textContent = 'Send Message';
      }, 1800);
    });
  }
});
