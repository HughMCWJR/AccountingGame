import { Scene } from "phaser";

export class PauseScene extends Scene {
    constructor() {
        super("PauseScene");
    }

    create() {
        // show the pause screen
        // this.add.text(this.scale.width / 2, this.scale.height / 2 - 80, "Game Pause", {
        //     fontSize: "32px",
        //     color: "#ffffff",
        //     align: "center"
        // }).setOrigin(0.5);

        // create the "continue" button
        this.resumeText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, "Continue", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();

        // create the "exit game" button
        this.exitText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 30, "exit", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();

        // flag to prevent double resume
        this.isResuming = false;

        // click continue to resume the game
        this.resumeText.on('pointerdown', () => {
            if (!this.isResuming) {
                this.isResuming = true;
                // disable the buttons
                this.resumeText.disableInteractive();
                this.exitText.disableInteractive();
                this.resumeText.destroy();
                this.exitText.destroy();

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
        });

        this.exitText.on('pointerdown', () => {
            // stop MainScene and start MainMenuScene
            this.game.events.emit("exit-game");
            this.scene.stop("MainScene");
            this.scene.start("MainMenuScene");
            this.scene.stop();
        });
    }
}