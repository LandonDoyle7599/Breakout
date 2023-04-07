MyGame.systems.ParticleSystem = function (spec) {
  "use strict";
  let particles = [];

  function create() {
    let particleX = 0;
    let particleY = 0;
    let iterationCount = ((spec.width / spec.size) * spec.height) / spec.size;
    let height = 0;
    let width = 0;
    let widthSpec = spec.width / spec.size;
    for (let j = 0; j < iterationCount; j++) {
      particleX = spec.center.x - spec.width / 2 + width * spec.size;
      particleY = spec.center.y - spec.height / 2 + height * spec.size;
      particles.push({
        center: {
          x: particleX,
          y: particleY,
        },
        outlineColor: spec.outlineColor,
        fillColor: spec.fillColor,
        width: spec.size,
        height: spec.size,
        speed: 0.075,
        lifetime: Random.nextGaussian(500, 250),
        direction: Random.nextDirectionRelativeToCenter(
          particleX,
          particleY,
          spec.center.x,
          spec.center.y
        ),
        alive: 0,
        rotation: 0,
      });

      width++
      if (width > widthSpec) {
        width = 0;
        height++;
      }
    }
  }

  function update(elapsedTime) {
    for (let i = particles.length-1; i >= 0; i--) {
      let particle = particles[i];
      particle.alive += elapsedTime;

      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;

      particle.rotation += particle.speed;
      particle.rotation = particle.rotation % (Math.PI * 2);

      if (particle.alive > particle.lifetime) {
        particles.splice(i, 1);
      }
    }

    if (particles.length===0) {
      return true;
    }
    return false;
  }

  let api = {
    create: create,
    update: update,
    particles: () => particles,
  };

  return api;
};
