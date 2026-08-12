// Emojis que formarão os pares
const emojis = ['🚀', '👾', '🤖', '🔥', '💻', '⭐', '⚡', '🎯'];
let cardsArray = [...emojis, ...emojis]; // Duplica para formar pares (16 cartas)

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matchedPairs = 0;

const gridElement = document.getElementById('grid');
const attemptsElement = document.getElementById('attempts');
const restartBtn = document.getElementById('restart-btn');

// Função para embaralhar um array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cria o tabuleiro no HTML
function createBoard() {
  gridElement.innerHTML = '';
  attempts = 0;
  matchedPairs = 0;
  attemptsElement.textContent = attempts;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  const shuffledCards = shuffle([...cardsArray]);

  shuffledCards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = ''; // Inicia virada para baixo

    card.addEventListener('click', flipCard);
    gridElement.appendChild(card);
  });
}

// Lógica ao clicar em uma carta
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return; // Evita clicar na mesma carta duas vezes

  this.classList.add('flipped');
  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++;
  attemptsElement.textContent = attempts;

  checkForMatch();
}

// Verifica se as duas cartas reveladas são iguais
function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// Mantém as cartas abertas se formarem um par
function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchedPairs++;
  resetTurn();

  // Verifica se o jogo acabou
  if (matchedPairs === emojis.length) {
    setTimeout(() => {
      alert(`Parabéns! Você venceu em ${attempts} tentativas!`);
    }, 300);
  }
}

// Desvira as cartas se forem diferentes
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.textContent = '';
    secondCard.textContent = '';

    resetTurn();
  }, 1000);
}

// Reseta o estado da rodada
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Evento do botão de reiniciar
restartBtn.addEventListener('click', createBoard);

// Inicia o jogo ao carregar a página
createBoard();