MyGame.graphics = (function () {
  "use strict";

  let canvas = document.getElementById("id-canvas");
  let context = canvas.getContext("2d");

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --------------------------------------------------------------
  //
  // Draws a texture to the canvas with the following specification:
  //    image: Image
  //    center: {x: , y: }
  //    size: { width: , height: }
  //
  // --------------------------------------------------------------
  function drawTexture(texture) {
    if (texture.image.ready) {
      context.save();

      context.translate(texture.center.x, texture.center.y);
      context.rotate(texture.rotation);
      context.translate(-texture.center.x, -texture.center.y);

      context.drawImage(
        texture.image,
        texture.center.x - texture.width / 2,
        texture.center.y - texture.height / 2,
        texture.width,
        texture.height
      );

      context.restore();
    }
  }

  function drawPaddle(spec, texture) {
    texture.width = spec.width;
    texture.height = 300;
    texture.center.x = spec.center.x;
    texture.center.y = spec.center.y +30;
    texture.rotation = spec.rotation;
    drawTexture(texture);
  }
  function drawCircle(spec) {
    context.beginPath();
    context.arc(spec.center.x, spec.center.y, spec.radius, 0, 2 * Math.PI);
    context.closePath();

    context.strokeStyle = spec.outlineColor;
    context.fillStyle = spec.fillColor;

    context.fill();
    context.stroke();
  }

  function drawRectangle(spec) {
    context.save();
    context.translate(spec.center.x, spec.center.y);
    context.rotate(spec.rotation);
    context.translate(-spec.center.x, -spec.center.y);

    context.strokeStyle = spec.outlineColor;
    context.fillStyle = spec.fillColor;

    context.fillRect(
      spec.center.x - spec.width / 2,
      spec.center.y - spec.height / 2,
      spec.width,
      spec.height
    );

    context.strokeRect(
      spec.center.x - spec.width / 2,
      spec.center.y - spec.height / 2,
      spec.width,
      spec.height
    );

    context.restore();
  }

  function drawBlockGrid(blockGrid) {
    for (let i = 0; i < blockGrid.length; i++) {
      for (let j = 0; j < blockGrid[i].length; j++) {
        if (!blockGrid[i][j].broken) drawRectangle(blockGrid[i][j]);
      }
    }
  }

  function drawLives(lives, spec1, spec2, spec3) {
    if (lives == 3) {
      drawTexture(spec1);
      drawTexture(spec2);
      drawTexture(spec3);
    } else if (lives == 2) {
      drawTexture(spec1);
      drawTexture(spec2);
    } else if (lives == 1) {
      drawTexture(spec1);
    }
  }

  function drawText(spec) {
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fillStyle;
    context.strokeStyle = spec.strokeStyle;
    context.textBaseline = "top";

    context.translate(spec.position.x, spec.position.y);
    context.rotate(spec.rotation);
    context.translate(-spec.position.x, -spec.position.y);

    context.fillText(spec.text, spec.position.x, spec.position.y);
    context.strokeText(spec.text, spec.position.x, spec.position.y);

    context.restore();
  }

  function drawBalls(balls) {
    for (let i = 0; i < balls.length; i++) {
      drawCircle(balls[i]);
    }
  }

  function getTextWidth(text, font) {
    context.font = font;
    let width = context.measureText(text).width;
    return Math.floor((canvas.width - width) / 2);
  }

  function textWidth(text, font) {
    context.font = font;
    let width = context.measureText(text).width;
    return canvas.width - Math.floor(width) - 50;
  }

  let api = {
    get canvas() {
      return canvas;
    },
    drawLives: drawLives,
    drawPaddle: drawPaddle,
    clear: clear,
    drawTexture: drawTexture,
    drawText: drawText,
    drawRectangle: drawRectangle,
    drawCircle: drawCircle,
    drawBlockGrid: drawBlockGrid,
    getTextWidth: getTextWidth,
    textWidth: textWidth,
    drawBalls: drawBalls,
  };

  return api;
})();
