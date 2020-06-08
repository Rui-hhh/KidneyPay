class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    preload(){
        this.load.image('menuBG', './assets/menuBG.png');
        //loading font asset
        //this.load.bitmapFont('newFont', './assets/fonts/pixel.png', './assets/fonts/pixel.fnt');

 
    }
    
    create() {
        this.backround = this.add.tileSprite(0, 0, 320, 320, 'menuBG').setOrigin(0,0);

        //menu display
        let menuConfig = {
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

        this.cameras.main.setZoom(1);
        //adding menu text
        let textSpacer = 20;

        this.add.text(centerX, centerY - 2*textSpacer, "Thankyou for playing", 10).setOrigin(0.5);
        this.add.text(centerX, centerY , "Use the (SPACEBAR) ", 10).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, "to return to the menu",10).setOrigin(0.5);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {

       if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
           this.scene.start('menuScene');
       }
   }
}