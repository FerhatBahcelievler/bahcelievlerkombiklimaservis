document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar shadow ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 8) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.classList.toggle('is-active', isOpen);
    });
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero slider ---------- */
  var track = document.getElementById('heroTrack');
  var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.hero__slide')) : [];
  var dotsWrap = document.getElementById('heroDots');
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  var current = 0;
  var AUTOPLAY_MS = 6500;
  var timer = null;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Görsel ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.hero__dot'));

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() { timer = setInterval(next, AUTOPLAY_MS); }
    function stopAutoplay() { clearInterval(timer); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    var heroSection = document.getElementById('hero');
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) startAutoplay();
  }

  /* ---------- Hizmet bölgeleri haritası (Bahçelievler / Sefaköy / Bağcılar) ---------- */
  var mapEl = document.getElementById('serviceMap');
  if (mapEl && window.L) {
    var locations = [
      { name: 'Bahçelievler', note: 'Merkez ofis', lat: 41.0027, lng: 28.8586 },
      { name: 'Sefaköy', note: 'Hizmet bölgesi', lat: 40.9852, lng: 28.7965 },
      { name: 'Bağcılar', note: 'Hizmet bölgesi', lat: 41.0390, lng: 28.8560 }
    ];

    var map = L.map('serviceMap', { scrollWheelZoom: false });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var flameIcon = L.divIcon({
      className: 'service-map-pin',
      html: '<span></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    var bounds = [];
    locations.forEach(function (loc) {
      var marker = L.marker([loc.lat, loc.lng], { icon: flameIcon }).addTo(map);
      marker.bindPopup('<strong>' + loc.name + '</strong><br>' + loc.note);
      bounds.push([loc.lat, loc.lng]);
    });

    map.fitBounds(bounds, { padding: [40, 40] });

    map.on('focus', function () { map.scrollWheelZoom.enable(); });
    map.on('blur', function () { map.scrollWheelZoom.disable(); });
  }

  /* ---------- Scroll reveal for service rows ---------- */
  var revealTargets = document.querySelectorAll('.service-row, .contact__card, .contact__map');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

});
