MyGame.screens["game-play"] = (function (game, input) {
  "use strict";

  let lastTimeStamp = performance.now();
  let cancelNextRequest = true;
  let countdown = 3;
  let initializedBall = false;

  let myKeyboard = input.Keyboard();

  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
  }

  function update(elapsedTime) {
    if (game.paddleShrinking()) {
      if (game.shrinkPaddle(elapsedTime)) {
        return;
      }
    }
    if (game.gameWon()) {
      return;
    }
    if (!initializedBall && checkCountdown(elapsedTime)) {
      game.lockBall();
      return;
    } else if (!initializedBall) {
      game.initializeBall();
      initializedBall = true;
    }
    let lost = game.updateBall(elapsedTime);
    if (lost) {
      if (game.gameOver()) {
        return;
      }
      initializedBall = false;
      countdown = 3;
      return;
    }
    game.updateParticles(elapsedTime);
    game.checkCollisions();
  }

  function render() {
    MyGame.graphics.clear();
    MyGame.graphics.drawTexture(background.texture);
    MyGame.graphics.drawPaddle(game.paddle(), paddleTexture.texture);
    if (game.gameWon()) {
      MyGame.graphics.drawText(createWonGameTextSpec());
      MyGame.graphics.drawText(createFinalScoreTextSpec(game.getScore()));
      MyGame.graphics.drawText(createInstructionsSpec());
      return;
    }
    MyGame.graphics.drawBlockGrid(game.getBlockGrid());
    MyGame.game.renderParticles();
    if (game.gameOver()) {
      MyGame.graphics.drawText(createLostGameTextSpec());
      MyGame.graphics.drawText(createFinalScoreTextSpec(game.getScore()));
      MyGame.graphics.drawText(createInstructionsSpec());
      return;
    }
    MyGame.graphics.drawLives(
      game.getLives(),
      lifeOne.texture,
      lifeTwo.texture,
      lifeThree.texture
    );
    MyGame.graphics.drawText(createScoreTextSpec(game.getScore()));
    if (!game.paddleShrinking()) {
      MyGame.graphics.drawBalls(game.balls(), ballTexture.texture);
    }
    if (countdown > -1) {
      MyGame.graphics.drawText(createCountdownSpec());
      return;
    }
  }

  function gameLoop(time) {
    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;
    processInput(elapsedTime);
    update(elapsedTime);
    render();
  }

  function checkCountdown(time) {
    if (countdown > -1) {
      countdown -= time / 1000;
    }
    return countdown > -1;
  }

  function initialize() {
    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;

      if (game.gameWon() || game.gameOver()) {
        let nameInput = document.getElementById("id-name");
        nameInput.focus();
        nameInput.select();
        document
          .getElementById("id-submit")
          .addEventListener("click", function () {
            document.getElementById("id-name").value = "";
            game.logScore(game.getScore(), nameInput.value, game.getLives());
            document.getElementById("winner-window").style.display = "none";
            cancelNextRequest = true;
            MyGame.music.pauseSound("game");
            MyGame.music.playSound("menu");
            game.showScreen("main-menu");
          });
        document.getElementById("winner-window").style.display = "block";
      } else {
        document
          .getElementById("id-yes")
          .addEventListener("click", function () {
            cancelNextRequest = true;
            document.getElementById("escape-window").style.display = "none";
            MyGame.music.pauseSound("game");
            MyGame.music.playSound("menu");
            game.showScreen("main-menu");
          });
        document.getElementById("id-no").addEventListener("click", function () {
          document.getElementById("escape-window").style.display = "none";
          cancelNextRequest = false;
          lastTimeStamp = performance.now();
          gameLoop(performance.now());
        });
        document.getElementById("escape-window").style.display = "block";
      }
    });
  }

  function run() {
    countdown = 3;
    lastTimeStamp = performance.now();
    initializedBall = false;
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  function defineTexture(spec) {
    let that = {};

    spec.image = new Image();
    spec.image.ready = false;
    spec.image.onload = function () {
      this.ready = true;
    };
    spec.image.src = spec.imageSrc;

    that.texture = spec;

    return that;
  }

  function createCountdownSpec() {
    return {
      font: "bold 200px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("333", "bold 200px Poppins"),
        y: 350,
      },
      rotation: 0,
      text: countdown > 0 ? "   " + Math.ceil(countdown) : "GO!",
    };
  }

  function createInstructionsSpec() {
    return {
      font: "bold 45px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth(
          "Press ESC to return to the main menu",
          "bold 45px Poppins"
        ),
        y: 525,
      },
      rotation: 0,
      text: "Press ESC to return to the main menu",
    };
  }
  function createFinalScoreTextSpec(score) {
    return {
      font: "bold 50px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("Score: " + score, "bold 50px Poppins"),
        y: 450,
      },
      rotation: 0,
      text: "Score: " + score,
    };
  }
  function createLostGameTextSpec() {
    return {
      font: "bold 80px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("Game Over", "bold 80px Poppins"),
        y: 350,
      },
      rotation: 0,
      text: "Game Over",
    };
  }
  function createWonGameTextSpec() {
    return {
      font: "bold 80px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.getTextWidth("You Win!", "bold 80px Poppins"),
        y: 350,
      },
      rotation: 0,
      text: "You Win!",
    };
  }
  function createScoreTextSpec(score) {
    return {
      font: "bold 50px Poppins",
      fillStyle: "white",
      strokeStyle: "black",
      position: {
        x: MyGame.graphics.textWidth("SCORE: " + score, "bold 50px Poppins"),
        y: 950,
      },
      rotation: 0,
      text: "SCORE: " + score,
    };
  }
  myKeyboard.register("ArrowLeft", game.paddle().moveLeft);
  myKeyboard.register("ArrowRight", game.paddle().moveRight);

  let lifeOne = defineTexture({
    imageSrc: "assets/anatomicalHeart.png",
    center: { x: 40, y: 960 },
    width: 250,
    height: 250,
  });
  let lifeTwo = defineTexture({
    imageSrc: "assets/anatomicalHeart.png",
    center: { x: 115, y: 960 },
    width: 250,
    height: 250,
  });
  let lifeThree = defineTexture({
    imageSrc: "assets/anatomicalHeart.png",
    center: { x: 190, y: 960 },
    width: 250,
    height: 250,
  });
  let background = defineTexture({
    imageSrc: "assets/background.jpg",
    center: { x: 500, y: 500 },
    width: 1000,
    height: 1000,
  });
  let paddleTexture = defineTexture({
    imageSrc: "assets/pixilart-drawing.png",
    center: { x: 500, y: 950 },
    width: 200,
    height: 50,
  });
  let ballTexture = defineTexture({
    imageSrc: "assets/ballicon.png",
    center: { x: 500, y: 500 },
    width: 50,
    height: 50,
  });

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game, MyGame.input);
