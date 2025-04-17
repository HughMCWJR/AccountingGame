import { Scene } from "phaser";

import { TooltipManager } from "../gameobjects/Tooltips";
import {RIGHT_FIRST_TIME_SCORE, RIGHT_NOT_FIRST_TIME_SCORE} from "./MainScene";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.tooltip = new TooltipManager(this);
    }

    create() {
        const FIRST_RECTANGLE_HEIGHT = 240
        const SECOND_RECTANGLE_HEIGHT = 70

        const vertical_shift_to_center = -SECOND_RECTANGLE_HEIGHT / 2

        // Background rectangles
        this.add.rectangle(
            0,
            this.scale.height / 2 + vertical_shift_to_center,
            this.scale.width,
            240,
            0xD8DDE3
        ).setAlpha(1).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center,
            this.scale.width,
            SECOND_RECTANGLE_HEIGHT,
            0x000000
        ).setAlpha(.8).setOrigin(0, 0.5);

        const primary_click = this.add.image(this.scale.width * 3 / 4 + 160, this.scale.height / 2 + 30 + vertical_shift_to_center, "primary_click");
        primary_click.setScale(0.15);
        const space_bar = this.add.image(this.scale.width * 3 / 4 - 90, this.scale.height / 2 + 30 + vertical_shift_to_center, "space_bar");
        space_bar.setScale(0.5);
        const pickup_controls_label = this.add.bitmapText(
            this.scale.width * 3 / 4,
            this.scale.height / 2 - 50 + vertical_shift_to_center,
            "pixelfont",
            "Pickup Ball:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const pickup_controls_or = this.add.bitmapText(
            (this.scale.width * 3 / 4) + 90,
            this.scale.height / 2 + 30 + vertical_shift_to_center,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const WASD = this.add.image((this.scale.width / 4) - 100, this.scale.height / 2 + 30 + vertical_shift_to_center, "WASD");
        WASD.setScale(0.5);
        const arrow_keys = this.add.image((this.scale.width / 4) + 100, this.scale.height / 2 + 30 + vertical_shift_to_center, "arrow_keys");
        arrow_keys.setScale(0.5);
        const movement_controls_label = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 - 50 + vertical_shift_to_center,
            "pixelfont",
            "Movement:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        const movement_controls_or = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 + 30 + vertical_shift_to_center,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);

        // create the "Start Game" button for the default mode
        const startGameText = this.add.text(this.scale.width / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Start Game", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        const startGameTextRect = this.add.rectangle(startGameText.x, startGameText.y, startGameText.width, startGameText.height);
        startGameTextRect.setStrokeStyle(2, 0xffffff);
        startGameText.on('pointerdown', () => {
            localStorage.setItem("difficulty", "1");
            // stop MenuScene and start MainScene
            this.sound.play('selection', {
                volume: 1
            });
            this.game.events.emit("start-game");
        });
        this.tooltip.attachTo(startGameText, `Default mode, put vocab in correct bins. If a vocab is sorted correctly the first time, it is worth ${RIGHT_FIRST_TIME_SCORE} points; otherwise, ${RIGHT_NOT_FIRST_TIME_SCORE} points.`);

        // create the "Start Tutorial" button for the tutorial mode where answers are given
        const startTutorialText = this.add.text(this.scale.width * 3 / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Start Tutorial", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        const startTutorialTextRect = this.add.rectangle(startTutorialText.x, startTutorialText.y, startTutorialText.width, startTutorialText.height);
        startTutorialTextRect.setStrokeStyle(2, 0xffffff);
        startTutorialText.on('pointerdown', () => {
            localStorage.setItem("difficulty", "0");
            // stop MenuScene and start MainScene
            this.sound.play('selection', {
                volume: 1
            });
            this.game.events.emit("start-game");
        });
        this.tooltip.attachTo(startTutorialText, "Play with answers revealed as a good study tool.");

        // // Send start-game event when user clicks
        // this.input.on("pointerdown", () => {
        //     this.sound.play('selection', {
        //         volume: 1
        //     });
        //     this.game.events.emit("start-game");
        // });

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

        // const start_msg = this.add.bitmapText(
        //     this.scale.width / 2,
        //     this.scale.height / 2 + 125,
        //     "pixelfont",
        //     "CLICK TO START",
        //     24
        // ).setOrigin(0.5, 0.5);
        // // Tween to blink the text
        // this.tweens.add({
        //     targets: start_msg,
        //     alpha: 0,
        //     duration: 800,
        //     ease: (value) => Math.abs(Math.round(value)),
        //     yoyo: true,
        //     repeat: -1
        // });
    }
}