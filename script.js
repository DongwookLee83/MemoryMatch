class MemoryGame {
    constructor() {
        this.cards = [];
        this.score = 0;
        this.attempts = 0;
        this.flippedCards = [];
        this.isLocked = false;
        this.gameStarted = false;

        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.matchSound = document.getElementById('matchSound');
        this.wrongSound = document.getElementById('wrongSound');

        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.startGame());
    }

    initCards() {
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        this.cards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji: emoji,
                isFlipped: false,
                isMatched: false
            }));
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = card.emoji;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', () => this.flipCard(cardElement));
        return cardElement;
    }

    startGame() {
        this.score = 0;
        this.attempts = 0;
        this.flippedCards = [];
        this.isLocked = false;
        this.gameStarted = true;
        this.gameBoard.innerHTML = '';
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;

        this.initCards();
        this.cards.forEach(card => {
            this.gameBoard.appendChild(this.createCardElement(card));
        });

        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'block';
    }

    flipCard(cardElement) {
        if (!this.gameStarted || this.isLocked) return;

        const cardId = parseInt(cardElement.dataset.id);
        const card = this.cards[cardId];

        if (card.isFlipped || card.isMatched) return;

        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, card: card });

        if (this.flippedCards.length === 2) {
            this.isLocked = true;
            this.attempts++;
            this.attemptsElement.textContent = this.attempts;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        const isMatch = first.card.emoji === second.card.emoji;

        if (isMatch) {
            this.handleMatch(first, second);
        } else {
            this.handleMismatch(first, second);
        }
    }

    handleMatch(first, second) {
        first.card.isMatched = true;
        second.card.isMatched = true;
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        this.score += 10;
        this.scoreElement.textContent = this.score;
        this.matchSound.play();

        this.flippedCards = [];
        this.isLocked = false;

        if (this.checkGameComplete()) {
            this.endGame();
        }
    }

    handleMismatch(first, second) {
        this.wrongSound.play();
        setTimeout(() => {
            first.card.isFlipped = false;
            second.card.isFlipped = false;
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }

    checkGameComplete() {
        return this.cards.every(card => card.isMatched);
    }

    endGame() {
        setTimeout(() => {
            alert(`게임 종료!\n점수: ${this.score}\n시도 횟수: ${this.attempts}`);
        }, 500);
    }
}

// Initialize game
const game = new MemoryGame(); 