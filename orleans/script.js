// Rückseite
const backCard = { image: "img/back.png", caption: "Game" }

// Kartennummern
const allNumbers = [1, 2, 3, 4, 5, 6];

// Schwierigkeitsgrade: Tier1, Tier2, Tier3
const difficultySettings = {
	1: { tier1: 6, tier2: 0, tier3: 0 },
	2: { tier1: 4, tier2: 2, tier3: 0 },
	3: { tier1: 2, tier2: 4, tier3: 0 },
	4: { tier1: 2, tier2: 2, tier3: 2 },
	5: { tier1: 0, tier2: 4, tier3: 2 },
	6: { tier1: 0, tier2: 2, tier3: 4 },
	7: { tier1: 0, tier2: 0, tier3: 6 }
};

// Kartenstapel (tier1, tier2 und tier3)
const tier1Deck = [
	{ tier: "1", num: "1", image: "img/1-1.png", caption: "%round%. Runde" },
	{ tier: "1", num: "2", image: "img/1-2.png", caption: "%round%. Runde" },
	{ tier: "1", num: "3", image: "img/1-3.png", caption: "%round%. Runde" },
	{ tier: "1", num: "4", image: "img/1-4.png", caption: "%round%. Runde" },
	{ tier: "1", num: "5", image: "img/1-5.png", caption: "%round%. Runde" },
	{ tier: "1", num: "6", image: "img/1-6.png", caption: "%round%. Runde" }
];

const tier2Deck = [
	{ tier: "2", num: "1", image: "img/2-1.png", caption: "%round%. Runde" },
	{ tier: "2", num: "2", image: "img/2-2.png", caption: "%round%. Runde" },
	{ tier: "2", num: "3", image: "img/2-3.png", caption: "%round%. Runde" },
	{ tier: "2", num: "4", image: "img/2-4.png", caption: "%round%. Runde" },
	{ tier: "2", num: "5", image: "img/2-5.png", caption: "%round%. Runde" },
	{ tier: "2", num: "6", image: "img/2-6.png", caption: "%round%. Runde" }
];

const tier3Deck = [
	{ tier: "3", num: "1", image: "img/3-1.png", caption: "%round%. Runde" },
	{ tier: "3", num: "2", image: "img/3-2.png", caption: "%round%. Runde" },
	{ tier: "3", num: "3", image: "img/3-3.png", caption: "%round%. Runde" },
	{ tier: "3", num: "4", image: "img/3-4.png", caption: "%round%. Runde" },
	{ tier: "3", num: "5", image: "img/3-5.png", caption: "%round%. Runde" },
	{ tier: "3", num: "6", image: "img/3-6.png", caption: "%round%. Runde" }
];

let fullDeck = [];
let currentCardIndex = 0;

// Neues Deck aufbauen
function buildFullDeck(difficulty = 1) {
	fullDeck = [];

	// Konfiguration laden
	const settings = difficultySettings[difficulty];
	if (!settings) throw new Error("Ungültiger Schwierigkeitsgrad");

	// Lokale Kopie der Nummern
	const numbers = [...allNumbers];

	// Auswahl nach Settings
	const tier1Numbers = pickRandom(numbers, settings.tier1);
	removeNumbers(numbers, tier1Numbers);

	const tier2Numbers = pickRandom(numbers, settings.tier2);
	removeNumbers(numbers, tier2Numbers);

	const tier3Numbers = [...numbers]; // Rest

	// Karten holen (Kopien)
	const chosenCards = [
		...getCardsByNumbers(tier1Deck, tier1Numbers),
		...getCardsByNumbers(tier2Deck, tier2Numbers),
		...getCardsByNumbers(tier3Deck, tier3Numbers)
	].map(card => ({ ...card }));

	// 3 Durchläufe
	for (let i = 0; i < 3; i++) {
		const shuffled = shuffleDeck([...chosenCards]);
		fullDeck.push(...shuffled.map(card => ({ ...card })));
	}

	// Runden setzen
	for (let i = 0; i < fullDeck.length; i++) {
		fullDeck[i].round = i + 1;
	}

	// Rückseite
	fullDeck.push({ ...backCard });
}

// Hilfsfunktionen
function pickRandom(arr, count) {
	const copy = [...arr];
	const result = [];
	for (let i = 0; i < count; i++) {
		const idx = Math.floor(Math.random() * copy.length);
		result.push(copy.splice(idx, 1)[0]);
	}
	return result;
}

function removeNumbers(source, removeArr) {
	for (const num of removeArr) {
		const idx = source.indexOf(num);
		if (idx > -1) source.splice(idx, 1);
	}
}

function getCardsByNumbers(deck, numbers) {
	return numbers.map(num => deck.find(card => card.num === num.toString()));
}

function shuffleDeck(deck) {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

// Anzeige der aktuellen Karte
function displayCurrentCard() {
	const currentCard = fullDeck[currentCardIndex];
	document.getElementById("cardImage").src = currentCard.image;
	document.getElementById("cardCaption").textContent = currentCard.caption.replace("%round%", currentCard.round);

	const restartButton = document.querySelector(".restart-container");
	const nextButton = document.getElementById("nextButton");
	const prevButton = document.getElementById("prevButton");
	const difficultyContainer = document.getElementById("difficultyContainer");

	if (currentCardIndex < fullDeck.length - 1) {
		restartButton.style.display = "none";
		difficultyContainer.style.display = "none";
		nextButton.style.display = "block";
	} else {
		nextButton.style.display = "none";
		restartButton.style.display = "block";
		difficultyContainer.style.display = "block";
	}
	if (currentCardIndex === 0) {
		prevButton.style.display = "none";
	} else {
		prevButton.style.display = "block";
	}
}


// Spielstand speichern/laden
function saveGameState() {
	localStorage.setItem("orleans_currentCardIndex", currentCardIndex);
	localStorage.setItem("orleans_fullDeck", JSON.stringify(fullDeck));
}

function loadGameState() {
	const savedIndex = localStorage.getItem("orleans_currentCardIndex");
	const savedDeck = localStorage.getItem("orleans_fullDeck");

	if (savedIndex !== null && savedDeck !== null) {
		currentCardIndex = parseInt(savedIndex, 10);
		fullDeck = JSON.parse(savedDeck);
		preloadImages(fullDeck);
		return true;
	}
	return false;
}

// Spiel zurücksetzen
function resetGame() {
	localStorage.removeItem("orleans_currentCardIndex");
	localStorage.removeItem("orleans_fullDeck");

	const difficulty = parseInt(localStorage.getItem("orleans_difficulty") || "1", 10);
	buildFullDeck(difficulty);
	preloadImages(fullDeck);
	currentCardIndex = 0;
	saveGameState();
	displayCurrentCard();
}

// Event-Listener
document.getElementById("nextButton").addEventListener("click", () => {
	if (currentCardIndex < fullDeck.length - 1) {
		currentCardIndex++;
		displayCurrentCard();
		saveGameState();
	}
});

document.getElementById("prevButton").addEventListener("click", () => {
	if (currentCardIndex > 0) {
		currentCardIndex--;
		displayCurrentCard();
		saveGameState();
	}
});

document.getElementById("resetButton").addEventListener("click", resetGame);

const difficultySlider = document.getElementById("difficulty");
const difficultyValue = document.getElementById("difficultyValue");

// Wert aus localStorage laden
const savedDifficulty = localStorage.getItem("orleans_difficulty");
if (savedDifficulty) {
	difficultySlider.value = savedDifficulty;
	difficultyValue.textContent = savedDifficulty;
}

// Slider-Event
difficultySlider.addEventListener("input", () => {
	difficultyValue.textContent = difficultySlider.value;
	localStorage.setItem("orleans_difficulty", difficultySlider.value);
});

// Spielstart
function startGame() {
	if (!loadGameState()) {
		const difficulty = parseInt(document.getElementById("difficulty").value, 10);
		buildFullDeck(difficulty);
		preloadImages(fullDeck);
		currentCardIndex = 0;
		saveGameState();
	}
	displayCurrentCard();
}

function preloadImages(deck) {
	deck.forEach(card => {
		const img = new Image();
		img.src = card.image;
	});
}

startGame();



