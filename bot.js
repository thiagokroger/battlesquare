const getBot = () => {
  const bot = (() => {
    const levels = {
      easy: [randomMove],
      medium: [
        possiblyDestroyOpponentSquare,
        possiblyCreateSuperSquare,
        randomMove,
      ],
      hard: [
        possiblyDestroyOpponentCreatingSquareAvoidingOpponentCreation,
        possiblyDestroyOpponentSquareAvoidingOpponentCreation,
        possiblyDestroyOpponentSquare,
        possiblyCreateSuperSquare,
        randomMove,
      ],
    };

    const lastDestinationByPlayer = {};

    function getVirtualBoard(board) {
      const virtualBoard = JSON.parse(JSON.stringify(board));
      virtualBoard.squares = [];

      for (let x = 1; x <= virtualBoard.numRows; x++) {
        for (let y = 1; y <= virtualBoard.numCols; y++) {
          virtualBoard.squares.push(virtualBoard[x][y]);
        }
      }

      return virtualBoard;
    }

    function getRandomNumber(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const getNextMove = (board, player, level = "easy") => {
      const functions = levels[level];
      let move;

      functions.some((fn) => {
        move = fn(board, player);
        if (move) {
          lastDestinationByPlayer[player] = move[0];
          return true;
        }
      });

      const [destination, origin] = randomMove(board, player);
      plantFrostMine(origin);

      return move;
    };

    function getShuffleMove(list, player) {
      const randomSquareIndex = getRandomNumber(0, list.length - 1);
      const randomSquare = list[randomSquareIndex];

      if (randomSquare.player !== player) {
        return getShuffleMove(list, player);
      }
      const possibleMoves = getAdjacentPossibleMoves(
        randomSquare.x,
        randomSquare.y
      );

      if (possibleMoves.length) {
        const move = getRandomNumber(0, possibleMoves.length - 1);
        return possibleMoves[move];
      }

      return getShuffleMove(list, player);
    }

    function randomMove(board, player) {
      const possibleMoves = getPlayerPossibleMoves(board, player);

      if (!possibleMoves.length) {
        return;
      }
      const nextMoveIndex = getRandomNumber(0, possibleMoves.length - 1);

      return possibleMoves[nextMoveIndex];
    }

    function getPlayerPossibleMoves(board, player) {
      let possibleMoves = [];

      for (let x = 1; x <= board.numRows; x++) {
        for (let y = 1; y <= board.numCols; y++) {
          if (board[x][y].player === player) {
            possibleMoves = possibleMoves.concat(
              getAdjacentPossibleMoves(x, y)
            );
          }
        }
      }
      return possibleMoves;
    }

    function possiblyDestroyOpponentSquare(board, player) {
      const possibleMoves = getPlayerPossibleMoves(board, player);

      let moves = [];

      possibleMoves.forEach(([destinationSquare, originSquare]) => {
        if (destinationSquare.superSquare) {
          moves.push([destinationSquare, originSquare]);
        }
      });
      const nextMoveIndex = getRandomNumber(0, moves.length - 1);

      return moves[nextMoveIndex];
    }

    function possiblyDestroyOpponentSquareAvoidingOpponentCreation(
      board,
      player
    ) {
      let virtualBoard = getVirtualBoard(board);
      const possibleMoves = getPlayerPossibleMoves(virtualBoard, player);

      let moves = [];

      possibleMoves.forEach(([destinationSquare, originSquare]) => {
        virtualBoard = getVirtualBoard(board);
        destinationSquare =
          virtualBoard[destinationSquare.x][destinationSquare.y];
        originSquare = virtualBoard[originSquare.x][originSquare.y];
        if (destinationSquare.superSquare) {
          const tempPlayer = destinationSquare.player;

          const previousMoves = getNumberOfMoves(virtualBoard, tempPlayer);

          destinationSquare.player = originSquare.player;

          // check if the prior move will result in a square creation for the opponent
          decreaseSuperSquare(destinationSquare, tempPlayer, virtualBoard);

          const newMoves = getNumberOfMoves(virtualBoard, tempPlayer);

          if (newMoves >= previousMoves) {
            destinationSquare.player = tempPlayer;
            return;
          }

          moves.push([destinationSquare, originSquare]);
          destinationSquare.player = tempPlayer;
        }
      });
      const nextMoveIndex = getRandomNumber(0, moves.length - 1);

      return moves[nextMoveIndex];
    }

    function possiblyCreateSuperSquare(board, player) {
      const possibleMoves = getPlayerPossibleMoves(board, player);

      let moves = [];

      possibleMoves.forEach(([destinationSquare, originSquare]) => {
        const tempPlayer = destinationSquare.player;
        destinationSquare.player = originSquare.player;
        if (checkSuperSquareCreationPossibly(destinationSquare, originSquare)) {
          moves.push([destinationSquare, originSquare]);
        }
        destinationSquare.player = tempPlayer;
      });
      const nextMoveIndex = getRandomNumber(0, moves.length - 1);

      return moves[nextMoveIndex];
    }

    function possiblyDestroyOpponentCreatingSquareAvoidingOpponentCreation(
      board,
      player
    ) {
      let virtualBoard = getVirtualBoard(board);
      const possibleMoves = getPlayerPossibleMoves(virtualBoard, player);

      let moves = [];

      possibleMoves.forEach(([destinationSquare, originSquare]) => {
        virtualBoard = getVirtualBoard(board);
        destinationSquare =
          virtualBoard[destinationSquare.x][destinationSquare.y];
        originSquare = virtualBoard[originSquare.x][originSquare.y];

        const tempPlayer = destinationSquare.player;

        const previousMoves = getNumberOfMoves(virtualBoard, tempPlayer);

        destinationSquare.player = originSquare.player;

        if (!destinationSquare.superSquare) {
          destinationSquare.player = tempPlayer;
          return;
        }

        // check if the prior move will result in a square creation for the opponent
        decreaseSuperSquare(destinationSquare, tempPlayer, virtualBoard);

        const newMoves = getNumberOfMoves(virtualBoard, tempPlayer);

        if (newMoves >= previousMoves) {
          destinationSquare.player = tempPlayer;
          return;
        }

        if (checkSuperSquareCreationPossibly(destinationSquare, originSquare)) {
          moves.push([destinationSquare, originSquare]);
        }
        destinationSquare.player = tempPlayer;
      });
      const nextMoveIndex = getRandomNumber(0, moves.length - 1);

      return moves[nextMoveIndex];
    }

    return {
      getNextMove,
      getShuffleMove,
    };
  })();
  return bot;
};
