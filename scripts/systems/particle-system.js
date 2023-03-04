//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystem = function (spec) {
  "use strict";
  let nextName = 1; // Unique identifier for the next particle
  let particles = {};

  //------------------------------------------------------------------
  //
  // This creates one new particle
  //
  //------------------------------------------------------------------

  // center: { x: block.center.x, y: block.center.y },
  //     size: 2,
  //     speed: 0.5,
  //     lifetime: 0.5,
  //     direction: Random.nextCircleVector(),

  function create() {
    let particleX = 0;
    let particleY = 0;
    for (let i = 0; i < spec.height / spec.size; i++) {
      for (let j = 0; j < spec.width / spec.size; j++) {
        particleX = spec.center.x - spec.width / 2 + j * spec.size
        particleY = spec.center.y - spec.height / 2 + i * spec.size
        particles[nextName++] = {
          center: {
            x: particleX,
            y: particleY,
          },
          outlineColor: spec.outlineColor,
          fillColor: spec.fillColor,
          width: spec.size,
          height: spec.size,
          speed: .075,
          lifetime: Random.nextGaussian(500, 250),
          direction: Random.nextDirectionRelativeToCenter(particleX, particleY, spec.center.x, spec.center.y),
          alive: 0,
          rotation: 0,
        };
      }
    }
    // let p = {
    //         center: {x: spec.center.x, y: spec.center.y},
    //         size: { x: spec.size.x, y: spec.size.y },
    //         direction: Random.nextCircleVector(),
    //         speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
    //         rotation: 0,
    //         lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
    //         alive: 0    // How long the particle has been alive, in seconds
    //     };

    // return p;
  }

  //------------------------------------------------------------------
  //
  // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
    let done = false;
    let removeMe = [];

    //
    // We work with time in seconds, elapsedTime comes in as milliseconds

    Object.getOwnPropertyNames(particles).forEach(function (
      value,
      index,
      array
    ) {
      let particle = particles[value];
      //
      // Update how long it has been alive
      particle.alive += elapsedTime;

      //
      // Update its center
      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;

      //
      // Rotate proportional to its speed
      particle.rotation += particle.speed / 500;

      //
      // If the lifetime has expired, identify it for removal
      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });

    //
    // Remove all of the expired particles
    for (let particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;

    // //
    // // Generate some new particles
    // for (let particle = 0; particle < 1; particle++) {
    //     //
    //     // Assign a unique name to each particle
    //     particles[nextName++] = create();
    // }
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
