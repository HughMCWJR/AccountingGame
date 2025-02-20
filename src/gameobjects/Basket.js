import { GameObjects } from "phaser";

export class Basket extends GameObjects.Container {
    type;

    constructor(scene, x, y, type) {
        super(scene, x, y);
        this.type = type;

        // create bakset image
        this.basketImage = new GameObjects.Image(scene, 30, 30, "basket");
        this.basketImage.displayWidth = 100;
        this.basketImage.displayHeight = 100;

        // create text label
        this.textLabel = new GameObjects.Text(scene, 30, -15, type, {
            fontSize: "14px",
            fill: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 4, y: 2 },
            align: "center"
        });
        this.textLabel.setOrigin(0.5, 1);


        this.add([this.basketImage, this.textLabel]);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setImmovable(true);
    }

    checkForBall(ball) {

        if (ball.type === this.type) {
            this.scene.points += 10;
            this.scene.scene.get("HudScene")
                .update_points(this.scene.points);
            ball.destroyBall(); // destroy the ball
        } else {
            ball.goToPit();
        }

    }

    start() {
        this.setActive(true);
        this.setVisible(true);
    }
};
