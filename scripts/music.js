MyGame.music = (function(){
    'use strict';

 function initialize() {

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        sound.loop = true;
        return sound;
    }

    function loadAudio() {
        MyGame.sounds = {}
        MyGame.sounds['menu'] = loadSound('assets/midnight-groove.mp3');
        MyGame.sounds['game'] = loadSound('assets/password-infinity.mp3');
        MyGame.sounds['menu'].autoplay = true;
    }

    loadAudio();
}

initialize()
//------------------------------------------------------------------
//
// Pauses the specified audio
//
//------------------------------------------------------------------
function pauseSound(whichSound) {
    MyGame.sounds[whichSound].pause();
    MyGame.sounds[whichSound].currentTime = 0;
}

//------------------------------------------------------------------
//
// Plays the specified audio
//
//------------------------------------------------------------------
function playSound(whichSound) {

    MyGame.sounds[whichSound].play();
}

//------------------------------------------------------------------
//
// Allow the music volume to be changed
//
//------------------------------------------------------------------
return{
    playSound: playSound,
    pauseSound: pauseSound,
}
}());
