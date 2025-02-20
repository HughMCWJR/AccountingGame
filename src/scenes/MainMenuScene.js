import { Scene } from "phaser";

export class MainMenuScene extends Scene {
    constructor() {
        super("MainMenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {

        this.add.text(this.scale.width / 2, 100, "Accounting Game", {
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const options = ["debit_credit", "accounting"];
        const selectedOptions = {
            type: "debit_credit"
        };

        options.forEach((option, index) => {
            const text = this.add.text(this.scale.width / 2, 200 + index * 50, option, {
                fontSize: "24px",
                color: "#ffffff"
            }).setOrigin(0.5)
                .setInteractive();

            text.on("pointerdown", () => {
                selectedOptions.type = option;
                this.startGame(selectedOptions);
            });
        });
    }

    startGame(selectedOptions) {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MainScene", { type: selectedOptions.type });
        });
    }
}