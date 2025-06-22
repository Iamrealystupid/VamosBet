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

    getDisplay() {
        return `${this.value}${this.suit}`;
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
        let aces = 0;
        for (let card of this.cards) {
            total += card.getScoreValue();
            if (card.value === "A") aces++;
        }
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        return total;
    }
}

let deck, dealerHand, playerHand;
let showDealerSecondCard = false;

function startGame() {
    deck = new Deck();
    dealerHand = new Hand();
    playerHand = new Hand();
    showDealerSecondCard = false;

    dealerHand.addCard(deck.draw());
    dealerHand.addCard(deck.draw());
    playerHand.addCard(deck.draw());
    playerHand.addCard(deck.draw());

    document.getElementById("status").innerText = "BLACKJACK PAYS 3 TO 2";

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.querySelector("button[onclick='startGame()']").disabled = true; // 🚫 Disable Bet

    renderCards();
}
function renderCards() {
    const dealerEl = document.getElementById("dealer-cards");
    const playerEl = document.getElementById("player-cards");
    dealerEl.innerHTML = "";
    playerEl.innerHTML = "";

    dealerHand.cards.forEach((card, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.setProperty('--deal-delay', `${i * 0.2}s`);
        if (i === 1 && !showDealerSecondCard) {
            div.classList.add("back");
        } else {
            div.innerText = card.getDisplay();
        }
        dealerEl.appendChild(div);
    });

    playerHand.cards.forEach((card, i) => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.setProperty('--deal-delay', `${i * 0.2}s`);
        div.innerText = card.getDisplay();
        playerEl.appendChild(div);
    });

    document.getElementById("dealer-score").innerText =
        showDealerSecondCard ? dealerHand.getScore() : dealerHand.cards[0].getScoreValue();

    document.getElementById("player-score").innerText = playerHand.getScore();
}

function checkGameOver() {
    if (playerHand.getScore() > 21) {
        document.getElementById("status").innerText = "You busted!";
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
    } else if (playerScore === dealerScore) {
        status.innerText = "Push!";
    } else {
        status.innerText = "Dealer wins!";
    }

    disableActions();
}

function disableActions() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.querySelector("button[onclick='startGame()']").disabled = false; // ✅ Enable Bet again
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
    const input = document.getElementById("bet-amount");
    input.value = Math.floor(Number(input.value) / 2);
}

function doubleBet() {
    const input = document.getElementById("bet-amount");
    input.value = Number(input.value) * 2;
}
