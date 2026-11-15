// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('open', !open);
});

menu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  })
);

// Borde del header al hacer scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Aparición suave de elementos
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

// Estado del local: sábados de 11:30 a 15:30, hora de Ecuador.
// (Los feriados no se pueden saber automáticamente; se anuncian en Instagram.)
function updateStatus() {
  const box = document.getElementById('status');
  const text = document.getElementById('status-text');
  const note = document.getElementById('status-note');
  let now;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Guayaquil', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    now = { day: get('weekday'), mins: Number(get('hour')) * 60 + Number(get('minute')) };
  } catch (e) {
    return; // se queda el texto fijo
  }

  const OPEN = 11 * 60 + 30;
  const CLOSE = 15 * 60 + 30;
  const isSat = now.day === 'Sat';

  if (isSat && now.mins >= OPEN && now.mins < CLOSE) {
    box.classList.add('open');
    text.textContent = 'Abierto ahora';
    note.textContent = 'Cerramos a las 15:30';
  } else if (isSat && now.mins < OPEN) {
    text.textContent = 'Hoy abrimos';
    note.textContent = 'Sábados y feriados';
  } else {
    text.textContent = 'Próxima apertura';
    note.textContent = isSat ? 'El próximo sábado (y feriados)'
      : now.day === 'Fri' ? 'Mañana sábado' : 'Este sábado (y feriados)';
  }
}
updateStatus();
setInterval(updateStatus, 60000);

document.getElementById('year').textContent = new Date().getFullYear();
