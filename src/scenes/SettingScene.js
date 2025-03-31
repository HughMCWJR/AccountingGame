import { Scene } from "phaser";

// Difficulty + descriptions
const DifficultySettings = [
    { name: 'Rookies', description: 'Can I play it, Daddy?', level: 0 },
    { name: 'Standard', description: 'Standard challenge. Balanced for most players.', level: 1 },
    { name: 'Hardcore', description: "For experienced players. Bring'em on", level: 2 },
    { name: 'Elite', description: 'For the bravest of players. Do or die', level: 3 },
    { name: 'Expert', description: 'For the insane and crazy players. Call me Terror-Billy!', level: 4 },
    { name: 'Impossible', description: 'You will never win. It is your Ultra Nightmare', level: 5 }
];

// Default settings if no localStorage
const DEFAULT_SETTINGS = {
    difficulty: 1, // index: 1 => 'Standard'
    volume: 1.0
};

export class SettingsScene extends Scene {
    constructor() {
        super("SettingsScene");
    }

    create() {
        const { width, height } = this.scale;

        // Load stored or default settings
        this.difficultyIndex = parseInt(localStorage.getItem('difficulty'));
        if (isNaN(this.difficultyIndex)) {
            this.difficultyIndex = DEFAULT_SETTINGS.difficulty;
        }
        this.volume = parseFloat(localStorage.getItem('volume'));
        if (isNaN(this.volume)) {
            this.volume = DEFAULT_SETTINGS.volume;
        }

        // Title - centered
        this.add.text(width / 2, 30, "SETTINGS", {
            fontFamily: 'Arial',
            fontSize: '42px',
            color: '#ffcf4f',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0);

        // Difficulty label (left aligned, or you can center if desired)
        this.add.text(40, 100, "Difficulty", {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0);

        // Difficulty description text
        this.descriptionText = this.add.text(40, 200, "", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffeb99', // brighter color
            wordWrap: { width: 500, useAdvancedWrap: true },
            align: "left",
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0);
        this.descriptionText.setVisible(false);

        // DOM Select for difficulty (left aligned)
        this.selectDifficulty = this.add.dom(40, 140).createFromHTML(this.createDifficultySelectHTML());
        this.selectDifficulty.setOrigin(0, 0);
        this.selectDifficulty.addListener('change');
        this.selectDifficulty.on('change', (event) => {
            const val = parseInt(event.target.value);
            this.difficultyIndex = val;
            this.updateDifficultyDescription();
        });

        // Initially set the correct description
        this.updateDifficultyDescription();

        // Volume label
        this.add.text(40, 260, "Sound Volume", {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0);

        // Create Volume Slider at (40, 310)
        this.volumeSlider = this.createVolumeSlider(40, 310);

        // Volume display below slider
        this.volumeDisplay = this.add.text(40, 350, `Volume: ${(this.volume * 100).toFixed(0)}%`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffeb99',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0);

        // Buttons in bottom center region
        // We'll place them near the bottom, horizontally spaced
        const btnY = height - 80;
        const spacing = 200;

        // Positions for the 3 buttons: left, center, right (relative to center)
        const midX = width / 2;

        const resetBtn = this.createStyledButton(midX - spacing, btnY, "Reset to Default", {
            backgroundColor: "#d32f2f",
            color: "#ffffff"
        });
        resetBtn.on("pointerdown", () => {
            this.confirmBox("Reset settings to default?", () => {
                this.difficultyIndex = DEFAULT_SETTINGS.difficulty;
                this.volume = DEFAULT_SETTINGS.volume;
                const selectEl = this.selectDifficulty.getChildByName('difficultySelect');
                if (selectEl) {
                    selectEl.value = this.difficultyIndex;
                }
                this.volumeSlider.node.value = this.volume * 100;
                this.updateDifficultyDescription();
                this.updateVolume();
            });
        });

        const saveBtn = this.createStyledButton(midX + spacing, btnY, "Save and Back", {
            backgroundColor: "#388e3c",
            color: "#ffffff"
        });
        saveBtn.on("pointerdown", () => {
            this.confirmBox("Save settings and return?", () => {
                localStorage.setItem("difficulty", this.difficultyIndex.toString());
                localStorage.setItem("volume", this.volume);
                this.sound.play("selection", { volume: this.volume });
                this.scene.start("MainMenuScene");
            });
        });

        const exitBtn = this.createStyledButton(midX, btnY, "Exit", {
            backgroundColor: "#455a64",
            color: "#ffffff"
        });
        exitBtn.on("pointerdown", () => {
            this.confirmBox("Exit without saving?", () => {
                this.sound.play("selection", { volume: this.volume });
                this.scene.start("MainMenuScene");
            });
        });
    }

    // Utility to create HTML for <select>
    createDifficultySelectHTML() {
        let html = '<select name="difficultySelect" style="font-size:18px; width:220px; padding:5px;">';
        DifficultySettings.forEach((item) => {
            const selected = (item.level === this.difficultyIndex) ? 'selected' : '';
            html += `<option value="${item.level}" ${selected}>${item.name} (Lv:${item.level})</option>`;
        });
        html += '</select>';
        return html;
    }

    updateDifficultyDescription() {
        const found = DifficultySettings.find(d => d.level === this.difficultyIndex);
        if (found) {
            this.descriptionText.setText(found.description);
            this.descriptionText.setVisible(true);
        } else {
            this.descriptionText.setText("");
            this.descriptionText.setVisible(false);
        }
    }

    createVolumeSlider(x, y) {
        const slider = this.add.dom(x, y).createFromHTML(`
            <input type="range" min="0" max="100" value="${this.volume * 100}" style="width: 200px;">
        `);
        slider.setOrigin(0, 0);

        slider.addListener('input');
        slider.on('input', (event) => {
            const val = parseFloat(event.target.value) / 100;
            this.volume = val;
            this.updateVolume();
        });

        return slider;
    }

    updateVolume() {
        if (this.volumeDisplay) {
            this.volumeDisplay.setText(`Volume: ${(this.volume * 100).toFixed(0)}%`);
        }
        if (this.game.musicManager) {
            this.game.musicManager.setVolume(this.volume);
        }
    }

    createStyledButton(x, y, label, styleOptions = {}) {
        const {
            backgroundColor = "#444",
            color = "#ffffff"
        } = styleOptions;

        // We'll add a small corner radius look with some spaces
        return this.add.text(x, y, label, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: color,
            backgroundColor: backgroundColor,
            padding: { x: 15, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive();
    }

    // Generic confirm box
    confirmBox(message, onConfirm) {
        // Let's center everything dynamically
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const boxWidth = 400;
        const boxHeight = 180;

        // Create a dark rectangle in the center
        const box = this.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0x000000, 0.8)
            .setStrokeStyle(2, 0xffffff)
            .setDepth(9999);

        // Title text position offset
        const text = this.add.text(centerX, centerY - 40, message, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: boxWidth - 40 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
            .setDepth(9999);

        // Yes/No button positions
        const yesBtn = this.add.text(centerX - 70, centerY + 30, "Yes", {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: "#00ff00",
            backgroundColor: "#333",
            padding: { x: 15, y: 6 },
        }).setOrigin(0.5)
            .setInteractive()
            .setDepth(9999);

        const noBtn = this.add.text(centerX + 70, centerY + 30, "No", {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: "#ff4444",
            backgroundColor: "#333",
            padding: { x: 15, y: 6 }
        }).setOrigin(0.5)
            .setInteractive()
            .setDepth(9999);

        // Helper to destroy popup elements
        const destroyPopup = () => {
            box.destroy();
            text.destroy();
            yesBtn.destroy();
            noBtn.destroy();
        };

        yesBtn.on("pointerdown", () => {
            destroyPopup();
            onConfirm();
        });

        noBtn.on("pointerdown", () => {
            destroyPopup();
        });
    }
}