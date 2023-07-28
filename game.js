const global = {
  settings: {
    sound: true,
    transitions: true,
    speed: "NORMAL",
  },
  timer: 0,
  colors: {
    red: "#9C27B0",
    darkRed: "#7B1FA2",
    blue: "#1E88E5",
    darkBlue: "#1976D2",
  },
  touchExpiration: null,
  timerInterval: null,
  dragSquare: null,
  dropSquare: null,
  frozenSvg: `<svg fill="#FFF" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve" stroke="#FFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M27,3c0.6,0,1,0.4,1,1v45.9c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V4c0-0.6,0.4-1,1-1H27z"></path> <path d="M26,17.2l-8.1-8.1c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0 l1.4,1.4c0.4,0.4,0.4,1,0,1.4L26,17.2"></path> <path d="M26,36.7l8.1,8.1c0.4,0.4,0.4,1,0,1.4l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0L26,42.3l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0 l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4L26,36.7"></path> <path d="M47.1,15.6c0.3,0.5,0.2,1.1-0.4,1.4L7.2,40.3c-0.5,0.3-1.1,0.2-1.4-0.4l-1-1.7c-0.3-0.5-0.2-1.1,0.4-1.4 l39.5-23.4c0.5-0.3,1.1-0.2,1.4,0.4L47.1,15.6z"></path> <path d="M34.4,22l2.8-11.1c0.1-0.6,0.6-0.9,1.2-0.7l1.9,0.5c0.6,0.1,0.9,0.6,0.7,1.2l-1.9,7.3l7.3,1.9 c0.6,0.1,0.9,0.6,0.7,1.2l-0.5,1.9c-0.1,0.6-0.6,0.9-1.2,0.7L34.4,22"></path> <path d="M17.6,31.9L14.8,43c-0.1,0.6-0.6,0.9-1.2,0.7l-1.9-0.5c-0.6-0.1-0.9-0.6-0.7-1.2l1.9-7.3l-7.3-1.9 c-0.6-0.1-0.9-0.6-0.7-1.2l0.5-1.9C5.5,29.1,6,28.8,6.6,29L17.6,31.9"></path> <path d="M5.9,13.9c0.3-0.5,0.9-0.7,1.4-0.4l39.5,23.4c0.5,0.3,0.7,0.9,0.4,1.4l-1,1.7c-0.3,0.5-0.9,0.7-1.4,0.4 L5.2,17c-0.5-0.3-0.7-0.9-0.4-1.4L5.9,13.9z"></path> <path d="M17.6,22L6.5,24.9c-0.6,0.1-1.1-0.1-1.2-0.7l-0.5-1.9c-0.1-0.6,0.1-1.1,0.7-1.2l7.3-1.9l-1.9-7.3 c-0.1-0.6,0.1-1.1,0.7-1.2l1.9-0.5c0.6-0.1,1.1,0.1,1.2,0.7L17.6,22"></path> <path d="M34.3,31.9L45.4,29c0.6-0.1,1.1,0.1,1.2,0.7l0.5,1.9c0.1,0.6-0.1,1.1-0.7,1.2l-7.3,1.9L41,42 c0.1,0.6-0.1,1.1-0.7,1.2l-1.9,0.5c-0.6,0.1-1.1-0.1-1.2-0.7L34.3,31.9"></path> </g></svg>`,
};
let state = {};

const bot = getBot();
const initialState = getInitialState();

function getCheckersStyle(numRows, numCols) {
  let switchCondition = true;
  let list = Array(numRows * numCols)
    .fill()
    .map((item, index) => {
      switchCondition =
        index % numRows === 0 ? !switchCondition : switchCondition;
      const player =
        index % 2 === 0 ? (switchCondition ? 1 : 2) : switchCondition ? 2 : 1;
      return player;
    });

  return list;
}

function getNextPlayer() {
  const currentPlayer = state.currentAction.player;
  return state.players[currentPlayer + 1] ? currentPlayer + 1 : 1;
}

function start(chosenLevel) {
  hideElement(elements.start.container);
  showElement(elements.game.container);

  state = setup(chosenLevel);

  setupEvents();
  shuffle();
  discoverAllNewSquares();
  updateBoard();
  startTurn();
  startTimer();
}

function startTimer() {
  global.timerInterval = setInterval(() => {
    global.timer += 1;
    if (global.timer <= 3600) {
      let seconds = global.timer;

      if (global.timer < 60) {
        return setElementText(elements.game.timer, `Timer: 00:${pad(seconds)}`);
      }
      const minutes =
        seconds % 60 === 0 ? seconds / 60 : Math.floor(seconds / 60);
      seconds = seconds % 60;

      return setElementText(
        elements.game.timer,
        `Timer ${pad(minutes)}:${pad(seconds)}`
      );
    } else {
      global.timer = 3600;
    }
  }, 1000);
}

function showResult() {
  const winner = state.board.squares[0].player;
  const color = getColorByPlayer(winner);
  elements.game.board.style.backgroundColor = color;
  elements.game.board.style.fontSize = "2rem";
  state.board.squares.forEach((square) => {
    square.el.style.backgroundColor = color;
  });
  clearInterval(global.timerInterval);
  hideElement(elements.util.glass);
  hideElement(elements.game.container);

  setElementText(elements.result.level, "Level: " + state.level.toUpperCase());
  setElementText(elements.result.winner, `Player ${winner} is the winner!`);
  setElementTextColor(elements.result.winner, getColorByPlayer(winner));
  elements.game.container.removeChild(elements.game.board);
  elements.result.board.appendChild(elements.game.board);

  const timer = elements.game.timer.innerText.replace("Timer: ", "");
  const turns = state.currentAction.turn + " turns";
  setElementText(elements.result.info, timer + " / " + turns);

  showElement(elements.result.container);
}

function pad(number) {
  return number < 10 ? "0" + number : number;
}

function plantFrostMine(square) {
  if (square.player === state.currentAction.player) {
    if (square.el.innerHTML === global.frozenSvg) {
      square.el.innerHTML = "";
      square.hasFrostMine = false;
      state.players[square.player].frostMines++;
    } else if (state.players[square.player].frostMines > 0) {
      if (!state.players[state.currentAction.player].bot) {
        square.el.innerHTML = global.frozenSvg;
      }
      square.hasFrostMine = true;
      state.players[square.player].frostMines--;
    }
    setElementText(
      elements.game.frostMines,
      `Frost Mines: ${state.players[square.player].frostMines}`
    );
  }
}

function setupEvents() {
  state.board.squares.forEach((square) => {
    const el = square.el;
    el.addEventListener("dblclick", () => {
      if (!state.currentAction.remainingMoves) {
        //plantFrostMine(square);
      }
    });
    el.addEventListener("mouseover", (e) => {
      e.preventDefault();
      onMouseOver(square);
    });
    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (state.currentAction.remainingMoves) {
        onMouseDown(square);
      } else {
        plantFrostMine(square);
      }
    });
    el.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (state.currentAction.remainingMoves) {
        onMouseUp(square);
      }
    });
    el.addEventListener("touchmove", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.currentAction.remainingMoves) {
        const changedTouch = e.changedTouches[0];
        const elem = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
        if (!elem || !elem.id) {
          return clearEvents();
        }
        onMouseOver(getSquareByElementId(elem.id));
      }
    });
    el.addEventListener("touchstart2", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.touches.length === 1) {
        if (global.touchExpiration === 0) {
          global.touchExpiration = e.timeStamp + 400;
        } else if (e.timeStamp <= global.touchExpiration) {
          if (!state.currentAction.remainingMoves) {
            plantFrostMine(square);
          }
          global.touchExpiration = 0;
        } else {
          global.touchExpiration = e.timeStamp + 400;
          if (state.currentAction.remainingMoves) {
            onMouseDown(square);
          }
        }
      }
    });
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (state.currentAction.remainingMoves) {
        onMouseDown(square);
      } else {
        plantFrostMine(square);
      }
    });
    el.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.currentAction.remainingMoves) {
        const changedTouch = e.changedTouches[0];

        const elem = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
        if (!elem || !elem.id) {
          return clearEvents();
        }
        onMouseUp(getSquareByElementId(elem.id));
        return clearEvents();
      }
    });
  });
}

function getColor(color) {
  return global.colors[color];
}
function getColorByPlayer(player, colorType = "color") {
  const playerColorName = state.players[player][colorType];
  return global.colors[playerColorName];
}

function getSquareByElementId(id) {
  const splittedString = id.split("-");
  const row = splittedString[1];
  const col = splittedString[2];
  if (!state.board[row]) {
    return clearEvents();
  }
  return state.board[row][col];
}

function getSquaresByRange(board, initialX, initialY, finalX, finalY) {
  const list = [];
  for (let x = initialX; x <= finalX; x++) {
    for (let y = initialY; y <= finalY; y++) {
      list.push(board[x][y]);
    }
  }
  return list;
}

function shuffle() {
  const { board } = state;

  let player = 1;
  Array(board.numRows * board.numCols * board.numCols)
    .fill()
    .forEach(() => {
      const [destinationSquare, originSquare] = bot.getShuffleMove(
        board.squares,
        player
      );

      const tempPlayer = destinationSquare.player;
      destinationSquare.player = originSquare.player;

      const doesItResultInASuperSquare = checkSuperSquareCreationPossibly(
        destinationSquare,
        originSquare
      );
      if (doesItResultInASuperSquare) {
        destinationSquare.player = tempPlayer;
        return;
      }
      player = player === 1 ? 2 : 1;
      setSquareColor(destinationSquare);
    });
}

function setPropForAllSquares(prop, value) {
  for (let x = 1; x <= state.board.numRows; x++) {
    for (let y = 1; y <= state.board.numCols; y++) {
      state.board[x][y][prop] = value;
    }
  }
}
function checkIfPlayerIsOnSquare(player, x, y, board = state.board) {
  if (!board[x] || !board[x][y]) {
    return false;
  }
  if (board[x][y].player !== player) {
    return false;
  }
  return true;
}

function getNumberOfMoves(board, player) {
  const superSquareList = getSuperSquareList(board);
  const moves = superSquareList.reduce((count, superSquare) => {
    if (superSquare.player === player) {
      return count + superSquare.size;
    }
    return count;
  }, 0);
  return moves;
}

function finishTurn() {
  startTurn();
}

async function showTurnTransition() {
  elements.app.container.style.overflowY = "hidden";
  hideElement(elements.game.container);
  const player = state.currentAction.player;

  showElement(elements.turnTransition.container);

  elements.turnTransition.container.style.backgroundColor =
    getColorByPlayer(player);
  setElementTextColor(
    elements.turnTransition.container,
    getColorByPlayer(player, "focusColor")
  );
  setElementText(
    elements.turnTransition.turn,
    `Round ${state.currentAction.turn}`
  );
  setElementText(elements.turnTransition.player, `Player ${player}`);
  setElementText(
    elements.turnTransition.moves,
    `Total Moves: ${state.currentAction.remainingMoves}`
  );

  await sleep(2500);
  showElement(elements.game.container);
  hideElement(elements.turnTransition.container);
  elements.app.container.style.overflowY = "auto";
}

function getNumberOfSuperSquaresByPlayer(player) {
  const superSquareList = getSuperSquareList(state.board);
  const superSquares = superSquareList.filter(
    (superSquare) => superSquare.player === player
  );
  return superSquares.length;
}

async function startTurn() {
  const extraFrostMines = getNumberOfSuperSquaresByPlayer(
    state.currentAction.player
  );
  const player = getNextPlayer();
  const turn = state.currentAction.turn + 1;
  const defaultMoves = state.currentAction.turn === 1 ? 2 : 1;
  const moves = defaultMoves + getNumberOfMoves(state.board, player);

  state.currentAction = {
    remainingMoves: moves,
    player,
    turnMoves: 0,
    turn,
  };

  /*
  make it in a way that the maximumbombs deployed is 3
  let totalFrostMines = state.players[player].frostMines + extraFrostMines;
  if (totalFrostMines > 3) {
    totalFrostMines = 3
  }
  const frostMines = totalFrostMines;
  */

  const { transitions } = getSettings();
  if (transitions) {
    await showTurnTransition();
  }

  setElementText(
    elements.game.moves,
    `Remaining moves: ${state.currentAction.remainingMoves}`
  );
  setElementTextColor(elements.game.moves, getColorByPlayer(player));
  if (state.players[player].bot) {
    setElementText(elements.game.frostMines, `Frost Mines: **`);
  } else {
    setElementText(
      elements.game.frostMines,
      `Frost Mines: ${state.players[player].frostMines}`
    );
  }

  setElementTextColor(elements.game.frostMines, getColorByPlayer(player));

  hideElement(elements.game.finishTurn);
  showElement(elements.game.moves);

  removeDetonatedBombs();
  updateBoard();
  if (state.players[player].bot) {
    playAsBot(player);
  } else {
    hideElement(elements.util.glass);
  }
}

function removeDetonatedBombs() {
  state.board.squares.forEach((square) => {
    if (square.frozen) {
      square.frozen = false;
      square.el.innerHTML = "";
    }
  });
}

function getAdjacentPossibleMoves(x, y) {
  const { board } = state;
  const possibleMoves = [];

  const square = board[x][y];
  const player = square.player;

  const top = (board[x - 1] && board[x - 1][y]) || null;
  const right = (board[x] && board[x][y + 1]) || null;
  const bottom = (board[x + 1] && board[x + 1][y]) || null;
  const left = (board[x] && board[x][y - 1]) || null;

  if (top && top.player !== player && !top.frozen) {
    possibleMoves.push([top, square]);
  }

  if (right && right.player !== player && !right.frozen) {
    possibleMoves.push([right, square]);
  }

  if (bottom && bottom.player !== player && !bottom.frozen) {
    possibleMoves.push([bottom, square]);
  }

  if (left && left.player !== player && !left.frozen) {
    possibleMoves.push([left, square]);
  }

  return possibleMoves;
}
async function playAsBot(player) {
  if (!state.currentAction.remainingMoves) {
    startTurn();
    return;
  }

  showElement(elements.util.glass);

  const nextMove = bot.getNextMove(
    state.board,
    player,
    state.players[player].botLevel
  );
  if (!nextMove) {
    showResult();
    return;
  }
  let [destinationSquare, originSquare] = nextMove;
  destinationSquare = state.board[destinationSquare.x][destinationSquare.y];
  originSquare = state.board[originSquare.x][originSquare.y];

  const { speed } = getSettings();

  let relativeTime;
  if (speed === "NORMAL") {
    relativeTime = state.players[player].botLevel === "easy" ? 3 : 2;
  } else {
    relativeTime = speed === "FAST" ? 1 : 3;
  }

  await sleep(relativeTime * 500);
  onMouseOver(originSquare);
  await sleep(relativeTime * 300);
  onMouseDown(originSquare);
  await sleep(relativeTime * 200);
  onMouseOut(originSquare);
  onMouseOver(destinationSquare);
  await sleep(relativeTime * 300);
  onMouseUp(destinationSquare);
}

function discoverAllNewSquares(board = state.board) {
  for (let x = 1; x <= board.numRows; x++) {
    for (let y = 1; y <= board.numCols; y++) {
      if (board[x][y].superSquare) {
        continue;
      }
      discoverNewSquares(board, x, y);
    }
  }
}

function discoverNewSquares(board, x, y, size = 1, superSquare) {
  const player = board[x][y].player;
  if (!checkIfPlayerIsOnSquare(player, x + size, y + size, board)) {
    return size;
  }

  if (board[x + size][y + size].superSquare) {
    return size;
  }

  for (let depth = 0; depth < size; depth++) {
    if (!checkIfPlayerIsOnSquare(player, x + size, y + depth, board)) {
      return size;
    }
    if (board[x + size][y + depth].superSquare) {
      return size;
    }
    if (!checkIfPlayerIsOnSquare(player, x + depth, y + size, board)) {
      return size;
    }
    if (board[x + depth][y + size].superSquare) {
      return size;
    }
  }
  if (!superSquare) {
    superSquare = {
      player,
      size: size + 1,
      x,
      y,
    };
  }

  board[x][y].superSquare = superSquare;
  board[x + size][y + size].superSquare = superSquare;
  for (let depth = 0; depth < size; depth++) {
    board[x + size][y + depth].superSquare = superSquare;
    board[x + depth][y + size].superSquare = superSquare;
  }

  return discoverNewSquares(board, x, y, size + 1, superSquare);
}

function getSuperSquareList(board) {
  const superSquareMap = board.squares.reduce((map, square) => {
    if (square.superSquare) {
      const name = square.superSquare.x + "-" + square.superSquare.y;
      if (!map[name]) {
        map[name] = square.superSquare;
      }
    }
    return map;
  }, {});

  return Object.values(superSquareMap);
}

function addBorder(el, orientation, player) {
  el.style[`border${orientation}`] = `2px solid white`;
}

function removeBorders(el) {
  if (!el.style) {
    return;
  }
  el.style.borderTop = "0px solid white";
  el.style.borderRight = "0px solid white";
  el.style.borderBottom = "0px solid white";
  el.style.borderLeft = "0px solid white";
}

function updateBoard() {
  const { board, players } = state;
  const superSquareList = getSuperSquareList(board);

  const boardEl = document.querySelector("#board");
  board.squares.forEach((currentSquare) => {
    removeBorders(currentSquare.el);
    const color = global.colors[players[currentSquare.player].color];
    currentSquare.el.style.backgroundColor = color;
    currentSquare.el.parentNode.style.backgroundColor = color;
    currentSquare.el.style.color = color;

    if (
      !currentSquare.superSquare ||
      currentSquare.x === currentSquare.superSquare.x
    ) {
      addBorder(currentSquare.el, "Top", currentSquare.player);
    }
    if (
      !currentSquare.superSquare ||
      currentSquare.y === currentSquare.superSquare.y
    ) {
      addBorder(currentSquare.el, "Left", currentSquare.player);
    }
    if (
      !currentSquare.superSquare ||
      currentSquare.superSquare.x + currentSquare.superSquare.size - 1 ===
        currentSquare.x
    ) {
      addBorder(currentSquare.el, "Bottom", currentSquare.player);
    }

    if (
      !currentSquare.superSquare ||
      currentSquare.superSquare.y + currentSquare.superSquare.size - 1 ===
        currentSquare.y
    ) {
      addBorder(currentSquare.el, "Right", currentSquare.player);
    }
    if (
      !state.players[currentSquare.player].bot &&
      currentSquare.hasFrostMine
    ) {
      currentSquare.el.innerHTML = global.frozenSvg;
    }
  });
  if (board.superSquareLabelElements) {
    board.superSquareLabelElements.forEach((label) => {
      boardEl.removeChild(label);
    });
  }
  board.superSquareLabelElements = [];

  superSquareList.forEach((superSquare) => {
    let currentSquare;
    const squareValue = superSquare.size;
    const squareSize = board.squares[0].el.offsetWidth;
    const superSquareLabelSize = squareSize * superSquare.size;
    const superSquareLabelEl = document.createElement("div");
    const superSquareLabelSpanEl = document.createElement("span");
    superSquareLabelSpanEl.innerHTML = "+" + squareValue;
    superSquareLabelEl.classList.add("superSquareLabel");
    superSquareLabelEl.appendChild(superSquareLabelSpanEl);
    superSquareLabelEl.style.height = superSquareLabelSize + "px";
    superSquareLabelEl.style.width = superSquareLabelSize + "px";
    const superSquareLabelElTop = (superSquare.x - 1) * squareSize;
    const superSquareLabelElLeft = (superSquare.y - 1) * squareSize;
    superSquareLabelEl.style.top = superSquareLabelElTop + "px";
    superSquareLabelEl.style.left = superSquareLabelElLeft + "px";
    superSquareLabelEl.style.color = getColorByPlayer(superSquare.player);

    board.superSquareLabelElements.push(superSquareLabelEl);

    boardEl.appendChild(superSquareLabelEl);

    superSquareLabelEl.style.top =
      superSquareLabelElTop + superSquareLabelSpanEl.offsetTop + "px";
    superSquareLabelEl.style.left =
      superSquareLabelElLeft + superSquareLabelSpanEl.offsetLeft + "px";
    superSquareLabelEl.style.height = superSquareLabelSpanEl.style.height;
    superSquareLabelEl.style.width = superSquareLabelSpanEl.style.width;

    for (let x = superSquare.x; x < superSquare.x + superSquare.size; x++) {
      for (let y = superSquare.y; y < superSquare.y + superSquare.size; y++) {
        currentSquare = board[x][y];

        if (x === superSquare.x) {
          addBorder(currentSquare.el, "Top", players[superSquare.player]);
        }
        if (x === superSquare.x + superSquare.size - 1) {
          addBorder(currentSquare.el, "Bottom", players[superSquare.player]);
        }
        if (y === superSquare.y) {
          addBorder(currentSquare.el, "Left", players[superSquare.player]);
        }
        if (y === superSquare.y + superSquare.size - 1) {
          addBorder(currentSquare.el, "Right", players[superSquare.player]);
        }
      }
    }
  });
}

function onMouseOver(square) {
  if (!square) {
    return clearEvents();
  } else if (square.frozen && square.player !== state.currentAction.player) {
    square.el.style.cursor = "not-allowed";
  }
  const player = square.player;

  if (global.dropSquare && global.dropSquare !== square) {
    onMouseOut(global.dropSquare);
  }

  if (!global.dropSquare) {
    global.dropSquare = square;
  }

  if (
    global.dragSquare &&
    global.dragSquare.player !== square.player &&
    square.el.classList.contains("dotted-border")
  ) {
    global.dragSquare.el.classList.remove("square-vibration");
    const color = getColorByPlayer(global.dragSquare.player, "focusColor");

    square.el.style.backgroundColor = color;
    square.el.style.cursor = "grab";
    square.el.classList.add("square-vibration");
    return;
  } else if (global.dragSquare === square) {
    square.el.style.cursor = "grabbing";
  }

  if (
    player === state.currentAction.player &&
    !state.currentAction.remainingMoves
  ) {
    square.el.style.backgroundColor = getColorByPlayer(player, "focusColor");
    square.el.style.cursor = "pointer";
  } else if (player === state.currentAction.player && !global.dragSquare) {
    const adjacentSquares = getAdjacentPossibleMoves(square.x, square.y).map(
      (move) => move[0]
    );
    if (adjacentSquares.length > 0) {
      square.el.style.backgroundColor = getColorByPlayer(player, "focusColor");
      square.el.style.cursor = "grab";
    } else {
      square.el.style.cursor = "not-allowed";
    }
  }
}
function onMouseOut(square) {
  global.dropSquare = null;
  square.el.classList.remove("square-vibration");
  const player = square.player;
  const color = getColorByPlayer(player);
  if (!global.dragSquare || global.dragSquare !== square) {
    square.el.style.backgroundColor = color;
  }
  square.el.style.cursor = "default";
}
function clearEvents() {
  global.dropSquare = null;
  global.dragSquare = null;
  state.board.squares.forEach((square) => {
    square.el.classList.remove("dotted-border");
    square.el.classList.remove("square-vibration");
    const color = getColorByPlayer(square.player);
    square.el.style.backgroundColor = color;
    square.el.style.cursor = "default";
  });
}
function onMouseDown(square) {
  clearEvents();
  if (square.player !== state.currentAction.player) {
    return;
  }

  const adjacentSquares = getAdjacentPossibleMoves(square.x, square.y).map(
    (move) => move[0]
  );

  if (adjacentSquares.length === 0) {
    square.el.style.cursor = "not-allowed";
    return;
  }
  global.dragSquare = square;
  if (adjacentSquares.length) {
    square.el.style.cursor = "grabbing";
  }
  adjacentSquares.forEach((adjacentSquare) => {
    adjacentSquare.el.classList.add("dotted-border");
  });
}
function onMouseUp(square) {
  if (!global.dragSquare) {
    return;
  }

  square.el.classList.remove("square-vibration");
  const adjacentSquares = getAdjacentPossibleMoves(
    global.dragSquare.x,
    global.dragSquare.y
  ).map((move) => move[0]);
  adjacentSquares.forEach((adjacentSquare) => {
    adjacentSquare.el.classList.remove("dotted-border");
  });

  if (square.frozen) {
    return clearEvents();
  }

  if (square.player === state.currentAction.player) {
    square.el.style.cursor = "grab";
    global.dragSquare = null;
    return;
  }

  const isHorizontalMove =
    global.dragSquare.x === square.x &&
    Math.abs(global.dragSquare.y - square.y) === 1;
  const isVerticalMove =
    global.dragSquare.y === square.y &&
    Math.abs(global.dragSquare.x - square.x) === 1;

  if (!isHorizontalMove && !isVerticalMove) {
    global.dragSquare = null;
    return;
  }

  swapSquare(square, global.dragSquare);

  global.dragSquare = null;

  if (!state.players[state.currentAction.player].bot) {
    onMouseOver(square);
  }

  if (isTheGameOver()) {
    showResult();
  }
}

function isTheGameOver() {
  const player = state.board.squares[0].player;
  const findSquareFromAnotherPlayer = state.board.squares.find((square) => {
    return square.player !== player;
  });
  return !findSquareFromAnotherPlayer;
}

function decreaseSuperSquare(
  destinationSquare,
  previousPlayer,
  board = state.board
) {
  const { superSquare } = destinationSquare;
  const {
    x: superSquareX,
    y: superSquareY,
    size: superSquareSize,
  } = superSquare;

  // if the square size is 2, it means that the whole square can be deleted
  if (superSquare.size === 2) {
    for (let x = superSquareX; x < superSquareX + superSquareSize; x++) {
      for (let y = superSquareY; y < superSquareY + superSquareSize; y++) {
        removeSquareFromSuperSquare(board[x][y], superSquare);
      }
    }
  } else {
    let removingRow;
    if (
      destinationSquare.x === superSquareX ||
      destinationSquare.x === superSquareX + superSquareSize - 1
    ) {
      removingRow = destinationSquare.x;
    }
    if (!removingRow) {
      const superSquareInitialRow = superSquareX;
      const superSquareFinalRow = superSquareX + superSquareSize - 1;
      const superSquareInitialRowDistance = Math.abs(
        superSquareInitialRow - destinationSquare.x
      );
      const superSquareFinalRowDistance = Math.abs(
        superSquareFinalRow - destinationSquare.x
      );
      removingRow =
        superSquareFinalRowDistance > superSquareInitialRowDistance
          ? superSquareInitialRow
          : superSquareFinalRow;
    }
    let removingCol;
    if (
      destinationSquare.y === superSquareY ||
      destinationSquare.y === superSquareY + superSquareSize - 1
    ) {
      removingCol = destinationSquare.y;
    }
    if (!removingCol) {
      const superSquareInitialCol = superSquareY;
      const superSquareFinalCol = superSquareY + superSquareSize - 1;
      const superSquareInitialColDistance = Math.abs(
        superSquareInitialCol - destinationSquare.y
      );
      const superSquareFinalColDistance = Math.abs(
        superSquareFinalCol - destinationSquare.y
      );
      removingCol =
        superSquareFinalColDistance > superSquareInitialColDistance
          ? superSquareInitialCol
          : superSquareFinalCol;
    }

    // remove line
    for (let y = superSquareY; y < superSquareY + superSquareSize; y++) {
      removeSquareFromSuperSquare(board[removingRow][y], superSquare);
    }

    // remove col
    for (let x = superSquareX; x < superSquareX + superSquareSize; x++) {
      removeSquareFromSuperSquare(board[x][removingCol], superSquare);
    }

    if (superSquare.x === removingRow) {
      superSquare.x++;
    }

    if (superSquare.y === removingCol) {
      superSquare.y++;
    }

    superSquare.size--;
  }

  for (let x = 1; x <= board.numRows; x++) {
    for (let y = 1; y <= board.numCols; y++) {
      if (
        board[x][y].superSquare ||
        !checkIfPlayerIsOnSquare(previousPlayer, x, y, board)
      ) {
        continue;
      }
      discoverNewSquares(board, x, y);
    }
  }
}
function removeSquareFromSuperSquare(square, superSquare) {
  removeBorders(square.el);
  square.el.innerHTML = "";
  delete square.superSquare;
}

function createSuperSquare(superSquareX, superSquareY, size = 2) {
  const player = state.board[superSquareX][superSquareY].player;
  const superSquare = {
    player,
    size,
    x: superSquareX,
    y: superSquareY,
  };

  for (let x = superSquareX; x < superSquareX + size; x++) {
    for (let y = superSquareY; y < superSquareY + size; y++) {
      state.board[x][y].superSquare = superSquare;
    }
  }

  return superSquare;
}
function checkSuperSquareCreationPossibly(destinationSquare, originSquare) {
  const board = state.board;

  const { x, y, player } = destinationSquare;

  const isHorizontalMove =
    originSquare.x === x && Math.abs(originSquare.y - y) === 1;
  const isVerticalMove =
    originSquare.y === y && Math.abs(originSquare.x - x) === 1;

  const checkSquarePossibility = (possibleX, possibleY) => {
    return (
      checkIfPlayerIsOnSquare(player, possibleX, possibleY) &&
      !board[possibleX][possibleY].superSquare
    );
  };

  if (!originSquare.superSquare) {
    if (isHorizontalMove) {
      //prioritize if origin and destination are within the new super square
      if (
        checkSquarePossibility(x - 1, y) &&
        checkSquarePossibility(x - 1, y) &&
        checkSquarePossibility(x - 1, originSquare.y)
      ) {
        return { x: x - 1, y: y < originSquare.y ? y : originSquare.y };
      }
      if (
        checkSquarePossibility(x + 1, y) &&
        checkSquarePossibility(x + 1, originSquare.y)
      ) {
        return { x, y: y < originSquare.y ? y : originSquare.y };
      }
    }

    if (isVerticalMove) {
      //prioritize if origin and destination are within the new super square
      if (
        checkSquarePossibility(x, y - 1) &&
        checkSquarePossibility(originSquare.x, y - 1)
      ) {
        return { x: x < originSquare.x ? x : originSquare.x, y: y - 1 };
      }
      if (
        checkSquarePossibility(x, y + 1) &&
        checkSquarePossibility(originSquare.x, y + 1)
      ) {
        return { x: x < originSquare.x ? x : originSquare.x, y };
      }
    }
  }

  //now check if only the destination square generated a super square
  if (
    isHorizontalMove &&
    checkSquarePossibility(x, y > originSquare.y ? y + 1 : y - 1)
  ) {
    return checkSuperSquareCreationPossibly(
      board[x][y > originSquare.y ? y + 1 : y - 1],
      destinationSquare
    );
  }
  if (
    isVerticalMove &&
    checkSquarePossibility(x > originSquare.x ? x + 1 : x - 1, y)
  ) {
    return checkSuperSquareCreationPossibly(
      board[x > originSquare.x ? x + 1 : x - 1][y],
      destinationSquare
    );
  }
}

function possiblyIncreaseSuperSquare(superSquare, destinationSquare) {
  const { x: superSquareX, y: superSquareY, size } = superSquare;
  const { x: destinationX, y: destinationY, player } = destinationSquare;

  const checkSquarePossibility = (possibleX, possibleY) => {
    return (
      checkIfPlayerIsOnSquare(player, possibleX, possibleY) &&
      !state.board[possibleX][possibleY].superSquare
    );
  };

  const rowsToCheck = [];
  const colsToCheck = [];
  if (
    destinationX === superSquareX - 1 ||
    destinationX === superSquareX + size
  ) {
    rowsToCheck.push(destinationX);
    colsToCheck.push(superSquareY - 1);
    colsToCheck.push(superSquareY + size);
  } else {
    colsToCheck.push(destinationY);
    rowsToCheck.push(superSquareX - 1);
    rowsToCheck.push(superSquareX + size);
  }
  rowsToCheck.forEach((row) => {
    colsToCheck.forEach((col) => {
      const initialCol = col < superSquareY ? col : superSquareY;
      const finalCol =
        col < superSquareY + size ? superSquareY + size - 1 : col;
      const initialRow = row < superSquareX ? row : superSquareX;
      const finalRow =
        row < superSquareX + size ? superSquareX + size - 1 : row;

      for (let x = initialRow; x <= finalRow; x++) {
        if (!checkSquarePossibility(x, col)) {
          return;
        }
      }
      for (let y = initialCol; y <= finalCol; y++) {
        if (!checkSquarePossibility(row, y)) {
          return;
        }
      }

      createSuperSquare(
        initialRow < superSquareX ? initialRow : superSquareX,
        initialCol < superSquareY ? initialCol : superSquareY,
        superSquare.size + 1
      );
    });
  });
}

function possiblyIncreaseNearbySuperSquares(destinationSquare, originSquare) {
  const { board } = state;
  const { x: destinationX, y: destinationY, player } = destinationSquare;

  const checkIfSuperSquareAndSamePlayer = (possibleX, possibleY) => {
    return (
      checkIfPlayerIsOnSquare(player, possibleX, possibleY) &&
      board[possibleX][possibleY].superSquare
    );
  };

  for (let x = destinationX - 1; x <= destinationX + 1; x++) {
    for (let y = destinationY - 1; y <= destinationY + 1; y++) {
      if (checkIfSuperSquareAndSamePlayer(x, y)) {
        possiblyIncreaseSuperSquare(board[x][y].superSquare, destinationSquare);
      }
    }
  }
}
function showStartPage(page) {
  const pages = ["options", "levels", "settings", "about"];

  pages.forEach((page) => {
    hideElement(elements.start[page]);
  });

  showElement(elements.start[page]);
}

function setSquareColor(square) {
  const color = getColorByPlayer(square.player);
  square.el.style.backgroundColor = color;
  square.el.parentNode.style.backgroundColor = color;
}

async function swapSquare(destinationSquare, originSquare) {
  if (destinationSquare.hasFrostMine) {
    destinationSquare.frozen = true;
    destinationSquare.hasFrostMine = false;
    detonateFrostMine(destinationSquare);
    destinationSquare.el.innerHTML = global.frozenSvg;
  } else {
    const previousPlayer = destinationSquare.player;

    destinationSquare.player = originSquare.player;
    setSquareColor(destinationSquare);

    //work on the disassembly of the opponent square
    if (destinationSquare.superSquare) {
      decreaseSuperSquare(destinationSquare, previousPlayer);
    }

    if (originSquare.superSquare) {
      possiblyIncreaseSuperSquare(originSquare.superSquare, destinationSquare);
    }

    const possibleSquare = checkSuperSquareCreationPossibly(
      destinationSquare,
      originSquare
    );
    if (possibleSquare) {
      createSuperSquare(possibleSquare.x, possibleSquare.y);
    }

    possiblyIncreaseNearbySuperSquares(destinationSquare, originSquare);

    discoverAllNewSquares();
  }

  state.currentAction.remainingMoves--;
  const currentPlayer = state.players[state.currentAction.player];

  document.querySelector(
    "#moves"
  ).innerHTML = `Remaining moves: ${state.currentAction.remainingMoves}`;
  state.currentAction.turnMoves++;

  if (state.currentAction.remainingMoves > 0) {
    if (currentPlayer.bot) {
      playAsBot(state.currentAction.player);
    }
  } else if (currentPlayer.bot) {
    updateBoard();
    await sleep(1000);
    startTurn();
  } else {
    clearEvents();
    hideElement(elements.game.moves);
    showElement(elements.game.finishTurn);
  }

  updateBoard();
}
function setSettings(settings) {
  const currentSettings = getSettings();
  localStorage.setItem(
    "battlesquare_settings",
    JSON.stringify({
      ...currentSettings,
      ...settings,
    })
  );
  loadSettings();
}

function toggleSettings(prop) {
  const currentSettings = getSettings();
  if (prop === "speed") {
    currentSettings[prop] =
      currentSettings[prop] === "FAST"
        ? "SLOW"
        : currentSettings[prop] === "NORMAL"
        ? "FAST"
        : "NORMAL";
  } else {
    currentSettings[prop] = !currentSettings[prop];
  }

  setSettings(currentSettings);
}

function getSettings() {
  const localSettings = JSON.parse(
    localStorage.getItem("battlesquare_settings") || "{}"
  );
  return { ...global.settings, ...localSettings };
}
function loadSettings() {
  const settings = getSettings();
  Object.keys(settings).forEach((key) => {
    if (elements.settings[key]) {
      elements.settings[key].innerHTML =
        settings[key] === true
          ? "ON"
          : settings[key] === false
          ? "OFF"
          : settings[key];
    }
  });
}
