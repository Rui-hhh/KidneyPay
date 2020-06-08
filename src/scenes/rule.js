class rule extends Phaser.Scene {
    constructor() {
        super("ruleScene");
    }
    preload(){
        this.load.image('menuBG', './assets/menuBG.png');
        //loading font asset
 //       this.load.bitmapFont('newFont', './assets/fonts/pixel.png', './assets/fonts/pixel.fnt');

    }
    create() {
        this.backround = this.add.tileSprite(0, 0, 320, 320, 'menuBG').setOrigin(0,0);

        //menu display
        let ruleConfig = {
            fontFamily: 'Courier',
            fontSize: '10px',
            backgroundColor: '#21F1FF',
            color: '#000000',
            align: 'right',
            
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }


        let yPosition = 20;
        let textSpacer = 40

        this.add.text(centerX, yPosition, 'up/left/right to move', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (0.5 * textSpacer), 'down to interact with lever', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (1.5 *textSpacer), '(E) to switch character only when', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (2 * textSpacer), ' suit doll overlap with other dolls', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (3 * textSpacer), '(R) to return to suit doll ', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (3.5 * textSpacer), 'after switch', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (4.5 * textSpacer), '(Q) to restart current level', 15).setOrigin(0.5);
        ruleConfig.backgroundColor = "#E3FF25";
        this.add.text(centerX, yPosition + (5.5 * textSpacer), 'Goal: Bring Suit Doll to the exit', 15).setOrigin(0.5);
        this.add.text(centerX, yPosition + (7 * textSpacer), 'Press (M) to return to main menu', 30).setOrigin(0.5);

        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start('menuScene');
        }
    }
}
