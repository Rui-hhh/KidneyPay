let config = {
    type: Phaser.CANVAS,
    pixelArt: true,
    width: 660, 
    height: 480,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            //debug: true,
        }
    },
    scene: [Test]
};

const game = new Phaser.Game(config);

const centerX = game.config.width / 2;
const centerY = game.config.height / 2;
let keyE;
let cursors = null;
let player = null;
let jumpMan = null;
let temp = null;