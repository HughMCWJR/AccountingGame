import { GameObjects } from "phaser";

export class Ball extends GameObjects.Container {
    name;
    type;
    state = null;
    // The direction of the belt that the ball moves on...
    // ...so it doesn't change direction at intersections
    direction_belt_label = null;

    constructor(scene, x, y, name, type) {
        super(scene, x, y);
        //this.postFX.addBloom(0xffffff, 1, 1, 2, 1.2);
        this.name = name;
        this.type = type;

        this.scene = scene;

        let defaultBallSize = 60;

        // set the display width and height for the ball
        this.ballImage = new GameObjects.Image(scene, 0, 0, "ball");

        this.ballImage.setTintFill(0xffffff);

        //const textContent = this.formatTextToSquare(this.name + " - " + type);
        const textContent = this.formatTextToSquare(this.name);

        this.textLabel = new GameObjects.Text(scene, 0, 0, textContent, {
            fontSize: "14px",
            //fill: "#ffffff",
            fill: "#000000",
            stroke: "#000000",
            strokeThickness: 1,
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: { x: 4, y: 2 },
            align: "center",
            //wordWrap: { width: defaultBallSize * 0.9, useAdvancedWrap: true }
        });
        this.textLabel.setOrigin(0.5, 0.5);



        let textWidth = this.textLabel.width;
        let textHeight = this.textLabel.height;
        let newBallSize = defaultBallSize;

        if (textWidth > defaultBallSize * 0.9) {
            newBallSize = Math.max(newBallSize, textWidth / 0.9);
        }
        if (textHeight > defaultBallSize * 0.9) {
            newBallSize = Math.max(newBallSize, textHeight / 0.9);
        }

        // Update the ball image size.
        this.ballImage.displayWidth = newBallSize;
        this.ballImage.displayHeight = newBallSize;
        // Update the word wrap width so that the text adapts to the new ball size.
        this.textLabel.setWordWrapWidth(newBallSize * 0.9, true);

        this.add([this.ballImage, this.textLabel]);

        // add the ball to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // fix physics body
        // this.body.setSize(30, 30);
        this.hit_box_radius = newBallSize / 2;

        // set the ball properties
        //this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true); // make the ball collide with the world bounds
    }

    formatTextToSquare(text) {
        const totalLength = text.length;
        const linesCount = Math.ceil(Math.sqrt(totalLength));
        const maxLineLength = Math.ceil(totalLength / linesCount);
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        // split the word at the last "-" within the available range
        const trySplitWordAtHyphen = (word, available) => {
            // first find the last "-" within the available range (to make the prefix as long as possible)
            let idx = word.lastIndexOf('-', available - 1);
            if (idx !== -1) {
                return [word.substring(0, idx + 1), word.substring(idx + 1)];
            }
            // 如果在 available 范围内未找到，但单词中存在 "-"，则取第一个 "-" 作为断点
            idx = word.indexOf('-');
            if (idx !== -1) {
                return [word.substring(0, idx + 1), word.substring(idx + 1)];
            }
            return null;
        };

        for (let word of words) {
            // calculate the remaining available characters in the current line (if the current line is not empty, consider spaces)
            const available = currentLine.length === 0 ? maxLineLength : maxLineLength - currentLine.length - 1;

            if (word.length <= available) {
                // the whole word can be added to the current lineq
                currentLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
            } else if (word.indexOf('-') !== -1) {
                // word contains "-", try to split
                if (currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = '';
                }
                let remainingWord = word;
                let localAvailable = maxLineLength;
                // when the remaining part exceeds the length that one line can hold, try to split (may split multiple times)
                while (remainingWord.length > localAvailable) {
                    let splitResult = trySplitWordAtHyphen(remainingWord, localAvailable);
                    if (splitResult) {
                        lines.push(splitResult[0]);
                        remainingWord = splitResult[1];
                        localAvailable = maxLineLength;
                    } else {
                        // can not find a "-" to split, break the loop
                        break;
                    }
                }
                // the remaining part is the content of the current line (may not be a full line)
                currentLine = remainingWord;
            } else {
                // the word is too long to fit in the current line, add the current line to the lines array and start a new line
                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }
        if (currentLine.length > 0) {
            lines.push(currentLine);
        }
        return lines.join('\n');
    }

    start(texture = "ball") {
        // Change ball change texture
        // this.setTexture(texture);


        this.setActive(true);
        this.setVisible(true);
    }


    destroyBall() {
        // Destroy Ball
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
        this.state = null;

    }

    // Send to pit for player to retry with ball
    goToPit() {
        this.x = this.scene.ball_pit_x;
        this.y = this.scene.ball_pit_y;
    }

}