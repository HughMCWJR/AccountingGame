import { GameObjects } from "phaser";

export class Basket extends GameObjects.Container {
    type;

    constructor(scene, x, y, type) {
        super(scene, x, y);
        this.type = type;

        // create bakset image
        this.basketImage = new GameObjects.Image(scene, 0, 0, "basket");
        this.basketImage.setOrigin(0.5, 0.5);
        this.basketImage.displayWidth = 100;
        this.basketImage.displayHeight = 100;

        // create text label
        this.textLabel = new GameObjects.Text(scene, 0, 0, type, {
            fontSize: "14px",
            fill: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 4, y: 2 },
            align: "center",
            wordWrap: { width: 100, useAdvancedWrap: true },
        });
        this.textLabel.setOrigin(0.5, 0.5);


        this.add([this.basketImage, this.textLabel]);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setSize(this.basketImage.displayWidth, this.basketImage.displayHeight);
        this.body.setOffset(-this.basketImage.displayWidth / 2, -this.basketImage.displayHeight / 2);

        this.body.setImmovable(true);
    }

    // Found overlap betwene ball and basket, check what to do
    checkForBall(ball) {

        if (ball.state != "picked" && ball.pit_number == null) {
            if (ball.type === this.type.toLowerCase()) {
                this.scene.points += 10;
                this.scene.scene.get("HudScene")
                    .update_points(this.scene.points);
                ball.destroyBall(); // destroy the ball
            } else {
                ball.goToPit();
            }
        }

    }

    start() {
        this.setActive(true);
        this.setVisible(true);
    }
};
