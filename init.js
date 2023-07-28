let elements;
document.addEventListener("animationstart", async function (e) {
  if (e.animationName === "fade-in") {
    e.target.classList.add("did-fade-in");

    await sleep(2000);

    e.target.classList.add("fade-out");
    await sleep(1000);
    e.target.classList.remove("did-fade-in");
    e.target.classList.remove("fade-out");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  elements = {
    app: { container: getElement("#app") },
    start: {
      container: getElement("#start"),
      options: getElement("#startOptions"),
      levels: getElement("#startLevels"),
      settings: getElement("#startSettings"),
      about: getElement("#startAbout"),
    },
    game: {
      container: getElement("#game"),
      board: getElement("#board"),
      toolbar: getElement("#toolbar"),
      bottombar: getElement("#bottombar"),
      frostMines: getElement("#frostMines"),
      timer: getElement("#timer"),
      turn: getElement("#turn"),
      finishTurn: getElement("#finishTurn"),
      moves: getElement("#moves"),
    },
    result: {
      container: getElement("#result"),
      winner: getElement("#resultWinner"),
      board: getElement("#resultBoard"),
      level: getElement("#resultLevel"),
      info: getElement("#resultInfo"),
    },
    util: {
      glass: getElement("#glass"),
    },
    turnTransition: {
      container: getElement("#turnTransition"),
      turn: getElement("#turnTransitionTurn"),
      player: getElement("#turnTransitionPlayer"),
      moves: getElement("#turnTransitionMoves"),
    },
    settings: {
      sound: getElement("#settingsSound"),
      transitions: getElement("#settingsTransitions"),
      speed: getElement("#settingsSpeed"),
    },
  };
  loadSettings();
});
