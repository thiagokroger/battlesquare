function getInitialState(level = "hard") {
  const initialState = {
    players: {
      1: {
        color: "blue",
        focusColor: "darkBlue",
        frostMines: 3,
      },
      2: {
        color: "red",
        focusColor: "darkRed",
        bot: true,
        botLevel: level,
        frostMines: 3,
      },
    },
    board: {
      squares: [],
      superSquares: [],
      numRows: 8,
      numCols: 6,
      numPlayers: 2,
      squareSize: 128,
    },
    currentAction: {
      player: 0,
      turn: 0,
      turnMoves: 0,
      remainingMoves: 3,
    },
    level,
  };
  initialState.board.squares = getCheckersStyle(
    initialState.board.numRows,
    initialState.board.numCols
  );

  return initialState;
}

function setup(level) {
  const initialState = getInitialState(level);
  const boardConfig = initialState.board;
  const boardDiv = elements.game.board;
  const toolbarDiv = elements.game.toolbar;
  const bottombarDiv = elements.game.bottombar;
  const gameDiv = elements.game.container;

  boardDiv.innerHTML = "";
  boardDiv.style.width = "100%";

  const viewportHeight =
    gameDiv.clientHeight -
    toolbarDiv.clientHeight -
    bottombarDiv.clientHeight -
    128;
  const viewportWidth = boardDiv.clientWidth;

  const squareSizeBasedOnWidth = Math.floor(
    viewportWidth / boardConfig.numCols
  );
  const squareSizeBasedOnHeight = Math.floor(
    viewportHeight / boardConfig.numRows
  );
  let squareSize = squareSizeBasedOnWidth;

  if (squareSizeBasedOnHeight < squareSizeBasedOnWidth) {
    squareSize = squareSizeBasedOnHeight;
  }

  boardDiv.style.width = squareSize * boardConfig.numCols + 4 + "px";
  toolbarDiv.style.width = boardDiv.style.width;
  bottombarDiv.style.width = boardDiv.style.width;

  const defaultParentSquare = document.createElement("div");
  const defaultSquare = document.createElement("div");
  defaultParentSquare.style.width = squareSize + "px";
  defaultParentSquare.style.height = squareSize + "px";
  defaultSquare.classList.add("square");

  let clone;
  for (let x = 1; x <= boardConfig.numRows; x++) {
    for (let y = 1; y <= boardConfig.numCols; y++) {
      clone = defaultSquare.cloneNode(true);
      clone.id = `square-${x}-${y}`;
      boardDiv
        .appendChild(defaultParentSquare.cloneNode(true))
        .appendChild(clone);
    }
  }
  const board = {
    squares: [],
  };
  let row = 1,
    col = 1;

  boardConfig.squares.forEach((num) => {
    const el = document.querySelector(`#square-${row}-${col}`);

    const color = getColor(initialState.players[num].color);
    el.style.backgroundColor = color;
    el.parentNode.style.backgroundColor = color;

    if (!board[row]) {
      board[row] = {};
    }
    board[row][col] = { player: num, el, x: row, y: col };
    board.squares.push(board[row][col]);
    col++;
    if (col > boardConfig.numCols) {
      col = 1;
      row++;
    }
  });

  boardConfig.superSquares.forEach(([player, [x, y], [finalX, finalY]]) => {
    const size = finalY - y + 1;
    const superSquare = {
      player,
      size,
      x,
      y,
    };
    const squareList = getSquaresByRange(board, x, y, finalX, finalY);
    squareList.forEach((square) => {
      square.superSquare = superSquare;
    });
  });

  initialState.board = {
    ...boardConfig,
    ...board,
  };

  return initialState;
}
