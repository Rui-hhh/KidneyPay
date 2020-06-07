class Elevator extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, frame, goUp) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, key, frame);
        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body
        
        // set properties
        this.body.setImmovable();
        this.body.allowGravity = false;
        
        // add custom properties    
        this.JUMP_VELOCITY = -100;
        
        this.activate = goUp;
        
    }


    update() {
        //make the elevator go up when goUp is true
        this.goUp = this.activate;
        if (this.goUp == true) {
            this.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if (this.goUp == false) {
            this.body.setVelocityY(0);
        }        
    }
}