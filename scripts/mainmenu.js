MyGame.screens["main-menu"] = (function (game) {
  "use strict";

  function initialize() {
    document
      .getElementById("id-new-game")
      .addEventListener("click", function () {
        MyGame.music.pauseSound("menu");
        MyGame.music.playSound("game");
        game.newGame();
        game.showScreen("game-play");
      });

    document
      .getElementById("id-high-scores")
      .addEventListener("click", function () {
        game.showScreen("high-scores");
      });

    document
      .getElementById("id-credits")
      .addEventListener("click", function () {
        game.showScreen("credits");
      });

    document
      .getElementById("id-instructions")
      .addEventListener("click", function () {
        game.showScreen("instructions");
      });
  }

  function run() {
    MyGame.music.playSound("menu");
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
