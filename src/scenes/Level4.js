class Level4 extends Phaser.Scene {
    constructor() {
        super('Scene4');

        this.ACCELERATION = 500;
        this.MAX_X_VEL = 150;
        this.MAX_Y_VEL = 2000;
        this.DRAG = 600;
        this.JUMP_VELOCITY = -500;
        this.pickedUp1 = false;
        this.pickedUp2 = false;
        this.buildBridge = false;
        this.ropeGrabbed = false;
        this.sawsDestroyed = false;
        this.boxDropped = false;
    }
    

    preload() {
        //load in all image assets
        this.load.spritesheet('JumpMan', './assets/JumperSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Doll', './assets/playerSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('tile_set', './assets/tile_set.png');
        this.load.spritesheet('muscleMan', './assets/MuscleSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('athleteMan', './assets/climberSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('moveable_box', './assets/moveableBox.png');
        this.load.spritesheet('lever', './assets/controllerSheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('trap', './assets/trapSheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5})
        this.load.image('drop-bridge', './assets/bridge.png');
        this.load.image('elevator', './assets/elevator.png');
        this.load.image('drop_box', './assets/dropBox.png');
        this.load.image('fragment', './assets/fragment.png');
        this.load.image('fragment_doll', './assets/fragmentDoll.png');
        this.load.image('gate', './assets/gate.png');
        this.load.image('kidney', './assets/kidney.png');

        //load all sound assets
        this.load.audio('sfx_possess', './assets/possess.wav');
        this.load.audio('sfx_jump', './assets/Jump.wav');
        this.load.audio('sfx_jump_higher', './assets/JumpHigher.wav');
        this.load.audio('sfx_NextLevel', './assets/NextLevel.wav');
        this.load.audio('sfx_pull', './assets/switchLever.wav');
        this.load.audio('sfx_destroy', './assets/sawDestroy.wav');
        this.load.audio('sfx_box_land', './assets/boxFall.wav');
        this.load.audio('sfx_climb', './assets/ropeClimb.wav');
        this.load.audio('bgmMusic', './assets/backgroundmusic.wav');

        ///load tile map related assets
        this.load.tilemapTiledJSON('level4Map', './assets/Level4.json');
        this.load.spritesheet("level4_sheet", './assets/tile_set.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // tilemap settings
        const map = this.add.tilemap('level4Map');

        let bottomHeight = map.heightInPixels;
        console.log(bottomHeight);

        const tileset = map.addTilesetImage('tile_set', 'level4_sheet');

        const backgroundLayer = map.createStaticLayer('BG', tileset, 0, 0);
        this.groundLayer = map.createStaticLayer('ground', tileset, 0, 0);
        this.groundLayer.setCollisionByProperty({ collides: true});
        
        // add main doll sprite
        const playerSpawn = map.findObject("spawns", obj => obj.name == "player-spawn");
        console.log(playerSpawn);
        player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'Doll');
        player.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        player.setCollideWorldBounds(true);
        player.name = 'doll';
        dollHolder = player;

        playerSpawnX = playerSpawn.x;
        playerSpawnY = playerSpawn.y;
        console.log(player.y);

        this.anims.create({
            key: 'doll-run',
            frames: this.anims.generateFrameNumbers('Doll', {start: 0, end : 2, first: 0}),
            frameRate: 30,
            //repeat: -1
        })


        //add all others spawnable sprites
        this.leverSpawn2 = map.findObject("spawns", obj => obj.name == 'lever2');
        this.lever2 = this.physics.add.sprite(this.leverSpawn2.x, this.leverSpawn2.y, 'lever');
        this.kidneySpawn = map.findObject('spawns', obj => obj.name == 'kidney_spawn');
        
        this.kidney = this.physics.add.sprite(this.kidneySpawn.x, this.kidneySpawn.y, 'kidney');
        this.kidney.body.setAllowGravity(false);



        //elevator specifications in prefab
        const elevatorSpawn = map.findObject('spawns', obj => obj.name == 'elevator-spawn');
        this.elevator = new Elevator(this, elevatorSpawn.x, elevatorSpawn.y, 'elevator', 0, false);



        //initializing lever animation
        this.anims.create({
            key: 'switch',
            frames: this.anims.generateFrameNumbers('lever', {start: 0, end: 8, first: 0}),
            frameRate: 10
        });

        this.physics.world.gravity.y = 2000;
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //set all default colliders
        this.physics.add.collider(player, this.groundLayer);
 
            // when the box is on the ground, it is immovable
        this.physics.add.collider(this.lever2, this.groundLayer);
        this.physics.add.collider(this.lever2, this.elevator);
        this.physics.add.collider(this.elevator, this.groundLayer);
        this.physics.add.collider(player, this.elevator);


        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //keyQ: reenter current level
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //start animation for  every trap in array


        
        this.music = this.sound.add('bgmMusic',{
            mute: false,
            volume: .5,
            rate: 1,
            loop: true
        });

        this.music.play()

        this.explode = this.sound.add('sfx_destroy', {
            mute: false,
            volume: 1,
            rate: 1
        })

        this.jump = this.sound.add('sfx_jump', {
            mute: false,
            volume: .3,
            rate: 1
        })

        this.highJump = this.sound.add('sfx_jump_higher', {
            mute: false,
            volume: .3,
            rate: 1
        })

        this.possess = this.sound.add('sfx_possess', {
            mute: false,
            volume: .3,
            rate: 1
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyQ)){
            this.sawsDestroyed = false;
            this.boxDropped = false;
            this.music.stop();
            this.scene.start('Scene4');
        }
       
        this.elevator.update();
        this.cameras.main.startFollow(player, true, 1, 1);

        // death collision
        if(player.y > 1220){
            console.log("death");
            player.x = playerSpawnX; 
            player.y = playerSpawnY;
        }
        if(this.physics.world.overlap(player, this.trap)){
            this.dollExplode();
        }

        // Setting of movement logic based on which sprite the player is using
        if(cursors.left.isDown) {

                player.body.setAccelerationX(-this.ACCELERATION);
                if (player.name == 'doll') {
                    player.anims.play('doll-run',true);
                }    
        } else if (cursors.right.isDown) {

                player.body.setAccelerationX(this.ACCELERATION);
                if (player.name == 'doll') {
                    player.anims.play('doll-run', true);
                
            }
        } else {
            player.body.setAccelerationX(0);
            
                player.body.setDragX(this.DRAG);
                if (player.name == 'doll') {
                    player.anims.play('doll-run', false);
                      
                }
        }
 
        //jumping when on top of tile map
        if (player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {

                this.jump.play();
                player.body.setVelocityY(this.JUMP_VELOCITY);
           
        } else if (this.ropeGrabbed == true) {
            //if the rope is grabbed it is held
           if (cursors.up.isDown) {
                player.setVelocityY(-100);
            } else if (cursors.down.isDown) {
                player.setVelocityY(100);
            } else {
                player.setVelocityY(0);
            }
        } 

        //jumping when on top of sprites
        if (player.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            
                player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jump.play();
            
        } else if (this.ropeGrabbed == true) {
            //if the rope is grabbed it is held
            if (cursors.up.isDown) {
                player.setVelocityY(-100);
             } else if (cursors.down.isDown) {
                player.setVelocityY(100);
             } else {
                 player.setVelocityY(0);
             }
         } 
         //movement logic end

        // lever interactions

        if (this.physics.world.overlap(player, this.lever2) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.callElevator();
        }

        //when elevator is at the top, it will no longer be active
        if (this.elevator.y <= 412 ){
            this.elevator.activate = false;
        }
        
            // logic for switching to specific bodies

        if (player.name != 'doll') {
            //logic for switching back to original doll
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.possess.play();
                temp = player;
                player = dollHolder;
                dollHolder = temp; 
                dollHolder.setAccelerationX(0);
            }
        }

        


        //If the player is athlete man and is over a rope gravity will become 0
        //and the ropeGrabbed logic will activate in the movement logic area.
        //When he is no longer holding gravity and movement logic will return
        if (!this.physics.world.overlap(player, this.ropeGroup)) {
            this.ropeGrabbed = false;
            this.physics.world.gravity.y = 2000;   
        }
        //next level detection
        if(this.physics.world.overlap(player, this.kidney)){
            this.sound.play('sfx_NextLevel');
            this.music.stop();
            this.scene.start('GameOver');
        }
    }

    

    //plays lever animation, spawns drop bridge below the map
    dropBridge(leverSpawn, groundLayer, bridgeSpawn, player) {
        this.sound.play('sfx_pull');
        this.lever1.anims.play('switch');
        this.bridge = this.physics.add.sprite(bridgeSpawn.x, bridgeSpawn.y, 'drop-bridge');
        this.physics.add.collider(this.bridge, groundLayer);
        this.physics.add.collider(player, this.bridge);
        this.physics.add.collider(dollHolder, this.bridge);
        this.bridge.body.setImmovable();
    }

    //plays lever animation, causes elevatir to move up to specifc location
    callElevator() {
        this.sound.play('sfx_pull');
        this.lever2.anims.play('switch');
        this.elevator.activate = true;
    }

   


    // effect when touch the trap
    dollExplode(){
        this.explode.play();
        // trap hit effect
        let particles = this.add.particles('fragment_doll');
        let dollEmitter = particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            speedX: { min: -50, max: 500 },
            speedY: { min: -75, max: 75 },
            lifespan: 500
        });
        dollEmitter.explode(25, player.x, player.y);
        this.clock = this.time.delayedCall(200, () => {
            player.x = playerSpawnX; 
            player.y = playerSpawnY;
        }, null, this);
        
    }
}