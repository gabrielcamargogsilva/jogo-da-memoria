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
// Elementos do modal
const modal = document.getElementById('win-modal');
const modalMessage = document.getElementById('modal-message');
const modalRecord = document.getElementById('modal-record');
const modalNewBtn = document.getElementById('modal-new');
const modalCloseBtn = document.getElementById('modal-close');
// Elemento do recorde no topo
const topRecordElement = document.getElementById('record');
// Botão de Resetar record
const restartRecord = document.getElementById('restart-record')

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
  // Esconder modal se estiver aberto
  if (modal) modal.classList.add('hidden');

  // Atualiza recorde exibido no topo
  updateTopRecord();

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
      showWinModal();
    }, 300);
  }
}

// Mostrar modal de vitória e gerenciar recorde
function showWinModal() {
  if (!modal) return;
  const bestKey = 'memory_best';
  const saved = localStorage.getItem(bestKey);
  const best = saved ? parseInt(saved, 10) : null;
  let newRecord = false;

  if (best === null || attempts < best) {
    localStorage.setItem(bestKey, attempts);
    newRecord = true;
  }

  modalMessage.textContent = `Você venceu em ${attempts} tentativas!`;
  modalRecord.textContent = newRecord ? `Novo recorde: ${attempts} tentativas 🎉` : `Recorde: ${best} tentativas`;
  modal.classList.remove('hidden');

  // Atualiza também o recorde exibido no topo da página
  updateTopRecord();
}

// Atualiza o elemento de recorde no topo com o valor do localStorage
function updateTopRecord() {
  if (!topRecordElement) return;
  const bestKey = 'memory_best';
  const saved = localStorage.getItem(bestKey);
  topRecordElement.textContent = saved ? `Recorde: ${saved}` : 'Recorde: -';
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
}

// Ações dos botões do modal
if (modalNewBtn) modalNewBtn.addEventListener('click', () => { closeModal(); createBoard(); });
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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

function clearRecord() {
  localStorage.removeItem('memory_best');
  updateTopRecord();
}


restartRecord.addEventListener('click', () => {
  clearRecord();
});

// Evento do botão de reiniciar
restartBtn.addEventListener('click', createBoard);

// Inicia o jogo ao carregar a página
createBoard();