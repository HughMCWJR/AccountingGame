import { Scene } from "phaser";

// The HUD scene is the scene that shows the points and the remaining time.
export class HudScene extends Scene {
    
    remaining_time = 0;

    remaining_time_text;
    points_text;

    constructor() {
        super("HudScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remaining_time = data.remaining_time;
    }

    create() {
        this.points_text = this.add.bitmapText(10, 10, "pixelfont", "POINTS:000", 24).setTint(0x000000);
        this.remaining_time_text = this.add.bitmapText(this.scale.width - 10, 10, "pixelfont", `TIME:${this.remaining_time}s`, 24)
            .setOrigin(1, 0).setTint(0x000000);
    }

    update_points(points) {
        this.points_text.setText(`POINTS:${points.toString().padStart(3, "0")}`);
    }

    update_timeout(timeout) {
        this.remaining_time_text.setText(`TIME:${timeout.toString().padStart(2, "0")}s`);
    }
}