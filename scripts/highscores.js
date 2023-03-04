MyGame.screens["high-scores"] = (function (game) {
  "use strict";

  function initialize() {
    document
      .getElementById("id-high-scores-back")
      .addEventListener("click", function () {
        game.showScreen("main-menu");
      });
    document
      .getElementById("id-reset-high-scores")
      .addEventListener("click", function () {
        if (localStorage.highScores) {
          localStorage.highScores = JSON.stringify([]);
        }
        document.getElementById("id-high-scores-list").innerHTML = "";
      });
    //Todo: add reset button
  }

  function run() {
    let list = document.getElementById("id-high-scores-list");
    list.innerHTML = "";
    if (!localStorage.highScores) return;
    let highScores = JSON.parse(localStorage.highScores);
    highScores.sort((a, b) => b.score - a.score);
    let iterationCount = highScores.length > 5 ? 5 : highScores.length;
    for (let i = 0; i < iterationCount; i++) {
      let li = document.createElement("li");
      li.appendChild(
        document.createTextNode(
          highScores[i].name +
            " - score: " +
            highScores[i].score +
            " - lives: " +
            highScores[i].lives
        )
      );
      list.appendChild(li);
    }
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
