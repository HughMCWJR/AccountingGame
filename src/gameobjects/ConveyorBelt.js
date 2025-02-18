import { Physics, Math } from "phaser";
import { Bullet } from "./Bullet";

export class ConveyorBelt extends Physics.Arcade.Sprite {
    scene = null;

    constructor(scene) {
        // Default sprite should be up or down sprite
        // - Further assuming up/down sprites are same shape, and same for left/right
        // - Further assuming that shape of up/down sprites is transpose of shape for left/right
        super(scene, 0, 0, "conveyor-belt");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(1);
        this.body.setSize(32, 32);
    }

    // belt_label: int - 1, 2, 3, 4, or 5
    set_pos_and_belt_label(x, y, belt_label) {
        this.x = x;
        this.y = y;

        if (belt_label == 1 || belt_label == 2 || belt_label == 3 || belt_label == 4 || belt_label == 5) {
            this.belt_label = belt_label;
        } else {
            throw new Error("Undefined Conveyor Belt Choice");
        }

        // Set Direction
        if (belt_label == 1 || belt_label == 3) {
            // Down
            this.angle = 0;
        } else if (belt_label == 2) {
            // Up
            this.angle = 180;
        } else if (belt_label == 4) {
            // Right
            this.angle = 90;
        } else if (belt_label == 5) {
            // Left
            this.angle = -90;
        }
    }

    start() {
    }
}