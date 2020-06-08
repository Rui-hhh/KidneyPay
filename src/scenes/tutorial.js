class Tutorial extends Phaser.Scene {
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
    }

    preload() {
        //load in all image assets
        this.load.image('Doll', './assets/Doll.png');
        this.load.image('JumpMan', './assets/JumpMan.png');
        this.load.image('tutorial_set', './assets/tile_set.png');
        this.load.image('muscleMan', './assets/muscleman.png');
        this.load.image('athleteMan', './assets/athlete.png');
        this.load.image('moveable_box', './assets/moveable-box.png');
        this.load.spritesheet('lever', './assets/controller-sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('trap', './assets/trap-sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5})
        this.load.image('drop-bridge', './assets/bridge.png');
        this.load.image('elevator', './assets/elevator.png');
        this.load.image('drop_box', './assets/drop_box.png');

        //load all sound assets
        this.load.audio('sfx_possess', './assets/possess.wav');
        this.load.audio('sfx_jump', './assets/Jump.wav');
        this.load.audio('sfx_jump_higher', './assets/JumpHigher.wav');
        this.load.audio('sfx_NextLevel', './assets/NextLevel.wav');

        ///load tile map related assets
        this.load.tilemapTiledJSON('tutorialMap', './assets/tile_map.json');
        this.load.spritesheet("tutorial_sheet", './assets/tile_set.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // tilemap settings
        const map = this.add.tilemap('tutorialMap');

        let bottomHeight = map.heightInPixels;
        console.log(bottomHeight);

        const tileset = map.addTilesetImage('tile_set', 'tutorial_set');

        const backgroundLayer = map.createStaticLayer('BG', tileset, 0, 0);
        this.groundLayer = map.createStaticLayer('ground', tileset, 0, 0);
        this.groundLayer.setCollisionByProperty({ collides: true});
        
        // add main doll sprite
        const playerSpawn = map.findObject("spawns", obj => obj.name == "player-spawn");
        player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'Doll');
        player.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        player.setCollideWorldBounds(true);
        player.name = 'doll';
        dollHolder = player;

        playerSpawnX = playerSpawn.x;
        playerSpawnY = playerSpawn.y;
        console.log(player.y);


        //add jumpMan sprite
        const jumpManSpawn = map.findObject("spawns", obj => obj.name == "jump-man-spawn");
        jumpMan = this.physics.add.sprite(jumpManSpawn.x, jumpManSpawn.y, 'JumpMan');
        jumpMan.body.setMaxVelocity(this.MAX_X_VEL + 200, this.MAX_Y_VEL + 200);
        jumpMan.setCollideWorldBounds(true);
        jumpMan.name = 'jumpman';

        //add muscle man sprite
        const muscleManSpawn = map.findObject("spawns", obj => obj.name == "muscle-man-spawn");
        muscleMan = this.physics.add.sprite(muscleManSpawn.x, muscleManSpawn.y, 'muscleMan');
        muscleMan.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        muscleMan.setCollideWorldBounds(true);
        muscleMan.name = 'muscleMan';

        //add athletic man sprite
        const athleteManSpawn = map.findObject("spawns", obj => obj.name == "athletic-man-spawn");
        athleteMan = this.physics.add.sprite(athleteManSpawn.x, athleteManSpawn.y, 'athleteMan');
        athleteMan.body.setMaxVelocity(this.MAX_X_VEL + 100, this.MAX_Y_VEL + 100);
        athleteMan.setCollideWorldBounds(true);
        athleteMan.name = 'athleteMan';

        //add all others spawnable sprites
        this.leverSpawn1 = map.findObject("spawns", obj => obj.name == 'lever1');
        this.lever1 = this.physics.add.sprite(this.leverSpawn1.x, this.leverSpawn1.y, 'lever');
        this.leverSpawn2 = map.findObject("spawns", obj => obj.name == 'lever2');
        this.lever2 = this.physics.add.sprite(this.leverSpawn2.x, this.leverSpawn2.y, 'lever');
        this.leverSpawn3 = map.findObject("spawns", obj => obj.name == 'lever3');
        this.lever3 = this.physics.add.sprite(this.leverSpawn3.x, this.leverSpawn3.y, 'lever');
        this.bridgeSpawn = map.findObject("spawns", obj => obj.name == 'bridge-spawn');
        this.dropBoxSpawn = map.findObject('spawns', obj => obj.name == 'drop-box-spawn');

        const box1Spawn = map.findObject("moveables", obj => obj.name == "moveable-box1");
        this.box1 = this.physics.add.sprite(box1Spawn.x, box1Spawn.y, 'moveable_box');
        this.box1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.box1.body.setImmovable();
        this.box1.setCollideWorldBounds(true);

        const box2Spawn = map.findObject("moveable", obj => obj.name == "moveable-box2");
        this.box2 = this.physics.add.sprite(box2Spawn.x, box2Spawn.y, 'moveable_box');
        this.box2.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.box2.body.setImmovable();
        this.box2.setCollideWorldBounds(true);

        //elevator specifications in prefab
        const elevatorSpawn = map.findObject('spawns', obj => obj.name == 'elevator-spawn');
        this.elevator = new Elevator(this, elevatorSpawn.x, elevatorSpawn.y, 'elevator', 0, false);

        //create all rope options in one sprite group
        this.rope = map.createFromObjects('grapple', 'rope-spawn', {
            key: 'tutorial_sheet',
            frame: 40
        }, this);
        this.physics.world.enable(this.rope, Phaser.Physics.Arcade.STATIC_BODY);
        this.ropeGroup = this.add.group(this.rope);

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
            frames: this.anims.generateFrameNumbers('lever', {start: 0, end: 9, first: 0}),
            frameRate: 10
        });

        this.physics.world.gravity.y = 2000;
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        //set all default colliders
        this.physics.add.collider(player, this.groundLayer);
        this.physics.add.collider(jumpMan, this.groundLayer);
        this.physics.add.collider(muscleMan, this.groundLayer);
        this.physics.add.collider(athleteMan, this.groundLayer)
        // when the box is on the ground, it is immovable
        this.physics.add.collider(this.box1, this.groundLayer, 
            ()=>{this.box1.body.setDragX(200); this.box1.body.setImmovable(true); } );
        this.physics.add.collider(this.box2, this.groundLayer, 
            ()=>{this.box2.body.setDragX(200); this.box2.body.setImmovable(true); } );
        this.physics.add.collider(this.lever1, this.groundLayer);
        this.physics.add.collider(this.lever2, this.groundLayer);
        this.physics.add.collider(this.lever3, this.groundLayer);
        this.physics.add.collider(this.elevator, this.groundLayer);
        this.physics.add.collider(player, this.box1);
        this.physics.add.collider(player, this.box2);
        this.physics.add.collider(muscleMan, this.box1);
        this.physics.add.collider(muscleMan, this.box2);
        this.physics.add.collider(this.box1, this.box2);
        this.physics.add.collider(player, this.elevator);
        this.physics.add.collider(athleteMan, this.elevator);
        this.physics.add.collider(jumpMan, this.elevator);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //start animation for  every trap in array
        var i;
        for (i =0; i < this.trap.length; i++) {
            this.trap[i].anims.play('buzz', true);
        }

    }

    update() {
        //this.trap[0].anims.play('buzz', true);
        this.elevator.update();
        this.cameras.main.startFollow(player, true, 0.25, 0.25);

        
        // death collision
        if(player.y > 1220){
            console.log("death");
            player.x = playerSpawnX; 
            player.y = playerSpawnY;
            player.anims.play('buzz', true);
        }

        // Setting of movement logic based on which sprite the player is using
        if(cursors.left.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX((-this.ACCELERATION) - 200);
            } else if (player.name == 'athleteMan') {
                player.body.setAccelerationX((-this.ACCELERATION) - 50);
            } else {
                player.body.setAccelerationX(-this.ACCELERATION);
                // if (this.pickedUp1 == true) {
                //     //this.box1.body.setAccelerationX(-this.ACCELERATION);
                //     this.box1.x = player.x;
                //     this.box1.y = player.y - 32;
                // } else if (this.pickedUp2 == true) {
                //     this.box2.body.setAccelerationX(-this.ACCELERATION);
                // }
            }    
        } else if (cursors.right.isDown) {
            if (player.name == 'jumpman') {
                player.body.setAccelerationX(this.ACCELERATION + 200);
            } else if (player.name == 'athleteMan') {
                player.body.setAccelerationX(this.ACCELERATION + 50);
            } else {
                player.body.setAccelerationX(this.ACCELERATION);
                // let box synchronous with player
                // if (this.pickedUp1 == true) {
                //     //this.box1.body.setAccelerationX(this.ACCELERATION);
                //     this.box1.x = player.x;
                //     this.box1.y = player.y - 32;
                // }  else if (this.pickedUp2 == true) {
                //     this.box2.body.setAccelerationX(this.ACCELERATION);
                // }
            }
        } else { // when pressing up
            player.body.setAccelerationX(0);
            if (player.name == 'jumpman') {
                player.body.setDragX(this.DRAG + 250);
            } else if (player.name == 'athleteMan') {
                player.body.setDragX(this.DRAG + 100);
            } else {
                player.body.setDragX(this.DRAG);
            }
            // if (this.pickedUp1 == true) {
            //     //this.box1.body.setAccelerationX(0);
            //     //this.box1.body.setDragX(this.DRAG);
            //     this.box1.y = player.y - 32;
            // } else if (this.pickedUp2 ==  true) {
            //     this.box2.body.setAccelerationX(0);
            //     this.box2.body.setDragX(this.DRAG);
            // }
        }

        //jumping when on top of tile map
        if (player.body.blocked.down && cursors.up.isDown) {
            if (player.name == 'jumpman') {

                player.body.setVelocityY(this.JUMP_VELOCITY - 250);
            } else if (player.name == 'athleteMan') {
                this.sound.play('sfx_jump');
                player.body.setVelocityY(this.JUMP_VELOCITY - 100);
            } else {
                this.sound.play('sfx_jump');
                player.body.setVelocityY(this.JUMP_VELOCITY);
            }
            // if (this.pickedUp1 == true) {
            //     this.box1.body.setVelocityY(this.JUMP_VELOCITY);
            // } else if (this.pickedUp2 == true) {
            //     this.box2.body.setVelocityY(this.JUMP_VELOCITY);
            // }
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
        if (player.body.touching.down && cursors.up.isDown) {
            if (player.name == 'jumpman') {
                player.body.setVelocityY(this.JUMP_VELOCITY - 250);
            } else if (player.name == 'athleteMan') {
                player.body.setVelocityY(this.JUMP_VELOCITY - 100);
                this.sound.play('sfx_jump');
            } else {
                player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play('sfx_jump');
            }
            // if (this.pickedUp1 == true) {
            //     this.box1.body.setVelocityY(this.JUMP_VELOCITY);
            // } else if (this.pickedUp2 == true) {
            //     this.box2.body.setVelocityY(this.JUMP_VELOCITY);
            // }
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
        if (this.physics.world.overlap(player, this.lever1) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.dropBridge(this.leverSpawn1, this.groundLayer,this.bridgeSpawn, player, dollHolder);
        }
        if (this.physics.world.overlap(player, this.lever2) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.callElevator();
        }
        if (this.physics.world.overlap(player, this.lever3) && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.dropBox();
        }

        //when elevator is at the top, it will no longer be active
        if (this.elevator.y <= 628) {
            this.elevator.activate = false;
        }
        
        if (player.name == 'doll') {
            // logic for switching to specific bodies
            if (this.physics.world.overlap(player, jumpMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.sound.play('sfx_possess');
                dollHolder = player;
                player = jumpMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
            }

            if (this.physics.world.overlap(player, muscleMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.sound.play('sfx_possess');
                dollHolder = player;
                player = muscleMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
            }

            if (this.physics.world.overlap(player, athleteMan) && Phaser.Input.Keyboard.JustDown(keyE)) {
                this.sound.play('sfx_possess');
                dollHolder = player;
                player = athleteMan;
                dollHolder.body.setAccelerationX(0);
                dollHolder.body.setDragX(this.DRAG);
            }
        } else  if (player.name != 'doll') {
            //logic for switching back to original doll
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.sound.play('sfx_possess');
                temp = player;
                player = dollHolder;
                dollHolder = temp; 
                dollHolder.setAccelerationX(0);
            }
        }

        
        //If the player is muscle man, colliding with a boxm and P is pushed pickedUp
        //will become true for specific box and movement logic will activate in the
        //movement logic area
        if(player.name == "muscleMan") {
            // decide if muscleman is around box and have touched once
            this.whetherPickup();
  
            if(pickupDecision && pickupNum == 1){
                // console.log(this.box1.body.x);
                // console.log(player.body.x);
                // console.log(this.box1.body.x-player.body.x);
                //console.log("touching1");
                if (this.pickedUp1 == false && Phaser.Input.Keyboard.JustDown(keyP)) {
                    this.pickedUp1 = true;
                    this.box1.body.setImmovable(false);
                    this.box1.body.setAllowGravity(false);
                    this.box1.x = player.x;
                    this.box1.y = player.y - 32;

                }
                // release the box1
                if (this.pickedUp1 == true && Phaser.Input.Keyboard.JustDown(keyP)) {
                    console.log("release box1");        
                    this.pickedUp1 = false;
                    this.box1.body.setAllowGravity(true);
                    this.box1.body.setVelocityX(130);
                    this.box1.body.setVelocityY(-400);
                }
            }

            if(pickupDecision && pickupNum == 2){
                //console.log("touching2");
                if (this.pickedUp2 == false && Phaser.Input.Keyboard.JustDown(keyP)) {
                    this.pickedUp2 = true;
                    this.box2.body.setImmovable(false);
                    this.box2.body.setAllowGravity(false);
                    this.box2.x = player.x;
                    this.box2.y = player.y - 32;
                }
                //release the box2
                if (this.pickedUp2 == true && Phaser.Input.Keyboard.JustDown(keyP)) {
                    this.pickedUp2 = false;
                    this.box2.body.setAllowGravity(true);
                    this.box2.body.setVelocityX(130);
                    this.box2.body.setVelocityY(-400);
                }
            }

            // when picked up, update the box position so that it keeps over muscleman's head
            if(this.pickedUp1){
                this.box1.x = player.x;
                this.box1.y = player.y - 32;
            }
            if(this.pickedUp2){
                this.box2.x = player.x;
                this.box2.y = player.y - 32;
            }
            
            // this.physics.world.collide(player, this.box1, () => {
            //     if (this.pickedUp1 == false && Phaser.Input.Keyboard.JustDown(keyP)) {
            //         this.pickedUp1 = true;
            //     }
            //     if (this.pickedUp1 == true && Phaser.Input.Keyboard.JustDown(keyP)) {
            //         this.pickedUp1 = false;
            //     }

            // });  
            // this.physics.world.collide(player, this.box2, () => {
            //     if (this.pickedUp2 == false && Phaser.Input.Keyboard.JustDown(keyP)) {
            //         this.pickedUp2 = true;
            //     }
            //     if (this.pickedUp2 == true && Phaser.Input.Keyboard.JustDown(keyP)) {
            //         this.pickedUp2 = false;
            //     }
            // });
        }

        //If the player is athlete man and is over a rope gravity will become 0
        //and the ropeGrabbed logic will activate in the movement logic area.
        //When he is no longer holding gravity and movement logic will return
        if (player.name == 'athleteMan' && this.physics.world.overlap(player, this.ropeGroup)) {
            this.ropeGrabbed = true;
            this.physics.world.gravity.y = 0;   
        } else if (!this.physics.world.overlap(player, this.ropeGroup)) {
            this.ropeGrabbed = false;
            this.physics.world.gravity.y = 2000;   
        }
        
    }

    // detection function for muscleman to pickup box
    whetherPickup(){
        if(Math.abs(this.box1.x - player.x) <= 33){
            //console.log("body1inrange");
            pickupDecision = true;
            pickupNum = 1;
        }
        if(this.box2.body.touching.left | this.box2.body.touching.right | this.box2.body.touching.up){
            //console.log("body2inrange");
            pickupDecision = true;
            pickupNum = 2;
            //console.log(pickupNum);
        }
        //console.log(pickupNum);
        // decide whether player leave away boxs
        if(pickupDecision && pickupNum == 1){
            
            if(this.box1.x - player.x > 33 | player.x - this.box1.x > 33){
                //console.log("seperate1");
                //console.log(pickupNum);
                pickupDecision = false;
                pickupNum = 0;
                
            }
        }
        if(pickupDecision && pickupNum == 2){ 
           
                if(this.box2.x - player.x > 33 | player.x - this.box2.x > 33){
                    //console.log("seperate2");
                    pickupDecision = false;
                    pickupNum = 0;
                }
            
        }
        
        
    }

    //plays lever animation, spawns drop bridge below the map
    dropBridge(leverSpawn, groundLayer, bridgeSpawn, player) {
        this.lever1.anims.play('switch');
        this.clock = this.time.delayedCall(900, () => {
            this.lever1 = this.physics.add.sprite(this.leverSpawn1.x, this.leverSpawn1.y, 'lever');
            this.physics.add.collider(this.lever1, groundLayer);
            this.bridge = this.physics.add.sprite(bridgeSpawn.x, bridgeSpawn.y, 'drop-bridge');
            this.physics.add.collider(this.bridge, groundLayer);
            this.physics.add.collider(player, this.bridge);
            this.physics.add.collider(dollHolder, this.bridge);
            this.bridge.body.setImmovable();
        })
    }

    //plays lever animation, causes elevatir to move up to specifc location
    callElevator() {
        this.lever2.anims.play('switch');
        this.elevator.activate = true;
        this.clock = this.time.delayedCall(900, () => {
            this.lever2 = this.physics.add.sprite(this.leverSpawn2.x, this.leverSpawn2.y, 'lever');
            this.physics.add.collider(this.lever2, this.groundLayer);
        })
    }

    //plays lever animation, causes box to be dropped from ceiling so area is reachable
    dropBox() {
        this.lever3.anims.play('switch');
        this.drop_box = this.physics.add.sprite(this.dropBoxSpawn.x, this.dropBoxSpawn.y, 'drop_box');
        this.drop_box.body.setImmovable();
        this.physics.add.collider(this.drop_box, this.groundLayer);
        this.physics.add.collider(this.drop_box, player);
        this.physics.add.collider(this.drop_box, dollHolder);
        this.clock = this.time.delayedCall(900, () => {
            this.lever3 = this.physics.add.sprite(this.leverSpawn3.x, this.leverSpawn3.y, 'lever');
            this.physics.add.collider(this.lever3, this.groundLayer);
        })
    }
}
