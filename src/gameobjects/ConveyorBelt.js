import { Physics, Math } from "phaser";
import { Bullet } from "./Bullet";

export class ConveyorBelt extends Physics.Arcade.Sprite {
    scene = null;

    constructor(scene) {
        super(scene, 0, 0, "conveyor-belt");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(1);
        this.body.setSize(32, 32);
    }

    // belt_label: int - 1, 2, 3, 4, or 5
    // ___1___2___3___
    // |
    // 4
    // |
    // 5
    // |
    // belt_num: int - how many belts along it is (0 is the first one)
    set_pos_by_belt_and_num(belt_label, belt_num) {
        this.belt_label = belt_label;

        if (belt_label == 1 || belt_label == 2 || belt_label == 3) {
            this.x = ((this.scene.scale.width / 4) * belt_label)
            this.y = belt_num * this.height + (this.height / 2)
            if (belt_label == 1 || belt_label == 3) {
                this.angler = 0;
            } else {
                this.angle = 180;
            }
        } else if (belt_label == 4 || belt_label == 5) {
            this.y = ((this.scene.scale.height / 3) * (belt_label - 3))
            this.x = belt_num * this.width + (this.width / 2)
            if (belt_label == 4) {
                this.angle = 90;
            } else {
                this.angle = -90;
            }
        } else {
            throw new Error("Undefined Conveyor Belt Choice");
        }
    }

    start() {
    }
}