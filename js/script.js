// ===================================
// DARK MODE TOGGLE (saved in localStorage)
// ===================================
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function updateThemeIcon() {
    themeToggle.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
}
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
});

// ===================================
// HAMBURGER MENU (mobile)
// ===================================
const navMenu = document.getElementById('navMenu');

document.getElementById('hamburger').addEventListener('click', () => navMenu.classList.toggle('open'));
// Close the menu after a link is clicked
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

// ===================================
// DYNAMIC GREETING (based on the hour)
// ===================================
const hour = new Date().getHours();
let greeting = 'Good night 🌙';
if (hour >= 5 && hour < 11) greeting = 'Good morning 🌅';
else if (hour >= 11 && hour < 15) greeting = 'Good afternoon ☀️';
else if (hour >= 15 && hour < 18) greeting = 'Good evening 🌄';
document.getElementById('greeting').textContent = greeting;

// ===================================
// BACK TO TOP
// ===================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===================================
// TRANSITION: sections fade in while scrolling
// ===================================
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    observer.unobserve(entry.target);
}), { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===================================
// PROJECT FILTER
// ===================================
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => card.classList.toggle('hidden-card', filter !== 'all' && card.dataset.category !== filter));
    });
});

// ===================================
// PROJECT DETAIL MODAL
// ===================================
// Project data: update the links when your projects are online
const projects = [
    { title: 'Losari Beach Tourism', link: 'https://patriciusss.github.io/WisataPantaiLosari/', tags: ['HTML', 'CSS', 'Responsive'],
      desc: 'A responsive tourism website about Losari Beach in Makassar, built with HTML and external CSS.' },
    { title: 'Mobile Legends Rank Boosting Service', link: 'https://patriciusss.github.io/JokiML/', tags: ['Tailwind CSS', 'JavaScript'],
      desc: 'An interactive service website for Mobile Legends rank boosting, styled with Tailwind CSS.' },
    { title: 'Practicum Grades Dashboard', link: 'https://patriciusss.github.io/DashboardNilai/', tags: ['UI/UX', 'Dashboard'],
      desc: 'A dashboard interface for tracking practicum grades, designed for clarity and a smooth user experience.' }
];

const modal = document.getElementById('modal');

function toggleModal(open) {
    modal.classList.toggle('open', open);
}

document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const p = projects[btn.dataset.id];
        document.getElementById('modalTitle').textContent = p.title;
        document.getElementById('modalDesc').textContent = p.desc;
        document.getElementById('modalLink').href = p.link;

        document.getElementById('modalTags').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
        toggleModal(true);
    });
});

document.getElementById('modalClose').addEventListener('click', () => toggleModal(false));
modal.addEventListener('click', e => { if (e.target === modal) toggleModal(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleModal(false); });

// ===================================
// FORM VALIDATION + SAVE TO localStorage
// ===================================
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rules per field: return an error message, or '' when valid
const rules = {
    name:    v => v === '' ? 'Name is required' : v.length < 3 ? 'Name must be at least 3 characters' : '',
    email:   v => v === '' ? 'Email is required' : !emailRegex.test(v) ? 'Please enter a valid email address' : '',
    message: v => v === '' ? 'Message is required' : v.length < 10 ? 'Message must be at least 10 characters' : ''
};

function validateField(id) {
    const input = document.getElementById(id);
    const error = rules[id](input.value.trim());
    document.querySelector(`[data-error="${id}"]`).textContent = error;
    input.classList.toggle('invalid', error !== '');
    return error === '';
}

// Validate as soon as a field loses focus
Object.keys(rules).forEach(id => {
    document.getElementById(id).addEventListener('blur', () => validateField(id));
});

function showStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = 'form-status ' + type;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) return showStatus('Please fix the fields marked in red.', 'bad');

    // Save the message to localStorage
    const saved = JSON.parse(localStorage.getItem('contactMessages')) || [];
    saved.push({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        time: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(saved));

    form.reset();
    showStatus('Message saved. Thanks for reaching out!', 'ok');
});