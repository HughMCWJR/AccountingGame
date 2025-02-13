import { GameObjects } from "phaser";

export class Ball extends GameObjects.Image {
    speed;
    name;
    type;
    player = null;
    state = "idle";

    constructor(scene, x, y, name, type) {
        super(scene, x, y, "ball");
        this.speed = Phaser.Math.GetSpeed(450, 1);
        this.postFX.addBloom(0xffffff, 1, 1, 2, 1.2);
        this.name = name;
        this.type = type;

        this.scene = scene;

        // set the display width and height for the ball
        this.displayWidth = 30;
        this.displayHeight = 30;

        // add the ball to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // set the ball properties
        //this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true); // make the ball collide with the world bounds
    }

    start(texture = "ball") {
        // Change ball change texture
        // this.setTexture(texture);


        this.setActive(true);
        this.setVisible(true);
    }

    // Assumes player does not have ball picked up
    pick(player) {
        if (player.picked_up_ball != null) {
            throw new Error("Ball tried to be picked up by player who already had ball");
        }

        if (this.state === "picked") {
            return;
        } // Ball already picked
        this.state = "picked";
        this.player = player;
        this.player.picked_up_ball = this;
        // this.setActive(true);
        // this.setVisible(true);
    }

    drop() {
        if (this.state !== "picked") {
            return;
        } // Ball not picked
        this.player.picked_up_ball = null;
        this.player = null;
        this.state = "idle";
    }

    destroyBall() {
        // Destroy Ball
        this.setActive(false);
        this.setVisible(false);
        this.destroy();

    }

    // Update bullet position and destroy if it goes off screen
    update(time, delta) {
        // console.log("update ball");
        if (this.state === "picked" && this.player) {
            // Follow the player
            this.setPosition(this.player.x, this.player.y - 20);
        }
    }
}