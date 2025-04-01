import { Scene } from "phaser";

export class MainMenuScene extends Scene {
    constructor() {
        super("MainMenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        if (this.sound.locked) {
            this.sound.once('unlocked', () => {
                this.game.musicManager.play(this,
                    'menu_bgm');
            });
        } else {
            this.game.musicManager.play(this, 'menu_bgm');
        }
        this.add.text(this.scale.width / 2, 100, "Accounting Fundamentals", {
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const options = ["debit_credit", "accounting"];
        const selectedOptions = {
            type: "debit_credit"
        };

        function get_option_text(option) {
            if (option == "debit_credit") {
                return "Debit_vs._Credit";
            } else if (option == "accounting"){
                return "The_Five_Building_Blocks";
            }
        }

        options.forEach((option, index) => {
            const text = this.add.text(this.scale.width / 2, 200 + index * 50, get_option_text(option), {
                fontSize: "24px",
                color: "#ffffff"
            }).setOrigin(0.5)
                .setInteractive();

            text.on("pointerdown", () => {
                this.sound.play('selection', {
                    volume: 1
                });
                selectedOptions.type = option;
                this.startGame(selectedOptions);
            });
        });

        const settingsText = this.add.text(this.scale.width / 2, 400, "Settings", {
            fontSize: "24px",
            color: "#ffffff"
        }).setOrigin(0.5).setInteractive();

        settingsText.on("pointerdown", () => {
            this.sound.play('selection', { volume: 1 });
            this.scene.start("SettingsScene"); // Go to settings scene
        });
    }

    startGame(selectedOptions) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MainScene", { type: selectedOptions.type });
        });
    }
}