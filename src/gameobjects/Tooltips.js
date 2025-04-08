export class TooltipManager {
    scene;


    constructor(scene) {
        this.scene = scene;
        this.tooltips = [];
        // press T to show all tooltips
        this.scene.input.keyboard.on("keydown-T", () => {
            this.tooltips.forEach(({ target, textObject, content }) => {
                this.show(textObject, target, content);
            });
        });

        this.scene.input.keyboard.on("keyup-T", () => {
            this.tooltips.forEach(({ textObject }) => {
                textObject.setVisible(false);
            });
        });
    }

    attachTo(target, content) {
        target.setInteractive();

        const textObject = this.scene.add.text(0, 0, "", {
            fontSize: "14px",
            fill: "#fff",
            backgroundColor: "#000",
            padding: { x: 6, y: 4 },
            wordWrap: {
                width: 200,
                useAdvancedWrap: true
            }
        }).setDepth(1000).setVisible(false);
        textObject.setAlpha(0.8);
        this.tooltips.push({ target, textObject, content });

        const show = () => this.show(textObject, target, content);

        target.on("pointerover", show);
        target.on("pointerout", () => textObject.setVisible(false));

        target.on("pointerdown", () => {
            this.scene.time.delayedCall(500, show);
        });

        target.on("pointerup", () => textObject.setVisible(false));
    }

    show(textObject, target, content) {
        const bounds = target.getBounds();
        const cam = this.scene.cameras.main;
        const screenMidX = cam.worldView.centerX;
        const screenMidY = cam.worldView.centerY;

        let x = bounds.centerX;
        let y = bounds.centerY;

        if (y < screenMidY) {
            y += 30;
        } else {
            y -= 30 + textObject.height;
        }

        if (x < screenMidX) {
            x += 20;
        } else {
            x -= 20 + textObject.width;
        }

        textObject.setText(typeof content === "function" ? content() : content);
        textObject.setPosition(x, y);
        textObject.setVisible(true);
    }
}
