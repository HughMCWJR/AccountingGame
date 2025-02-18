import { GameObjects } from "phaser";

export class Ball extends GameObjects.Container {
    name;
    type;
    state = null;

    constructor(scene, x, y, name, type) {
        super(scene, x, y);
        this.postFX.addBloom(0xffffff, 1, 1, 2, 1.2);
        this.name = name;
        this.type = type;

        this.scene = scene;

        // set the display width and height for the ball
        this.ballImage = new GameObjects.Image(scene, 0, 0, "ball");
        this.ballImage.displayWidth = 30;
        this.ballImage.displayHeight = 30;

        this.textLabel = new GameObjects.Text(scene, 0, -20, name, {
            fontSize: "14px",
            fill: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 4, y: 2 },
            align: "center"
        });
        this.textLabel.setOrigin(0.5, 1);

        this.add([this.ballImage, this.textLabel]);

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


    destroyBall() {
        // Destroy Ball
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
        this.state = null;

    }

}