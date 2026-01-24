const STORAGE_KEY = "simpleDeckState";

// 7 Karten + Back-Card
const cards = [
	{ image: "img/SO_01.png", caption: "Karte 1" },
	{ image: "img/SO_02.png", caption: "Karte 2" },
	{ image: "img/SO_03.png", caption: "Karte 3" },
	{ image: "img/SO_04.png", caption: "Karte 4" },
	{ image: "img/SO_05.png", caption: "Karte 5" },
	{ image: "img/SO_06.png", caption: "Karte 6" },
	{ image: "img/SO_07.png", caption: "Karte 7" }
];

const backCard = { image: "img/help.png", caption: "Rückseite" };

let deck = [];
let index = 0;

// Fisher-Yates
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function preload(deck) {
	deck.forEach(c => {
		const img = new Image();
		img.src = c.image;
	});
}

function save() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ deck, index }));
}

function load() {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return false;

	const parsed = JSON.parse(data);
	deck = parsed.deck;
	index = parsed.index;
	preload(deck);
	return true;
}

function reset() {
	localStorage.removeItem(STORAGE_KEY);
	start();
}

function show() {
	const c = deck[index];
	cardImage.src = c.image;
	cardCaption.textContent = c.caption;

	prevButton.style.display = index === 0 ? "none" : "block";
	nextButton.style.display = index === deck.length - 1 ? "none" : "block";
}

function start() {
	deck = shuffle([...cards]);
	deck.push(backCard);
	preload(deck);
	index = 0;
	save();
	show();
}

// Navigation
nextButton.onclick = () => {
	if (index < deck.length - 1) {
		index++;
		save();
		show();
	}
};

prevButton.onclick = () => {
	if (index > 0) {
		index--;
		save();
		show();
	}
};

resetButton.onclick = reset;

// Init
if (!load()) start();
else show();
