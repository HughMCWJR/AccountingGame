import { Scene } from "phaser";

export class GameOverScene extends Scene {
    end_points = 0;
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.end_points = data.points || 0;
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
        // Backgrounds
        this.add.image(0, 0, "background")
            .setOrigin(0, 0);

        // Rectangles to show the text
        // Background rectangles
        this.add.rectangle(
            0,
            this.scale.height / 2,
            this.scale.width,
            120,
            0xffffff
        ).setAlpha(.8).setOrigin(0, 0.5);

        const gameover_text = this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2,
            "knighthawks",
            "GAME\nOVER",
            62,
            1
        )
        gameover_text.setOrigin(0.5, 0.5);
        gameover_text.postFX.addShine();

        this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 85,
            "pixelfont",
            `YOUR POINTS: ${this.end_points}`,
            24
        ).setOrigin(0.5, 0.5);

        const options = [{ type: "restart", scene: "MainScene" }, { type: "main_menu", scene: "MainMenuScene" }];
        options.forEach((option, index) => {
            const text = this.add.text(this.scale.width / 2, this.scale.height / 4 * 3 + index * 50, option.type, {
                fontSize: "24px",
                color: "#ffffff"
            }).setOrigin(0.5)
                .setInteractive();

            text.on("pointerdown", () => {
                this.sound.play('selection', {
                    volume: 1
                });
                this.scene.start(option.scene);
            });
        });

    }
}