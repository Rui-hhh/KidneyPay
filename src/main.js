// Final Project-Kidney Pay
// 06/07/20
// Hang Rui; Zhifeng Lu; Amir Alaj
// Section A

let config = {
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    width: 320, 
    height: 320,
    scale:{
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
        }
    },
    scene: [  Menu, rule, Level0, Level1, Level2, Level3, Level4, GameOver ],
};

const game = new Phaser.Game(config);
// define some vars
const centerX = game.config.width / 2;
const centerY = game.config.height / 2;
let keyE, keyP, keySPACE, keyR, keyK, keyJ, keyQ, keyM; 
let cursors = null;
let player = null;
let jumpMan = null;
let muscleMan = null;
let athleteMan = null;
let dollHolder = null;
let temp = null;
let box = null;
let pickupDecision = false; // use to decide whether there is box around to pickup
let pickupNum = null; // use to decide which box to pickup
let bottomHeight = null;
let playerSpawnX = null;
let playerSpawnY = null;