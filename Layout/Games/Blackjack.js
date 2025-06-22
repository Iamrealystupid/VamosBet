// blackjack.js

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    getScoreValue() {
        if (["J", "Q", "K"].includes(this.value)) return 10;
        if (this.value === "A") return 11;
        return parseInt(this.value);
    }

    toString() {
        return `${this.value}${this.suit}`;
    }

    getDisplay() {
        const suitIcons = {
            "♠": "♠",
            "♥": "♥",
            "♦": "♦",
            "♣": "♣"
        };
        return `${this.value}${suitIcons[this.suit]}`;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        const suits = ["♠", "♥", "♦", "♣"];
        const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

        for (const suit of suits) {
            for (const value of values) {
                this.cards.push(new Card(suit, value));
            }
        }

        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}

class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    getScore() {
        let total = 0;
        let aceCount = 0;

        for (const card of this.cards) {
            total += card.getScoreValue();
            if (card.value === "A") aceCount++;
        }

        while (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }

        return total;
    }
}

let deck, dealerHand, playerHand;

function renderCards() {
    const dealerEl = document.getElementById("dealer-cards");
    const playerEl = document.getElementById("player-cards");

    dealerEl.innerHTML = "";
    playerEl.innerHTML = "";

    dealerHand.cards.forEach((card, i) => {
        const div = document.createElement("div");
        div.className = "card";
        if (i === 1 && !showDealerSecondCard) {
            div.classList.add("hidden");
        } else {
            div.innerText = card.getDisplay();
        }
        dealerEl.appendChild(div);
    });

    playerHand.cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = card.getDisplay();
        playerEl.appendChild(div);
    });

    document.getElementById("dealer-score").innerText = showDealerSecondCard ? dealerHand.getScore() : dealerHand.cards[0].getScoreValue();
    document.getElementById("player-score").innerText = playerHand.getScore();
}

function checkGameOver() {
    const playerScore = playerHand.getScore();
    if (playerScore > 21) {
        document.getElementById("status").innerText = "You busted! Dealer wins.";
        disableActions();
        showDealerSecondCard = true;
        renderCards();
        return true;
    }
    return false;
}

function dealerTurn() {
    showDealerSecondCard = true;
    while (dealerHand.getScore() < 17) {
        dealerHand.addCard(deck.draw());
    }
    renderCards();

    const playerScore = playerHand.getScore();
    const dealerScore = dealerHand.getScore();
    const status = document.getElementById("status");

    if (dealerScore > 21 || playerScore > dealerScore) {
        status.innerText = "You win!";
    } else if (dealerScore === playerScore) {
        status.innerText = "Push. It's a tie.";
    } else {
        status.innerText = "Dealer wins.";
    }

    disableActions();
}

function disableActions() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
}

let showDealerSecondCard = false;

function startGame() {
    deck = new Deck();
    dealerHand = new Hand();
    playerHand = new Hand();
    showDealerSecondCard = false;

    document.getElementById("status").innerText = "BLACKJACK PAYS 3 TO 2"

    dealerHand.addCard(deck.draw());
    dealerHand.addCard(deck.draw());
    playerHand.addCard(deck.draw());
    playerHand.addCard(deck.draw());

    renderCards();

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
}

document.getElementById("hit").addEventListener("click", () => {
    playerHand.addCard(deck.draw());
    renderCards();
    checkGameOver();
});

document.getElementById("stand").addEventListener("click", () => {
    dealerTurn();
});

function halveBet() {
    let input = document.getElementById("bet-amount");
    input.value = Math.floor(Number(input.value) / 2);
}

function doubleBet() {
    let input = document.getElementById("bet-amount");
    input.value = Number(input.value) * 2;
}