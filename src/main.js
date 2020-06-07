// Main mechanics done
// Hang Rui; Zhifeng Lu; Amir Alaj
// Section A

let config = {
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    width: 320, 
    height: 320,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
        }
    },
    scene: [  Menu, Tutorial ],
};

const game = new Phaser.Game(config);
// define some vars
const centerX = game.config.width / 2;
const centerY = game.config.height / 2;
let keyE, keyP, keySPACE, keyR;
let cursors = null;
let player = null;
let jumpMan = null;
let muscleMan = null;
let athleteMan = null;
let dollHolder = null;
let temp = null;
let door = null;
let box = null;
