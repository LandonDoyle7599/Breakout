MyGame.screens["credits"] = (function (game) {
  "use strict";
  let exitFn = (event) => {
    if (event.key === "Escape") {
      game.showScreen("main-menu");
    }
  };

  function initialize() {
    document
      .getElementById("id-credits-back")
      .addEventListener("click", function () {
        document.removeEventListener("keydown", exitFn);
        game.showScreen("main-menu");
      });
  }

  function run() {
    document.addEventListener("keydown", exitFn, { once: true });
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
