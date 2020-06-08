class Level1 extends Phaser.Scene {
    constructor() {
        super('Scene1');

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
        this.load.spritesheet('JumpMan', './assets/Jumper-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Doll', './assets/player-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('tile_set', './assets/tile_set.png');
        this.load.spritesheet('muscleMan', './assets/Muscle-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('athleteMan', './assets/climber-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('moveable_box', './assets/moveable-box.png');
        this.load.spritesheet('lever', './assets/controller-sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('trap', './assets/trap-sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5})
        this.load.image('drop-bridge', './assets/bridge.png');
        this.load.image('elevator', './assets/elevator.png');
        this.load.image('drop_box', './assets/drop_box.png');
        this.load.image('fragment', './assets/fragment.png');
        this.load.image('fragment_doll', './assets/fragment_doll.png');
        this.load.image('gate', './assets/gate.png');

        //load all sound assets
        this.load.audio('sfx_possess', './assets/possess.wav');
        this.load.audio('sfx_jump', './assets/Jump.wav');
        this.load.audio('sfx_jump_higher', './assets/JumpHigher.wav');
        this.load.audio('sfx_NextLevel', './assets/NextLevel.wav');
        this.load.audio('sfx_pull', './assets/switch-lever.wav');
        this.load.audio('sfx_destroy', './assets/saw-destroy.wav');
        this.load.audio('sfx_box_land', './assets/box-fall.wav');
        this.load.audio('sfx_climb', './assets/rope-climb.wav');
        this.load.audio('bgmMusic', './assets/backgroundmusic.wav');

        ///load tile map related assets
        this.load.tilemapTiledJSON('level1Map', './assets/Level-1.json');
        this.load.spritesheet("level1_sheet", './assets/tile_set.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // tilemap settings
        const map = this.add.tilemap('level1Map');

        let bottomHeight = map.heightInPixels;
        console.log(bottomHeight);

        const tileset = map.addTilesetImage('tile_set', 'level1_sheet');

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

        //add jumpMan sprite
        const jumpManSpawn = map.findObject("spawns", obj => obj.name == "jump-man-spawn");
        jumpMan = this.physics.add.sprite(jumpManSpawn.x, jumpManSpawn.y, 'JumpMan');
        jumpMan.body.setMaxVelocity(this.MAX_X_VEL + 200, this.MAX_Y_VEL + 200);
        jumpMan.setCollideWorldBounds(true);
        jumpMan.name = 'jumpman';
        this.anims.create({
            key: 'jumper-run',
            frames: this.anims.generateFrameNumbers('JumpMan', {start: 0, end : 3, first: 0}),
            frameRate: 30,
            //repeat: -1
        })
        this.anims.create({
            key: 'jumper-jump',
            frames: this.anims.generateFrameNumbers('JumpMan', {start: 4, end : 18}),
            frameRate: 15,
            //repeat: -1
        })

        //add muscle man sprite
        //const muscleManSpawn = map.findObject("spawns", obj => obj.name == "muscle-man-spawn");
        //muscleMan = this.physics.add.sprite(muscleManSpawn.x, muscleManSpawn.y, 'muscleMan');
        //muscleMan.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        //muscleMan.setCollideWorldBounds(true);
        //muscleMan.name = 'muscleMan';
        //this.anims.create({
        //    key: 'muscle-run',
        //    frames: this.anims.generateFrameNumbers('muscleMan', {start: 0, end : 3, first: 0}),
        //    frameRate: 30,
        //    //repeat: -1
        //})

        //add athletic man sprite
        //const athleteManSpawn = map.findObject("spawns", obj => obj.name == "athletic-man-spawn");
       // athleteMan = this.physics.add.sprite(athleteManSpawn.x, athleteManSpawn.y, 'athleteMan');
       // athleteMan.body.setMaxVelocity(this.MAX_X_VEL + 100, this.MAX_Y_VEL + 100);
       // athleteMan.setCollideWorldBounds(true);
       // athleteMan.name = 'athleteMan';
        //this.anims.create({
       //     key: 'athlete-run',
        //    frames: this.anims.generateFrameNumbers('athleteMan', {start: 0, end : 2, first: 0}),
         //   frameRate: 30,
            //repeat: -1
       // })
       // this.anims.create({
        //    key: 'athlete-jump',
        //    frames: this.anims.generateFrameNumbers('athleteMan', {start: 3, end : 4}),
        //    frameRate: 1,
            //repeat: -1
        //})

        //add all others spawnable sprites
        this.leverSpawn1 = map.findObject("spawns", obj => obj.name == 'lever1');
        this.lever1 = this.physics.add.sprite(this.leverSpawn1.x, this.leverSpawn1.y, 'lever');
        //this.leverSpawn2 = map.findObject("spawns", obj => obj.name == 'lever2');
        //this.lever2 = this.physics.add.sprite(this.leverSpawn2.x, this.leverSpawn2.y, 'lever');
        //this.leverSpawn3 = map.findObject("spawns", obj => obj.name == 'lever3');
        //this.lever3 = this.physics.add.sprite(this.leverSpawn3.x, this.leverSpawn3.y, 'lever');
       //this.leverSpawn4 = map.findObject("spawns", obj => obj.name == 'lever4');
        //this.lever4 = this.physics.add.sprite(this.leverSpawn4.x, this.leverSpawn4.y, 'lever');
        this.bridgeSpawn = map.findObject("spawns", obj => obj.name == 'bridge-spawn');
        //this.dropBoxSpawn = map.findObject('spawns', obj => obj.name == 'drop-box-spawn');
        this.doorSpawn = map.findObject('spawns', obj => obj.name == 'door_spawn');

        this.door = this.physics.add.sprite(this.doorSpawn.x, this.doorSpawn.y, 'gate');
        this.door.body.setAllowGravity(false);

        //const box1Spawn = map.findObject("moveables", obj => obj.name == "moveable-box1");
        //this.box1 = this.physics.add.sprite(box1Spawn.x, box1Spawn.y, 'moveable_box');
        //this.box1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        //this.box1.body.setImmovable();
        //this.box1.setCollideWorldBounds(true);

        //const box2Spawn = map.findObject("moveable", obj => obj.name == "moveable-box2");
        //this.box2 = this.physics.add.sprite(box2Spawn.x, box2Spawn.y, 'moveable_box');
        //this.box2.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        //this.box2.body.setImmovable();
        //this.box2.setCollideWorldBounds(true);

        //elevator specifications in prefab
        //const elevatorSpawn = map.findObject('spawns', obj => obj.name == 'elevator-spawn');
        //this.elevator = new Elevator(this, elevatorSpawn.x, elevatorSpawn.y, 'elevator', 0, false);

        //create all rope options in one sprite group
        //this.rope = map.createFromObjects('grapple', 'rope-spawn', {
         //   key: 'tutorial_sheet',
        //    frame: 46
        //}, this);
        //this.physics.world.enable(this.rope, Phaser.Physics.Arcade.STATIC_BODY);
        //this.ropeGroup = this.add.group(this.rope);

        //create all trap objects in a srpite array
        this.trap = map.createFromObjects('spawns', 'buzz-saw-spawn', {
            key: 'trap',
            //frame: 'trap'
        }, this); 

        this.physics.world.enable(this.trap, Phaser.Physics.Arcade.STATIC_BODY);
        this.trapGroup = this.add.group(this.trap);

        //initializing buzz saw animation
        this.anims.create({
            key: 'buzz',
            frames: this.anims.generateFrameNumbers('trap', {start: 0, end: 4, first: 0}),
            frameRate: 30,
            repeat: -1
        });

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
        this.physics.add.collider(jumpMan, this.groundLayer);
        //this.physics.add.collider(muscleMan, this.groundLayer);
        //this.physics.add.collider(athleteMan, this.groundLayer)
            // when the box is on the ground, it is immovable
        //    this.physics.add.collider(this.box1, this.groundLayer, 
         //       ()=>{this.box1.body.setDragX(200); this.box1.body.setImmovable(true); } );
         //   this.physics.add.collider(this.box2, this.groundLayer, 
         //       ()=>{this.box2.body.setDragX(200); this.box2.body.setImmovable(true); } );
       // this.physics.add.collider(this.box1, this.groundLayer);
       // this.physics.add.collider(this.box2, this.groundLayer);
        this.physics.add.collider(this.lever1, this.groundLayer);
        //this.physics.add.collider(this.lever2, this.groundLayer);
       // this.physics.add.collider(this.lever3, this.groundLayer);
       // this.physics.add.collider(this.lever4, this.groundLayer);
        //this.physics.add.collider(this.elevator, this.groundLayer);
       // this.physics.add.collider(player, this.box1);
       // this.physics.add.collider(player, this.box2);
       // this.physics.add.collider(muscleMan, this.box1);
       // this.physics.add.collider(muscleMan, this.box2);
        //this.physics.add.collider(athleteMan, this.box1);
        //this.physics.add.collider(athleteMan, this.box2);
        //this.physics.add.collider(jumpMan, this.box1);
        //this.physics.add.collider(jumpMan, this.box2);
        //this.physics.add.collider(this.box1, this.box2);
       // this.physics.add.collider(player, this.elevator);
        //this.physics.add.collider(muscleMan, this.elevator);
       // this.physics.add.collider(athleteMan, this.elevator);
       // this.physics.add.collider(jumpMan, this.elevator);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //keyQ: reenter current level
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //start animation for  every trap in array
        var i;
        for (i =0; i < this.trap.length; i++) {
            this.trap[i].anims.play('buzz', true);
        }

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
            this.music.stop();
            this.scene.start('Scene1');
        }
        //this.trap[0].anims.play('buzz', true);
    //    this.elevator.update();
        this.cameras.main.startFollow(player, true, 1, 1);

        // death collision
        if(player.y > 1220){
            console.log("death");
            player.x = playerSpawnX; 
            player.y = playerSpawnY-32;
        }
        if(this.physics.world.overlap(player, this.trap)){
            // player.x = playerSpawnX; 
            // player.y = playerSpawnY;
            this.dollExplode();
        }

        // Setting of movement logic based on which sprite the player is using
        if(cursors.left.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX((-this.ACCELERATION) - 200);
                if (player.body.onFloor()){
                    player.anims.play('jumper-run', true);
                }
            } else if (player.name == 'athleteMan') {
                player.body.setAccelerationX((-this.ACCELERATION) - 50);
                player.anims.play('athlete-run', true);
            } else {
                player.body.setAccelerationX(-this.ACCELERATION);
                if (player.name == 'doll') {
                    player.anims.play('doll-run',true);
                } else if (player.name == 'muscleMan') {
                    player.anims.play('muscle-run', true);
                }
                //if (this.pickedUp1 == true) {
                //    this.box1.body.setAccelerationX(-this.ACCELERATION);
                //} else if (this.pickedUp2 == true) {
                //    this.box2.body.setAccelerationX(-this.ACCELERATION);
                //}
            }    
        } else if (cursors.right.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX(this.ACCELERATION + 200);
                if (player.body.onFloor()){
                    player.anims.play('jumper-run', true);
                }
            } else if (player.name == 'athleteMan') {
                player.body.setAccelerationX(this.ACCELERATION + 50);
                player.anims.play('athlete-run', true);
            } else {
                player.body.setAccelerationX(this.ACCELERATION);
                if (player.name == 'doll') {
                    player.anims.play('doll-run', true);
                } else if (player.name == 'muscleMan') {
                    player.anims.play('muscle-run', true);
                }
                //if (this.pickedUp1 == true) {
                //    this.box1.body.setAccelerationX(this.ACCELERATION);
                //}  else if (this.pickedUp2 == true) {
                //   this.box2.body.setAccelerationX(this.ACCELERATION);
                //}
            }
        } else {
            player.body.setAccelerationX(0);
            if (player.name == 'jumpman') {
                player.body.setDragX(this.DRAG + 250);
                //player.anims.play('jumper-run', false);
            } else if (player.name == 'athleteMan') {
                player.body.setDragX(this.DRAG + 100);
                player.anims.play('athlete-run', false);
            } else {
                player.body.setDragX(this.DRAG);
                if (player.name == 'doll') {
                    player.anims.play('doll-run', false);
                } else if (player.name == 'muscleMan') {
                    player.anims.play('muscle-run', false);
                }            
            }
            //if (this.pickedUp1 == true) {
            //    this.box1.body.setAccelerationX(0);
            //    this.box1.body.setDragX(this.DRAG);
            //} else if (this.pickedUp2 ==  true) {
            //    this.box2.body.setAccelerationX(0);
            //    this.box2.body.setDragX(this.DRAG);
            //}
        }
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            jumpMan.anims.play('jumper-jump', true);
        }
        //jumping when on top of tile map
        if (player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (player.name == 'jumpman') {
                this.highJump.play()
                player.body.setVelocityY(this.JUMP_VELOCITY - 250);
                player.anims.play('jumper-jump', true);
            //} else if (player.name == 'athleteMan') {
            //    this.jump.play();
            //    player.body.setVelocityY(this.JUMP_VELOCITY - 100);
            //    player.anims.play('athlete-jump');
            } else {
                this.jump.play();
                player.body.setVelocityY(this.JUMP_VELOCITY);
            }
            //if (this.pickedUp1 == true) {
            //    this.box1.body.setVelocityY(this.JUMP_VELOCITY);
            //} else if (this.pickedUp2 == true) {
            //    this.box2.body.setVelocityY(this.JUMP_VELOCITY);
            //}
        //} else if (this.ropeGrabbed == true) {
            //if the rope is grabbed it is held
        //   if (cursors.up.isDown) {
        //        player.setVelocityY(-100);
        //    } else if (cursors.down.isDown) {
        //        player.setVelocityY(100);
         //   } else {
        //        player.setVelocityY(0);
         //   }
        } 

        //jumping when on top of sprites
        if (player.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (player.name == 'jumpman') {
                this.highJump.play()
                player.body.setVelocityY(this.JUMP_VELOCITY - 250);
                player.anims.play('jumper-jump', true);
            //} else if (player.name == 'athleteMan') {
             //   player.body.setVelocityY(this.JUMP_VELOCITY - 100);
            //    this.jump.play();
             //   player.anims.play('athlete-jump');
            } else {
                player.body.setVelocityY(this.JUMP_VELOCITY);
                this.jump.play();
            }
            //if (this.pickedUp1 == true) {
            //   this.box1.body.setVelocityY(this.JUMP_VELOCITY);
            //} else if (this.pickedUp2 == true) {
            //   this.box2.body.setVelocityY(this.JUMP_VELOCITY);
            //}
        //} else if (this.ropeGrabbed == true) {
            //if the rope is grabbed it is held
        //    if (cursors.up.isDown) {
        //        player.setVelocityY(-100);
        //     } else if (cursors.down.isDown) {
        //        player.setVelocityY(100);
        //     } else {
        //         player.setVelocityY(0);
         //    }
         } 
         //movement logic end

        // lever interactions
        if (this.physics.world.overlap(player, this.lever1) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.dropBridge(this.leverSpawn1, this.groundLayer,this.bridgeSpawn, player, dollHolder);
        }
        //if (this.physics.world.overlap(player, this.lever2) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
        //    this.callElevator();
        //}
        //if (this.physics.world.overlap(player, this.lever3) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
        //   this.dropBox();
        //}
        if (this.physics.world.overlap(player, this.lever4) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.destroyTraps();
        }

        //when elevator is at the top, it will no longer be active
        //if (this.elevator.y <= 628) {
        //    this.elevator.activate = false;
        //}
        
        if (player.name == 'doll') {
            // logic for switching to specific bodies
            if (this.physics.world.overlap(player, jumpMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.possess.play();
                dollHolder = player;
                player = jumpMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
            }

            if (this.physics.world.overlap(player, muscleMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.possess.play();
                dollHolder = player;
                player = muscleMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
                dollHolder.anims.play('doll-run', false);
            }

            if (this.physics.world.overlap(player, athleteMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.possess.play();
                dollHolder = player;
                player = athleteMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
            }
        } else  if (player.name != 'doll') {
            //logic for switching back to original doll
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.possess.play();
                temp = player;
                player = dollHolder;
                dollHolder = temp; 
                dollHolder.setAccelerationX(0);
            }
        }

        //If the player is muscle man, colliding with a boxm and P is pushed pickedUp
        //will become true for specific box and movement logic will activate in the
        //movement logic area


        //If the player is athlete man and is over a rope gravity will become 0
        //and the ropeGrabbed logic will activate in the movement logic area.
        //When he is no longer holding gravity and movement logic will return
     if (!this.physics.world.overlap(player, this.ropeGroup)) {
            this.ropeGrabbed = false;
            this.physics.world.gravity.y = 2000;   
        }
        //next level detection
        if(this.physics.world.overlap(player, this.door) && (player.name == 'doll')){
            this.sound.play('sfx_NextLevel');
            this.music.stop();
            this.scene.start('Scene2');
        }
    }

    // detection function for muscleman to pickup box


    //plays lever animation, spawns drop bridge below the map
    dropBridge(leverSpawn, groundLayer, bridgeSpawn, player) {
        this.sound.play('sfx_pull');
        this.lever1.anims.play('switch');
        this.bridge = this.physics.add.sprite(bridgeSpawn.x, bridgeSpawn.y, 'drop-bridge');
        this.physics.add.collider(this.bridge, groundLayer);
        this.physics.add.collider(player, this.bridge);
        this.physics.add.collider(dollHolder, this.bridge);
 
        this.physics.add.collider(jumpMan, this.bridge);

        this.bridge.body.setImmovable();
    }

    //plays lever animation, causes elevatir to move up to specifc location


    //plays lever animation, causes box to be dropped from ceiling so area is reachable


    destroyTraps() {
        this.sound.play('sfx_pull');
        this.lever4.anims.play('switch');
        let particles = this.add.particles('fragment');
        this.explode.play()
        let sawEmitter = particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            speedX: { min: -50, max: 500 },
            speedY: { min: -75, max: 75 },
            lifespan: 500
        });
        if (this.sawsDestroyed == false) {
            var i;
            for (i = 0; i < this.trap.length; i++) {
                sawEmitter.explode(25, this.trap[i].x, this.trap[i].y);
                this.trap[i].destroy()
            }
        }
        this.sawsDestroyed = true;
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