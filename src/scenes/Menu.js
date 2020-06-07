class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //loading font asset
        this.load.bitmapFont('newFont', './assets/fonts/pixel.png', './assets/fonts/pixel.fnt');
    }
    
    create() {
        //this.backround = this.add.tileSprite(0, 0, 960, 640, 'background').setOrigin(0,0);

        //menu display
        let menuConfig = {
            fontSize: '28px',
            backgroundColor: '#21F1FF',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        this.cameras.main.setZoom(0.75);
        //adding menu text
        let textSpacer = 80;

        this.add.bitmapText(centerX, centerY - textSpacer, 'newFont', "Prototype", 34).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'newFont', "Arrow keys to move and jump, (E) to switch body when two dolls overlap ", 14).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer, 'newFont', "Doll in black suit can jump higher", 14).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + 2*textSpacer, 'newFont', "Use the (SPACEBAR) to begin the game", 14).setOrigin(0.5);


        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {

        // if (Phaser.Input.Keyboard.JustDown(keyR)) {
        //     this.scene.start('ruleScene');
        // }

        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('Scene1');
        }
    }
}