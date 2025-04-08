import { Scene } from "phaser";

export class PauseScene extends Scene {
    constructor() {
        super("PauseScene");
    }

    create() {
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        const FIRST_RECTANGLE_HEIGHT = 240
        const SECOND_RECTANGLE_HEIGHT = 70

        const vertical_shift_to_center = -SECOND_RECTANGLE_HEIGHT / 2

        // Background rectangles
        this.firstRectangle = this.add.rectangle(
            0,
            this.scale.height / 2 + vertical_shift_to_center,
            this.scale.width,
            240,
            0xD8DDE3
        ).setAlpha(1).setOrigin(0, 0.5);
        this.secondRectangle = this.add.rectangle(
            0,
            this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center,
            this.scale.width,
            SECOND_RECTANGLE_HEIGHT,
            0x000000
        ).setAlpha(.8).setOrigin(0, 0.5);

        this.primary_click = this.add.image(this.scale.width * 3 / 4 + 160, this.scale.height / 2 + 30 + vertical_shift_to_center, "primary_click");
        this.primary_click.setScale(0.15);
        this.space_bar = this.add.image(this.scale.width * 3 / 4 - 90, this.scale.height / 2 + 30 + vertical_shift_to_center, "space_bar");
        this.space_bar.setScale(0.5);
        this.pickup_controls_label = this.add.bitmapText(
            this.scale.width * 3 / 4,
            this.scale.height / 2 - 50 + vertical_shift_to_center,
            "pixelfont",
            "Pickup Ball:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        this.pickup_controls_or = this.add.bitmapText(
            (this.scale.width * 3 / 4) + 90,
            this.scale.height / 2 + 30 + vertical_shift_to_center,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        this.WASD = this.add.image((this.scale.width / 4) - 100, this.scale.height / 2 + 30 + vertical_shift_to_center, "WASD");
        this.WASD.setScale(0.5);
        this.arrow_keys = this.add.image((this.scale.width / 4) + 100, this.scale.height / 2 + 30 + vertical_shift_to_center, "arrow_keys");
        this.arrow_keys.setScale(0.5);
        this.movement_controls_label = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 - 50 + vertical_shift_to_center,
            "pixelfont",
            "Movement:",
            48
        ).setOrigin(0.5, 0.5).setTint(0x000000);
        this.movement_controls_or = this.add.bitmapText(
            this.scale.width / 4,
            this.scale.height / 2 + 30 + vertical_shift_to_center,
            "pixelfont",
            "or",
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);

        // create the "Start Game" button for the default mode
        this.resumeText = this.add.text(this.scale.width / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Resume", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        this.resumeTextRect = this.add.rectangle(this.resumeText.x, this.resumeText.y, this.resumeText.width, this.resumeText.height);
        this.resumeTextRect.setStrokeStyle(2, 0xffffff);
        // flag to prevent double resume
        this.isResuming = false;
        // click continue to resume the game
        this.resumeFunction = () => {
            this.sound.play('selection', {
                volume: 1
            });
            if (!this.isResuming) {
                this.isResuming = true;
                // disable the buttons
                this.resumeText.disableInteractive();
                this.returnToMainMenu.disableInteractive();
                this.resumeText.destroy();
                this.resumeTextRect.destroy();
                this.returnToMainMenu.destroy();
                this.returnToMainMenuRect.destroy();
                this.firstRectangle.destroy();
                this.secondRectangle.destroy();
                this.WASD.destroy();
                this.arrow_keys.destroy();
                this.movement_controls_label.destroy();
                this.movement_controls_or.destroy();
                this.primary_click.destroy();
                this.space_bar.destroy();
                this.pickup_controls_label.destroy();
                this.pickup_controls_or.destroy();

                // show the countdown text
                this.countdownText = this.add.text(this.scale.width / 2, this.scale.height / 2, "3", {
                    fontSize: "48px",
                    color: "#ffffff",
                    align: "center"
                }).setOrigin(0.5);

                let countdown = 3;
                this.time.addEvent({
                    delay: 1000, // update every 1 second
                    repeat: 2,   // repeat 3 times
                    callback: () => {
                        countdown--;
                        if (countdown > 0) {
                            this.countdownText.setText(countdown.toString());
                        } else {
                            // resume the game
                            this.scene.resume("MainScene");
                            this.scene.stop();
                        }
                    },
                    callbackScope: this
                });
            }
        }
        this.resumeText.on('pointerdown', this.resumeFunction);

        // create the "Start Tutorial" button for the tutorial mode where answers are given
        this.returnToMainMenu = this.add.text(this.scale.width * 3 / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Return to Main Menu", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        this.returnToMainMenuRect = this.add.rectangle(this.returnToMainMenu.x, this.returnToMainMenu.y, this.returnToMainMenu.width, this.returnToMainMenu.height);
        this.returnToMainMenuRect.setStrokeStyle(2, 0xffffff);
        this.returnToMainMenu.on('pointerdown', () => {
            // stop MainScene and start MainMenuScene
            this.sound.play('selection', {
                volume: 1
            });
            this.game.events.emit("exit-game");
            this.scene.stop("MainScene");
            this.scene.start("MainMenuScene");
            this.scene.stop();
        });
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            this.resumeFunction();
        }
    }
}