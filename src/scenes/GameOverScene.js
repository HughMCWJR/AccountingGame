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

        const FIRST_RECTANGLE_HEIGHT = 180
        const SECOND_RECTANGLE_HEIGHT = 70

        const vertical_shift_to_center = -SECOND_RECTANGLE_HEIGHT / 2

        // Background rectangles
        this.add.rectangle(
            0,
            this.scale.height / 2 + vertical_shift_to_center,
            this.scale.width,
            FIRST_RECTANGLE_HEIGHT,
            0xD8DDE3
        ).setAlpha(0.8).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center,
            this.scale.width,
            SECOND_RECTANGLE_HEIGHT,
            0x000000
        ).setAlpha(.8).setOrigin(0, 0.5);

        const gameover_text = this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + vertical_shift_to_center - 20,
            "knighthawks",
            "GAME\nOVER",
            62,
            1
        )
        gameover_text.setOrigin(0.5, 0.5);
        gameover_text.postFX.addShine();

        this.add.bitmapText(
            this.scale.width / 2,
            this.scale.height / 2 + 65 + vertical_shift_to_center,
            "pixelfont",
            `YOUR POINTS: ${this.end_points}`,
            24
        ).setOrigin(0.5, 0.5).setTint(0x000000);

        // create the "Play Again" button for the default mode
        const playAgainText = this.add.text(this.scale.width / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Play Again", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        const playAgainTextRect = this.add.rectangle(playAgainText.x, playAgainText.y, playAgainText.width, playAgainText.height);
        playAgainTextRect.setStrokeStyle(2, 0xffffff);
        playAgainText.on('pointerdown', () => {
            this.sound.play('selection', {
                volume: 1
            });
            this.scene.start("MainScene");
        });
        
        // create the "Start Tutorial" button for the tutorial mode where answers are given
        const mainMenuText = this.add.text(this.scale.width * 3 / 4, this.scale.height / 2 + (FIRST_RECTANGLE_HEIGHT / 2) + (SECOND_RECTANGLE_HEIGHT / 2) + vertical_shift_to_center, "Main Menu", {
            fontSize: "32px",
            color: "#ffffff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setInteractive();
        const mainMenuTextRect = this.add.rectangle(mainMenuText.x, mainMenuText.y, mainMenuText.width, mainMenuText.height);
        mainMenuTextRect.setStrokeStyle(2, 0xffffff);
        mainMenuText.on('pointerdown', () => {
            this.sound.play('selection', {
                volume: 1
            });
            this.scene.start("MainMenuScene");
        });

    }
}