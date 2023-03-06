MyGame.systems.ParticleSystem = function (spec) {
  "use strict";
  let nextName = 1;
  let particles = {};

  function create() {
    let particleX = 0;
    let particleY = 0;
    for (let i = 0; i < spec.height / spec.size; i++) {
      for (let j = 0; j < spec.width / spec.size; j++) {
        particleX = spec.center.x - spec.width / 2 + j * spec.size;
        particleY = spec.center.y - spec.height / 2 + i * spec.size;
        particles[nextName++] = {
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
        };
      }
    }
  }

  function update(elapsedTime) {
    let done = false;
    let removeMe = [];

    Object.getOwnPropertyNames(particles).forEach(function (
      value,
      index,
      array
    ) {
      let particle = particles[value];

      particle.alive += elapsedTime;

      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;

      particle.rotation += particle.speed;
      particle.rotation = particle.rotation % (Math.PI * 2);

      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });

    for (let particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;

    if (Object.getOwnPropertyNames(particles).length == 0) {
      done = true;
    }
    return done;
  }

  let api = {
    create: create,
    update: update,
    particles: () => particles,
  };

  return api;
};
