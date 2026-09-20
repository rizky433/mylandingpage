const slides = [
	{ title: 'Diablo IV', category: 'Action RPG', description: 'Return to darkness. Face ancient evil and carve your legend through the haunting world of Sanctuary.', background: 'image/diablo-4-bg.jpeg', character: 'image/diablo-character.png' },
	{ title: 'Final Fantasy XVI', category: 'Fantasy Adventure', description: 'Awaken the power of the Eikons and follow Clive Rosfield through a breathtaking tale of revenge and destiny.', background: 'image/final-fantasy-bg.jpeg', character: 'image/final-fantasy-character (1).png' },
	{ title: 'God of War', category: 'Action Adventure', description: 'Journey through a world of gods and monsters. Fate awaits Kratos and Atreus in the Norse wilds.', background: 'image/god-of-war-bg.jpeg', character: 'image/god-of-war-character.png' }
];

const heroBackground = document.querySelector('.hero-background');
const character = document.querySelector('#slide-character');
const title = document.querySelector('#slide-title');
const category = document.querySelector('#slide-category');
const description = document.querySelector('#slide-description');
const current = document.querySelector('#slide-current');
const progress = document.querySelector('#progress-bar');
const dots = [...document.querySelectorAll('.dot')];
const toast = document.querySelector('.toast');
let activeSlide = 0;
let autoPlay;

function renderSlide(index) {
	activeSlide = (index + slides.length) % slides.length;
	const slide = slides[activeSlide];
	heroBackground.style.backgroundImage = `url("${slide.background}")`;
	character.src = slide.character;
	title.textContent = slide.title;
	category.textContent = slide.category;
	description.textContent = slide.description;
	current.textContent = String(activeSlide + 1).padStart(2, '0');
	progress.style.width = `${((activeSlide + 1) / slides.length) * 100}%`;
	dots.forEach((dot, index) => {
		const isActive = index === activeSlide;
		dot.classList.toggle('is-active', isActive);
		dot.setAttribute('aria-selected', String(isActive));
	});
	character.style.animation = 'none';
	void character.offsetWidth;
	character.style.animation = 'character-in 1s ease both';
}

function restartAutoPlay() {
	clearInterval(autoPlay);
	autoPlay = setInterval(() => renderSlide(activeSlide + 1), 6500);
}

document.querySelectorAll('[data-direction]').forEach((button) => {
	button.addEventListener('click', () => {
		renderSlide(activeSlide + (button.dataset.direction === 'next' ? 1 : -1));
		restartAutoPlay();
	});
});
dots.forEach((dot) => dot.addEventListener('click', () => { renderSlide(Number(dot.dataset.slide)); restartAutoPlay(); }));

document.querySelector('#watch-button').addEventListener('click', () => {
	toast.textContent = `${slides[activeSlide].title} trailer coming soon`;
	toast.classList.add('is-visible');
	setTimeout(() => toast.classList.remove('is-visible'), 2600);
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
const navigationLinks = [...navigation.querySelectorAll('a')];
const observedSections = navigationLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
menuToggle.addEventListener('click', () => {
	const isOpen = navigation.classList.toggle('is-open');
	menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navigationLinks.forEach((link) => link.addEventListener('click', () => navigation.classList.remove('is-open')));

function updateHeaderState() {
	siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const sectionObserver = new IntersectionObserver((entries) => {
	const visibleSection = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
	if (!visibleSection) return;
	navigationLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visibleSection.target.id}`));
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .25, .5, .75, 1] });
observedSections.forEach((section) => sectionObserver.observe(section));

document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowRight') renderSlide(activeSlide + 1);
	if (event.key === 'ArrowLeft') renderSlide(activeSlide - 1);
	if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') restartAutoPlay();
});

document.querySelector('#game-grid').innerHTML = slides.map((slide) => `
	<a class="game-card" href="#discover">
		<span class="card-bg" style="background-image: url('${slide.background}')"></span>
		<img class="card-character" src="${slide.character}" alt="${slide.title} character">
		<span><small>${slide.category}</small><h3>${slide.title}</h3></span>
	</a>
`).join('');

renderSlide(0);
restartAutoPlay();
