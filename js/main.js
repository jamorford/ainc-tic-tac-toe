const STATE_ACTIVE = 0
const STATE_FINISHED_WIN = 1
const STATE_FINISHED_TIE = 2

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

let data = {}
let elements = {
  board: {
    board: createElement({
      tag: 'div',
      classes: ['board', 'row']
    }),
    tiles: new Array(9).fill(null).map((value, index) => {
      return createElement({
        tag: 'div',
        classes: ['board-tile', 'col-4'],
        events: {
          click: e => tileClick(index, e.target)
        }
      });
    })
  },
  header: {
    title: createElement({
      tag: 'h1',
      textContent: 'Tic-Tac-Toe'
    }),
    description: createElement({
      tag: 'div',
      classes: ['header-description']
    })
  },
  restartButton: createElement({
    tag: 'div',
    classes: ['button-restart', 'btn', 'btn-primary'],
    textContent: 'Restart Game',
    events: {
      click: restartClick
    }
  })
}

function createElement({
  tag = null,
  classes = [],
  parent = null,
  events = {},
  textContent = ''
} = {}) {
  // Create element
  if (tag === null) return;
  let element = document.createElement(tag);

  // Add classes
  classes.forEach(className => element.classList.add(className));

  // Add event listeners
  Object.keys(events).forEach(event => element.addEventListener(event, events[event]));

  // Set textContent
  element.textContent = textContent

  // Append to parent element
  if (parent !== null) parent.appendChild(element);

  return element;
}

function renderUpdate() {
  let textDescription = '';

  switch(data.state) {
    case STATE_ACTIVE:
      textDescription = `${data.player}'s Turn`;
      break;
    case STATE_FINISHED_WIN:
      textDescription = `${data.player} Wins!`;
      break;
    case STATE_FINISHED_TIE:
      textDescription = 'Tie Game';
      break;
  }

  elements.header.description.textContent = textDescription;
}

function tileClick(index, target) {
  // Check whether game is active
  if (data.state !== STATE_ACTIVE) return;

  // Check whether this tile is occupied  
  if (data.board[index] !== null) return;

  // Update State & DOM
  data.board[index] = data.player;
  target.textContent = data.player;

  // Check for winner
  // For each win condition, check whether the board matches the current player at every position in the win condition
  if (winConditions.find(condition => condition.every(index => data.player === data.board[index])) !== undefined) {
    data.state = STATE_FINISHED_WIN;
  // Check if any moves remain by finding any open spaces
  } else if (data.board.find(position => position === null) !== undefined) {
    // Switch player
    data.player = data.player === 'X' ? 'O' : 'X';
  // Tie-game
  } else {
    data.state = STATE_FINISHED_TIE;
  }

  renderUpdate();
}

function restartClick() {
  data.player = 'X';
  data.board = new Array(9).fill(null);
  data.state = STATE_ACTIVE;
  elements.board.tiles.forEach(element => element.textContent = '')
  
  renderUpdate();
}


function renderInitial() {
  let appContainer = createElement({
    tag: 'div',
    classes: ['container'],
    parent: document.getElementById('app')
  })
  let appRow = createElement({
    tag: 'div',
    classes: ['row', 'justify-content-center'],
    parent: appContainer
  })
  let appCol = createElement({
    tag: 'div',
    classes: ['col'],
    parent: appRow
  })

  appCol.appendChild(elements.header.title);
  appCol.appendChild(elements.header.description);
  appCol.appendChild(elements.board.board);
  elements.board.tiles.forEach(element => elements.board.board.appendChild(element))
  appCol.appendChild(elements.restartButton);
}

renderInitial();
restartClick();