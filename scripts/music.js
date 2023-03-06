MyGame.music = (function () {
  "use strict";

  function initialize() {
    function loadSound(source) {
      let sound = new Audio();
      sound.src = source;
      sound.loop = true;
      return sound;
    }

    function loadAudio() {
      MyGame.sounds = {};
      MyGame.sounds["menu"] = loadSound("assets/midnight-groove.mp3");
      MyGame.sounds["game"] = loadSound("assets/password-infinity.mp3");
      MyGame.sounds["menu"].autoplay = true;
    }

    loadAudio();
  }

  initialize();

  function pauseSound(whichSound) {
    MyGame.sounds[whichSound].pause();
    MyGame.sounds[whichSound].currentTime = 0;
  }

  function playSound(whichSound) {
    MyGame.sounds[whichSound].play();
  }

  return {
    playSound: playSound,
    pauseSound: pauseSound,
  };
})();
