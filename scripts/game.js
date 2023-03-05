// ------------------------------------------------------------------
//
// This is the game object.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function (screens, systems, graphics, render) {
  "use strict";
  let score = 0;
  let hitTop = false;
  let hitBlocks = 0;
  let totalHits = 0;
  let ballCount = 100;
  let lives = 3;
  let paddleShrinking = false;

  let paddle = definePaddle({
    center: { x: 500, y: 900 },
    width: 300,
    height: 50,
    outlineColor: "rgba(0,0,255,1)",
    fillColor: "rgba(255,255,255,1)",
    moveRate: 1,
    rotation: 0,
  });

  let particleRenderers = [];
  let particleSystems = [];

  let lineStats = {};

  let balls = [];

  let b1 = {
    outlineColor: "rgba(255,255,255,1)",
    fillColor: "rgba(200,200,200,1)",
    center: { x: 500, y: 925 },
    radius: 20,
    speed: 0,
    direction: { x: 0, y: 0 },
  };

  function definePaddle(spec) {
    function moveLeft(elapsedTime) {
      if (spec.center.x > spec.width / 2) {
        spec.center.x -= spec.moveRate * elapsedTime;
      }
    }
    function moveRight(elapsedTime) {
      if (spec.center.x < 1000 - spec.width / 2) {
        spec.center.x += spec.moveRate * elapsedTime;
      }
    }

    spec.moveLeft = moveLeft;
    spec.moveRight = moveRight;

    return spec;
  }

  let blockGrid = [];
  function createBlockGrid() {
    blockGrid = [];
    let colors = {
      0: "rgba(0,255,0,1)",
      1: "rgba(0,255,0,1)",
      2: "rgba(0,0,255,1)",
      3: "rgba(0,0,255,1)",
      4: "rgba(255,165,0,1)",
      5: "rgba(255,165,0,1)",
      6: "rgba(255,255,0,1)",
      7: "rgba(255,255,0,1)",
    };
    let scores = {
      0: 5,
      1: 5,
      2: 3,
      3: 3,
      4: 2,
      5: 2,
      6: 1,
      7: 1,
    };
    for (let i = 0; i < 8; i++) {
      blockGrid.push([]);
      for (let j = 0; j < 14; j++) {
        blockGrid[i].push({
          center: { x: 40 + j * 70.7, y: 100 + i * 45 },
          width: 68,
          height: 40,
          outlineColor: colors[i],
          fillColor: colors[i],
          rotation: 0,
          score: scores[i],
          broken: false,
          topRow: i == 0,
        });
      }
    }
  }

  function markBlockBroken(x, y) {
    blockGrid[x][y].broken = true;
  }

  function initializeBall() {
    balls[0].speed = 0.5;
    balls[0].direction = Random.nextBallVector();
  }

  function initializePaddle() {
    paddle.center.x = 500;
    paddle.center.y = 900;
  }

  function updateBall(elapsedTime) {
    let count = balls.length;
    for (let i = balls.length - 1; i >= 0; i--) {
      let ball = balls[i];
      ball.center.x += ball.speed * ball.direction.x * elapsedTime;
      ball.center.y += ball.speed * ball.direction.y * elapsedTime;
      if (ball.center.x < 20) {
        ball.direction.x = -ball.direction.x;
        ball.center.x = 20;
      }
      if (ball.center.x > 980) {
        ball.direction.x = -ball.direction.x;
        ball.center.x = 980;
      }
      if (ball.center.y < 20) {
        ball.direction.y = -ball.direction.y;
        ball.center.y = 20;
      }
      if (ball.center.y > 980) {
        if (count <= 1 && lives > 0) {
          lifeLost();
          return true;
        } else {
          balls.splice(i, 1);
          count--;
        }
      }
    }
    return false;
  }

  function logScore(score, name, lives) {
    if (!localStorage.highScores) {
      localStorage.highScores = JSON.stringify([]);
    }
    if (name == "" || name == null) {
      return;
    }
    let highScores = JSON.parse(localStorage.highScores);
    highScores.push({ score: score, name: name, lives: lives });
    highScores.sort((a, b) => b.score - a.score || b.lives - a.lives);

    localStorage.highScores = JSON.stringify(highScores);
  }

  //------------------------------------------------------------------
  //
  // This function is used to change to a new active screen.
  //
  //------------------------------------------------------------------
  function showScreen(id) {
    //
    // Remove the active state from all screens.  There should only be one...
    let active = document.getElementsByClassName("active");
    for (let screen = 0; screen < active.length; screen++) {
      active[screen].classList.remove("active");
    }
    //
    // Tell the screen to start actively running
    screens[id].run();
    //
    // Then, set the new screen to be active
    document.getElementById(id).classList.add("active");
  }

  function checkCollisions() {
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      if (
        ball.center.x - ball.radius < paddle.center.x + paddle.width / 2 &&
        ball.center.x + ball.radius > paddle.center.x - paddle.width / 2 &&
        ball.center.y + ball.radius > paddle.center.y - paddle.height / 2 &&
        ball.center.y - ball.radius < paddle.center.y + paddle.height / 2
      ) {
        ball.direction.y = -ball.direction.y;
        ball.center.y = paddle.center.y - paddle.height / 2 - ball.radius;
        ball.direction.x =
          (ball.center.x - paddle.center.x) / (paddle.width / 2);
        return;
      }
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 14; j++) {
          let block = blockGrid[i][j];
          if (!block.broken) {
            if (
              ball.center.x - ball.radius < block.center.x + block.width / 2 &&
              ball.center.x + ball.radius > block.center.x - block.width / 2 &&
              ball.center.y + ball.radius > block.center.y - block.height / 2 &&
              ball.center.y - ball.radius < block.center.y + block.height / 2
            ) {
              block.broken = true;
              addParticles(block);
              hitBlocks += 1;
              totalHits += 1;
              if (hitBlocks === 4) {
                ball.speed += 0.05;
              }
              if (hitBlocks === 12) {
                ball.speed += 0.075;
              }
              if (hitBlocks === 36) {
                ball.speed += 0.1;
              }
              if (hitBlocks === 62) {
                ball.speed += 0.125;
              }

              score += block.score;
              if (block.topRow && !hitTop) {
                hitTop = true;
                paddle.width = paddle.width / 2;
              }
              lineStats[i + 1] += 1;
              if (lineStats[i + 1] === 14) {
                score += 25;
              }
              if (score >= ballCount) {
                ballCount += 100;
                addBall();
              }
              ball.direction.y = -ball.direction.y;
              ball.center.y += ball.direction.y * ball.radius;
            }
          }
        }
      }
    }
  }

  function addParticles(block) {
    let system = systems.ParticleSystem({
      center: { x: block.center.x, y: block.center.y },
      width: block.width,
      height: block.height,
      size: 4,
      outlineColor: block.outlineColor,
      fillColor: block.fillColor,
    });
    system.create();
    particleSystems.push(system);
    let renderer = render.ParticleSystem(system, graphics);
    particleRenderers.push(renderer);
  }

  function addBall() {
    balls.push({
      outlineColor: "rgba(255,255,255,1)",
      fillColor: "rgba(200,200,200,1)",
      center: {
        x: paddle.center.x,
        y: paddle.center.y - paddle.height / 2 - balls[0].radius,
      },
      direction: Random.nextBallVector(),
      speed: 0.5,
      radius: 20,
    });
  }

  function shrinkPaddle(elapsedTime) {
    paddle.width -= 0.5 * elapsedTime;
    if (paddle.width < 0) {
      if (lives > 0) {
        paddle.width = 300;
      } else {
        paddle.width = 0;
        paddle.outlineColor = "rgba(255,255,255,0)";
      }
      paddleShrinking = false;
      return false;
    }
    paddleShrinking = true;
    return true;
  }

  function updateParticles(elapsedTime) {
    for (let i = 0; i < particleRenderers.length; i++) {
      if (particleSystems[i].update(elapsedTime)) {
        particleSystems.splice(i, 1);
        particleRenderers.splice(i, 1);
      }
    }
  }

  function renderParticles() {
    for (let i = 0; i < particleRenderers.length; i++) {
      particleRenderers[i].render();
    }
  }
  //------------------------------------------------------------------
  //
  // This function performs the one-time game initialization.
  //
  //------------------------------------------------------------------
  function initialize() {
    let screen = null;
    //
    // Go through each of the screens and tell them to initialize
    for (screen in screens) {
      if (screens.hasOwnProperty(screen)) {
        screens[screen].initialize();
      }
    }
    //
    // Make the main-menu screen the active one
    showScreen("main-menu");
  }

  function lockBall() {
    balls[0].center.x = paddle.center.x;
    balls[0].center.y = paddle.center.y - paddle.height / 2 - balls[0].radius;
    balls[0].direction.x = 0;
    balls[0].direction.y = 0;
  }

  function lifeLost() {
    lives -= 1;
    paddleShrinking = true;
    paddle.width = 300;
    hitTop = false;
    particleRenderers = [];
    particleSystems = [];
    hitBlocks = 0;
    if (lives <= 0) {
      return;
    }
  }

  function newGame() {
    score = 0;
    particleRenderers = [];
    particleSystems = [];
    paddleShrinking = false;
    ballCount = 100;
    lives = 3;
    totalHits = 0;
    hitBlocks = 0;
    hitTop = false;
    paddle.width = 300;
    balls = [];
    balls.push(b1);
    // initializeBall();
    initializePaddle();
    createBlockGrid();
    lineStats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };
  }

  return {
    initialize: initialize,
    showScreen: showScreen,
    createBlockGrid: createBlockGrid,
    markBlockBroken: markBlockBroken,
    updateBall: updateBall,
    logScore: logScore,
    initializeBall: initializeBall,
    checkCollisions: checkCollisions,
    initializePaddle: initializePaddle,
    lifeLost: lifeLost,
    shrinkPaddle: shrinkPaddle,
    lockBall: lockBall,
    newGame: newGame,
    renderParticles: renderParticles,
    updateParticles: updateParticles,
    getBlockGrid: () => blockGrid,
    balls: () => balls,
    paddle: () => paddle,
    paddleShrinking: () => paddleShrinking,
    gameWon: () => totalHits >= 112,
    getScore: () => score,
    gameOver: () => lives <= 0,
    getLives: () => lives,
  };
})(MyGame.screens, MyGame.systems, MyGame.graphics, MyGame.render);