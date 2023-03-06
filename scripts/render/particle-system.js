MyGame.render.ParticleSystem = function (system, graphics) {
  "use strict";

  function render() {
    Object.getOwnPropertyNames(system.particles()).forEach(function (value) {
      let particle = system.particles()[value];
      graphics.drawRectangle(particle);
    });
  }

  let api = {
    render: render,
  };

  return api;
};
