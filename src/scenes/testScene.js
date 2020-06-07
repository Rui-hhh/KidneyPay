class Test extends Phaser.Scene {
    constructor() {
        super('testScene');

        this.ACCELERATION = 500;
        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;
        this.DRAG = 600;
        this.MAX_JUMP_VELOCITY = -650;
    }

    preload() {
        this.load.image('Doll', './assets/Doll.png');
        this.load.image('JumpMan', './assets/JumpMan.png');
        //this.load.image('BG', './assets/Background.png');
        this.load.image('BG', './assets/gradientBG.png');

        this.load.audio('sfx_possess', './assets/possess.wav');
    }

    create() {
        //temporary BG
        this.add.image(0, 0, 'BG').setOrigin(0);

        player = this.physics.add.sprite(centerX, centerY, 'Doll');
        player.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        player.setCollideWorldBounds(true);
        player.name = 'doll';

        jumpMan = this.physics.add.sprite(centerX + 50, centerY, 'JumpMan');
        jumpMan.body.setMaxVelocity(this.MAX_X_VEL + 200, this.MAX_Y_VEL);
        jumpMan.setCollideWorldBounds(true);
        jumpMan.name = 'jumpman';

        // configure main camera
        this.cameras.main.setBounds(0, 0, 3000, 3000);
        //this.cameras.main.setBounds(0, 0, 960, 640);
        //this.cameras.main.setZoom(1.25);
        this.cameras.main.startFollow(player, true, 0.1, 0.1);
        // set camera dead zone
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setName("center");

        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        cursors = this.input.keyboard.createCursorKeys();

        console.log(player);

    }

    update() {
        if(cursors.left.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX(-(this.ACCELERATION) - 500)
            } else {
                player.body.setAccelerationX(-this.ACCELERATION);
            }
        } else if (cursors.right.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX(this.ACCELERATION + 500)
            } else {
                player.body.setAccelerationX(this.ACCELERATION);
            }
        } else {
            player.body.setAccelerationX(0);
            player.body.setDragX(this.DRAG);
        }

        if (this.physics.world.overlap(player, jumpMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
            this.sound.play('sfx_possess');
            temp = player;
            player = jumpMan;
            jumpMan = temp;
            jumpMan.body.setAccelerationX(0);
            //jumpMan.body.setDragX(this.DRAG);
        }
    }
}

