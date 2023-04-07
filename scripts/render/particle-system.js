MyGame.render.ParticleSystem = function (system, graphics) {
  "use strict";

  function render() {
    let particles = system.particles();
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].alive < particles[i].lifetime) {
        graphics.drawRectangle(particles[i]);
      }
    }
  }

  let api = {
    render: render,
  };

  return api;
};
