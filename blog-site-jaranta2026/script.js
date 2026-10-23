document.documentElement.classList.add('js');

// Show the small navigation only after the landing hero is scrolled past.
const nav = document.querySelector('.site-nav');
const hero = document.querySelector('.hero');
new IntersectionObserver(([e]) => nav.classList.toggle('visible', !e.isIntersecting), { threshold: 0.6 }).observe(hero);

// Gentle reveal for weekly entries.
const entries = document.querySelectorAll('.entry');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((items) => {
    items.forEach((i) => { if (i.isIntersecting) { i.target.classList.add('in'); io.unobserve(i.target); } });
  }, { threshold: 0.15 });
  entries.forEach((el) => io.observe(el));
} else {
  entries.forEach((el) => el.classList.add('in'));
}

// Fallback if a photo file is missing: a clearly labelled placeholder, not a fake photo.
document.querySelectorAll('.entry img').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    const week = img.getAttribute('src').match(/week-(\d)/)?.[1] || '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="#232c3d"/>
      <rect x="40" y="40" width="720" height="520" rx="14" fill="none" stroke="#4c8dff" stroke-opacity=".5" stroke-dasharray="10 10"/>
      <text x="400" y="280" fill="#f5f7fb" font-family="Segoe UI,Arial,sans-serif" font-size="34" text-anchor="middle">Week ${week} photo placeholder</text>
      <text x="400" y="330" fill="#aab4c8" font-family="Segoe UI,Arial,sans-serif" font-size="22" text-anchor="middle">${img.dataset.theme}</text>
      <text x="400" y="380" fill="#aab4c8" font-family="Segoe UI,Arial,sans-serif" font-size="18" text-anchor="middle">Add your photo as images/week-${week}.jpg</text></svg>`;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
});

// Placeholders for the company logo and staff photo if the files are not added yet.
document.querySelectorAll('img[data-placeholder]').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    const w = img.dataset.w, h = img.dataset.h, small = Number(w) < 400;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="#232c3d"/>
      <text x="${w/2}" y="${h/2}" fill="#aab4c8" font-family="Segoe UI,Arial,sans-serif" font-size="${small ? 14 : 28}" text-anchor="middle">${img.dataset.placeholder}</text>
      <text x="${w/2}" y="${h/2 + (small ? 20 : 40)}" fill="#6f7b93" font-family="Segoe UI,Arial,sans-serif" font-size="${small ? 11 : 18}" text-anchor="middle">${img.dataset.file}</text></svg>`;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
});

// Documentation carousel: swipe, arrow buttons, and keyboard arrows.
(() => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.slide');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const current = document.getElementById('current-slide');
  document.getElementById('total-slides').textContent = slides.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = () => slides[0].getBoundingClientRect().width + 16;
  const index = () => Math.round(track.scrollLeft / step());
  const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
  const update = () => {
    const i = Math.min(Math.max(index(), 0), slides.length - 1);
    current.textContent = i + 1;
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  window.addEventListener('resize', update);
  update();
})();
