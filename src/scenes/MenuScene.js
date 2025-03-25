import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        // Background rectangles
        this.add.rectangle(
            0,
            this.scale.height / 2,
            this.scale.width,
            240,
            0xD8DDE3
        ).setAlpha(1).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            this.scale.height / 2 + 125,
            this.scale.width,
            50,
            0x000000
        ).setAlpha(.8).setOrigin(0, 0.5);

        const primary_click = this.add.image(this.scale.width * 3 / 4 + 160, this.scale.height / 2 + 30, "primary_click");
        primary_click.setScale(0.15);
        const space_bar = this.add.image(this.scale.width * 3 / 4 - 90, this.scale.height / 2 + 30, "space_bar");
        space_bar.setScale(0.5);
        const pickup_controls_label = this.add.bitmapText(
            this.scale.width * 3 / 4,
            this.scale.height / 2 - 50,
            "pixelfont",
            "Pickup Ball:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const pickup_controls_or = this.add.bitmapText(
            (this.scale.width * 3 / 4) + 90,
            this.scale.height / 2 + 30,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const WASD = this.add.image((this.scale.width / 4) - 100, this.scale.height / 2 + 30, "WASD");
        WASD.setScale(0.5);
        const arrow_keys = this.add.image((this.scale.width / 4) + 100, this.scale.height / 2 + 30, "arrow_keys");
        arrow_keys.setScale(0.5);
        const movement_controls_label = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 - 50,
            "pixelfont",
            "Movement:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const movement_controls_or = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 + 30,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);

        // Logo
        // const logo_game = this.add.bitmapText(
        //     this.scale.width / 2,
        //     this.scale.height / 2,
        //     "knighthawks",
        //     "PHASER'S\nREVENGE",
        //     52,
        //     1
        // )
        // logo_game.setOrigin(0.5, 0.5);
        // logo_game.postFX.addShine();

        const start_msg = this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 125,
            "pixelfont",
            "CLICK TO START",
            24
        ).setOrigin(0.5, 0.5);


        // Tween to blink the text
        this.tweens.add({
            targets: start_msg,
            alpha: 0,
            duration: 800,
            ease: (value) => Math.abs(Math.round(value)),
            yoyo: true,
            repeat: -1
        });

        // Send start-game event when user clicks
        this.input.on("pointerdown", () => {
            this.sound.play('selection', {
                volume: 1
            });
            this.game.events.emit("start-game");
        });
    }
}