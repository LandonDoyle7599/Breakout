let Random = (function () {
  "use strict";

  function nextRange(min, max) {
    let range = max - min;
    return Math.floor(Math.random() * range + min);
  }


  function nextBallVector() {
    let angle = nextRange(220, 320);
    if (angle > 265 && angle < 275) {
      Math.random() > 0.5
        ? (angle = nextRange(220, 260))
        : (angle = nextRange(280, 320));
    }
    let x = Math.cos(angle * (Math.PI / 180));
    let y = Math.sin(angle * (Math.PI / 180));
    return {
      x: x,
      y: y,
    };
  }

  let usePrevious = false;
  let y2;

  function nextGaussian(mean, stdDev) {
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let z = 0;

    if (usePrevious) {
      usePrevious = false;
      return mean + y2 * stdDev;
    }

    usePrevious = true;

    do {
      x1 = 2 * Math.random() - 1;
      x2 = 2 * Math.random() - 1;
      z = x1 * x1 + x2 * x2;
    } while (z >= 1);

    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;

    return mean + y1 * stdDev;
  }

  function nextDirectionRelativeToCenter(particlex, particley, blockx, blocky) {
    let angle = Math.atan2(particley - blocky, particlex - blockx);
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  return {
    nextDirectionRelativeToCenter: nextDirectionRelativeToCenter,
    nextBallVector: nextBallVector,
    nextRange: nextRange,
    nextGaussian: nextGaussian,
  };
})();
