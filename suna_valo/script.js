const STORAGE_KEY = "bp.gameState";

const soloCards = [
	{ id: 1, image: "img/SO_01.png", shuffleIcon: false},
	{ id: 2, image: "img/SO_02.png", shuffleIcon: false},
	{ id: 3, image: "img/SO_03.png", shuffleIcon: false},
	{ id: 4, image: "img/SO_04.png", shuffleIcon: false},
	{ id: 5, image: "img/SO_05.png", shuffleIcon: true},
	{ id: 6, image: "img/SO_06.png", shuffleIcon: true},
	{ id: 7, image: "img/SO_07.png", shuffleIcon: false}
];

const helpCard = { id: "help", image: "img/help.png", shuffleIcon: false, caption: "Einkommensphase"};
const titleCard = { id: "title", image: "img/title.png", shuffleIcon: false, caption: "Suna Valo" };

let storagePile = [];
let drawPile = [];
let index = 0;

let era = 1;
let turn = 1;

let reshuffle  = false;

// let incomePhase = false;
// let gameEnded = false;

// Mischen
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// Nachziehstapel füllen
function fillDrawPile() {
	drawPile = shuffle(soloCards.map(c => ({ ...c })));
}

// nächste Karte ziehen, ggf. neumischen
function drawNextCard() {

	const card = drawPile.shift();
	card.era = era;
	card.turn = turn;
	card.caption = `Ära ${era} – Zug ${turn}`;
	storagePile.push(card);
	index = storagePile.length - 1;

	if (card.shuffleIcon) {
		if (reshuffle) {
			fillDrawPile();
		}
		reshuffle = !reshuffle;
	}

	turn++;
	saveState();
}

// Karte anzeigen
function show() {

	const card = storagePile[index];
	cardImage.src = card.image;
	cardCaption.textContent = card.caption;

	const showNextButton = 
		card.id === "title" ||
		(card.turn === 7 && index === storagePile.length - 1 );
		
	prevButton.style.display = index === 0 ? "none" : "block";
	nextButton.style.display = showNextButton ? "none" : "block";

	newEraButton.style.display = card.turn > 5 && card.era === era ? "inline-block" : "none";
	newEraButton.textContent = card.era === 3 ? "Spielende" : "Neue Ära";
	
	console.log("storagePile:",storagePile)
	console.log("drawPile:",drawPile)
	
}

// Click auf nextButton
nextButton.onclick = () => {
	if (index < storagePile.length - 1) {
		index++;
		show();
		return;
	}
	
	const card = storagePile[index]
	if (card.id === "help") {
		if (card.era === 3) {
			storagePile.push(titleCard);
			index = storagePile.length - 1;
			saveState();
			show();
			return;
		}

		era++;
		turn = 1;
	}

	drawNextCard();
	show();
};

prevButton.onclick = () => {
	if (index > 0) {
		index--;
		show();
	}
};

newEraButton.onclick = () => {
	//Sonderfall: Falls bereits ein 7. Zug existiert, wenn im 6. newEraButton geklickt wird: zurückrollen
	if ((storagePile.length - index) === 2) {
		const card = storagePile.pop()
		if (card.shuffleIcon) {
			reshuffle = !reshuffle;
		}
		drawPile.unshift(card);
		turn--;
	}
	const card = { ...helpCard }; 
	card.era = era;
	card.turn = turn;
	storagePile.push(card);
	index = storagePile.length - 1;
	saveState();
	show();
};

resetButton.onclick = resetGame;

function saveState() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({
		storagePile,
		drawPile,
		index,
		era,
		turn,
		reshuffle
	}));
}

function loadState() {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return false;

	const s = JSON.parse(raw);
	storagePile = s.storagePile;
	drawPile = s.drawPile;
	index = s.index;
	era = s.era;
	turn = s.turn;
	reshuffle = s.reshuffle;
	return true;
}

function resetGame() {
	localStorage.removeItem(STORAGE_KEY);
	startGame();
}


function startGame() {
	storagePile = [];
	drawPile = [];
	index = 0;
	era = 1;
	turn = 1;
	reshuffle = false;

	fillDrawPile();
	drawNextCard();
	show();
}

if (!loadState()) {
	startGame();
} else {
	show();
}
