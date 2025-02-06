import { Physics, Math } from "phaser";
import { Bullet } from "./Bullet";

export class ConveyorBelt extends Physics.Arcade.Sprite {
    scene = null;

    constructor(scene) {
        super(scene, scene.scale.width / 2, scene.scale.height / 2, "conveyor-belt");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.2);
        this.body.setSize(15, 15);
    }

    start() {
    }
}