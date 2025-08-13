// Rückseite
const backCard = { image: "img/back.jpg", caption: "Bier Pioniere" }

// Aufbaukarten
const setupCards = [
	{ image: "img/setup_1.jpg", caption: "Aufbau" },
	{ image: "img/setup_4.jpg", caption: "Aufbau" },
	{ image: "img/setup_5.jpg", caption: "Aufbau" }
];

// Startkartensets 
const startCards = [
	{ image: "img/start_1.jpg", caption: "Aufbau" },
	{ image: "img/start_2.jpg", caption: "Aufbau" },
	{ image: "img/start_3.jpg", caption: "Aufbau" },
	{ image: "img/start_4.jpg", caption: "Aufbau" },
	{ image: "img/start_5.jpg", caption: "Aufbau" },
	{ image: "img/start_6.jpg", caption: "Aufbau" }
];

// Hauptspielkarten (blaue und rote Karten)
const blueDeck = [
	{ color: "blue", type: "A", image: "img/blue_A_1.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "A", image: "img/blue_A_2.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "A", image: "img/blue_A_3.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "A", image: "img/blue_A_4.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "B", image: "img/blue_B_1.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "B", image: "img/blue_B_2.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "B", image: "img/blue_B_3.jpg", caption: "%round%. Runde" },
	{ color: "blue", type: "B", image: "img/blue_B_4.jpg", caption: "%round%. Runde" }
];

const redDeck = [
	{ color: "red", type: "A", image: "img/red_A_1.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "A", image: "img/red_A_2.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "A", image: "img/red_A_3.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "A", image: "img/red_A_4.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "B", image: "img/red_B_1.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "B", image: "img/red_B_2.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "B", image: "img/red_B_3.jpg", caption: "%round%. Runde" },
	{ color: "red", type: "B", image: "img/red_B_4.jpg", caption: "%round%. Runde" }
];

let fullDeck = []; // Das gesamte Deck mit Aufbaukarte, Startkartenset und Spielkarten
let currentCardIndex = 0;

// Funktion zum Erstellen des vollständigen Decks
function buildFullDeck() {
	// Aufbaukarte hinzufügen
	const randomSetupCard = setupCards[Math.floor(Math.random() * setupCards.length)];
	fullDeck.push(randomSetupCard);

	// Startkarte hinzufügen
	const randomStartCard = startCards[Math.floor(Math.random() * startCards.length)];
	fullDeck.push(randomStartCard);

	// Hauptspielkarten generieren und hinzufügen
	const shuffledBlue = shuffleDeck([...blueDeck]);
	const shuffledRed = shuffleDeck([...redDeck]);

	const blueSelection = [
		...shuffledBlue.filter(card => card.type === "A").slice(0, 3),
		...shuffledBlue.filter(card => card.type === "B").slice(0, 3)
	];

	const redSelection = [
		...shuffledRed.filter(card => card.type === "A").slice(0, 3),
		...shuffledRed.filter(card => card.type === "B").slice(0, 3)
	];

	for (let i = 0; i < blueSelection.length; i++) {
		card = blueSelection[i];
		card.round = i + 1;
		fullDeck.push(card);
		card = redSelection[i];
		card.round = i + 1;
		fullDeck.push(card);
	}
	
	// letzte Karte
	fullDeck.push(backCard);
	
}

// Funktion zum Mischen des Decks
function shuffleDeck(deck) {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

// Funktion zum Anzeigen der aktuellen Karte
function displayCurrentCard() {
	const currentCard = fullDeck[currentCardIndex];
	document.getElementById("cardImage").src = currentCard.image;
	document.getElementById("cardCaption").textContent = currentCard.caption.replace("%round%", currentCard.round);

	const restartButton = document.querySelector(".restart-container");
	const nextButton = document.getElementById("nextButton");
	const prevButton = document.getElementById("prevButton");
	if (currentCardIndex < fullDeck.length - 1) {
		restartButton.style.display = "none";
		nextButton.style.display = "block";
	} else {
		nextButton.style.display = "none";
		restartButton.style.display = "block";
	}
	if (currentCardIndex === 0) {
		prevButton.style.display = "none";
	} else {
		prevButton.style.display = "block";
	}
}

// Funktion zum Speichern des aktuellen Standes in localStorage
function saveGameState() {
	localStorage.setItem("bp.currentCardIndex", currentCardIndex);
	localStorage.setItem("bp.fullDeck", JSON.stringify(fullDeck));
}

// Funktion zum Laden des Spielstandes aus localStorage
function loadGameState() {
	const savedIndex = localStorage.getItem("bp.currentCardIndex");
	const savedDeck = localStorage.getItem("bp.fullDeck");

	if (savedIndex !== null && savedDeck !== null) {
		currentCardIndex = parseInt(savedIndex, 10);
		fullDeck = JSON.parse(savedDeck);
		preloadImages(fullDeck);
		return true;
	}
	return false;
}

// Funktion zum Löschen des Spielstands und Neustart des Spiels
function resetGame() {
	// Löschen des gespeicherten Spielstands
	localStorage.removeItem("bp.currentCardIndex");
	localStorage.removeItem("bp.fullDeck");

	// Deck zurücksetzen und ein neues Spiel starten
	fullDeck = []; // Leert das Deck
	buildFullDeck(); // Baut ein neues Deck auf
	preloadImages(fullDeck);
	currentCardIndex = 0; // Setzt den aktuellen Kartenindex zurück
	saveGameState(); // Speichert den neuen Spielstand
	displayCurrentCard(); // Zeigt die erste Karte des neuen Spiels an
}

// Event-Listener für Vor- und Zurück-Buttons
document.getElementById("nextButton").addEventListener("click", () => {
	if (currentCardIndex < fullDeck.length - 1) {
		currentCardIndex++;
		displayCurrentCard();
		saveGameState(); // Spielstand speichern
	}
});

document.getElementById("prevButton").addEventListener("click", () => {
	if (currentCardIndex > 0) {
		currentCardIndex--;
		displayCurrentCard();
		saveGameState(); // Spielstand speichern
	}
});

// Event-Listener für den Reset-Button
document.getElementById("resetButton").addEventListener("click", resetGame);

// Spiel beim Laden der Seite starten
function startGame() {
	// Wenn ein gespeicherter Spielstand vorhanden ist, laden
	if (!loadGameState()) {
		// Andernfalls ein neues Spiel starten
		buildFullDeck();
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



