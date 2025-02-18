import { GameObjects } from "phaser";

export class Basket extends GameObjects.Image {
    type;
    constructor(scene, x, y, type) {
        super(scene, x, y, "basket"); // create a basket
        this.type = type; // type of the basket
        scene.add.existing(this); // add the basket to the scene
        this.scene.physics.add.existing(this);

        // enable physics for the basket
        scene.physics.world.enable(this);
        this.body.setImmovable(true); // make the basket immovable

        // set the display width and height for the basket
        this.displayWidth = 100;
        this.displayHeight = 100;
    }

    checkForBall(ball) {

        if (ball.type === this.type) {
            this.scene.points += 10;
            this.scene.scene.get("HudScene")
                .update_points(this.scene.points);

        }
        ball.destroyBall(); // destroy the ball

    }
};
