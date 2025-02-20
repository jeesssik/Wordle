import { useDictionary, realDictionary } from './dictionary.js';

// Detectar si es un dispositivo móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Diccionario y estado del juego
const dictionary = realDictionary;
const state = {
  secret: useDictionary,
  grid: Array(6).fill().map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  box.addEventListener('click', () => {
    if (isMobile) {
      const input = document.getElementById('hidden-input');
      input.style.opacity = 1;
      input.style.zIndex = 1000;
      input.focus();
    }
  });

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  const input = document.getElementById('hidden-input');
  if (isMobile) {
    // Lógica para móviles
    input.oninput = (e) => {
      const key = e.data;
      handleInput(key);
      input.value = ''; // Limpiar el input después de cada tecla
    };

    input.addEventListener('focusout', () => {
      setTimeout(() => input.focus(), 100);
    });
  } else {
    // Lógica para web (teclado físico)
    document.addEventListener('keydown', (e) => {
      handleInput(e.key);
    });
  }
}

function handleInput(key) {
  if (key === 'Enter') {
    if (state.currentCol === 5) {
      const word = getCurrentWord();
      if (isWordValid(word)) {
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      } else {
        alert('Palabra no válida.');
      }
    }
  }
  if (key === 'Backspace') {
    removeLetter();
  }
  if (isLetter(key)) {
    addLetter(key);
  }
  updateGrid();
}

function getCurrentWord() {
  return state.grid[state.currentRow].join('');
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    setTimeout(() => {
      if (letter === state.secret[i]) {
        box.classList.add('right');
      } else if (state.secret.includes(letter)) {
        box.classList.add('wrong');
      } else {
        box.classList.add('empty');
      }
    }, ((i + 1) * animation_duration) / 2);
  }

  setTimeout(() => {
    if (state.secret === guess) {
      alert('¡Ganaste!');
    } else if (state.currentRow === 5) {
      alert(`Mejor suerte la próxima, la palabra era: ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol < 5) {
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
}

function removeLetter() {
  if (state.currentCol > 0) {
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
  }
}

function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  // Agregar campo de entrada oculto
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'hidden-input';
  input.autocomplete = 'off';
  input.autocorrect = 'off';
  input.spellcheck = false;
  input.maxLength = 1;
  input.style.position = 'absolute';
  input.style.opacity = 0;
  input.style.zIndex = -1;
  document.body.appendChild(input);

  registerKeyboardEvents();
}

startup();
