import { NONE, Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { ConveyorBelt } from "../gameobjects/ConveyorBelt";

import { Ball } from "../gameobjects/Ball";
import { Basket } from "../gameobjects/Basket";
import { TooltipManager } from "../gameobjects/Tooltips";
import * as XLSX from 'xlsx';

export const base_url = import.meta.env.VITE_API_URL;

const DEBIT = "Debit";
const CREDIT = "Credit";
const ASSETS = "Assets";
const LIABITILITIES = "Liabilities";
const STAKEHOLDERS_EQUITY = "Stakeholders Equity";
const EXPENSES = "Expenses";
const REVENUES = "Revenues";
const DESCRIPTION_MAP = new Map([
    [DEBIT, "Debit"],
    [CREDIT, "Credit"],
    [ASSETS, "A present right of an entity to an economic benefit."],
    [LIABITILITIES, "A present obligation that requires an entity to transferor otherwise provide economic benefits to others."],
    [STAKEHOLDERS_EQUITY, "The residual interest in the assets of anentity that remains after deducting its liabilities."],
    [EXPENSES, "Expenses are outflows or other using up of assets of anentity or incurrences of its liabilities (or a combination of both) from delivering orproducing goods, rendering services, or carrying out other activities"],
    [REVENUES, "Inflows or other enhancements of assets of an entityor settlements of its liabilities (or a combination of both) from delivering orproducing goods, rendering services, or carrying out other activities"],
]);

const NUM_BALLS_AT_TIME = 4;
export const RIGHT_FIRST_TIME_SCORE = 10;
export const RIGHT_NOT_FIRST_TIME_SCORE = 5;

const config = {
    // The following two are in secs
    time_limit: 90000,
    time_between_ball_spawns: 3000,
    // This is in frames
    time_move_across_screen: 500
}

export class MainScene extends Scene {
    player = null;
    // Easy fix to make it where we can use same key for picking up and putting down
    player_dropped_ball_this_frame = false;
    enemy_blue = null;
    cursors = null;

    points;
    game_over_timeout;

    config = config

    constructor() {
        super("MainScene");
    }

    init(data) {
        this.ballCount = 0;
        this.cameras.main.fadeIn(1000, 0, 0, 0);


        if (!this.normalBalance || !this.allSheet) {
            // Load the Excel file from the cache
            const binary = this.cache.binary.get('excelData');
            const workbook = XLSX.read(binary, { type: 'array' });

            // Parse the sheets into JSON format
            this.normalBalance = XLSX.utils.sheet_to_json(workbook.Sheets["Normal Balance"] ?? {}, { header: 1 });
            this.allSheet = XLSX.utils.sheet_to_json(workbook.Sheets["All"] ?? {}, { header: 1 });
        }

        const NUM_BALLS = Math.ceil(this.config.time_limit / this.config.time_between_ball_spawns);
        const game_type = data.type || "accounting"; // "debit_credit" or "accounting"
        if (game_type == "debit_credit") {
            this.elements = this.getRandomNBElements(NUM_BALLS);
            this.config.basket_types = [DEBIT, CREDIT];
            this.config.belt_types = [NONE, NONE, NONE, DEBIT, CREDIT];
            this.config.belt_labels = [4, 5];
        }
        else if (game_type == "accounting") {
            this.elements = this.getRandomAllElements(NUM_BALLS);
            this.config.basket_types = [ASSETS, LIABITILITIES, STAKEHOLDERS_EQUITY, REVENUES, EXPENSES];
            this.config.belt_types = [ASSETS, LIABITILITIES, STAKEHOLDERS_EQUITY, REVENUES, EXPENSES];
            this.config.belt_labels = [1, 2, 3, 4, 5];
        }

        this.answer_stats = new Map(
            this.config.basket_types.map((type, index) => [type, { correct: 0, incorrect: 0 }])
        );

        // Reset points
        this.points = 0;
        this.game_over_timeout = this.config.time_limit / 1000;

        this.scene.launch("MenuScene");

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.input.addPointer();
        this.mouse_down_last_frame = false;

        // Store for each pit, whether it is full or not
        this.pit_fullnesses = [false, false, false, false];

        this.tooltip = new TooltipManager(this);
    }

    addBall() {
        if (this.ballCount < this.elements.length) {
            if (this.balls.getLength() < NUM_BALLS_AT_TIME) {
                let starting_conveyor_belt = this.starting_conveyor_belts[Math.floor(Math.random() * this.starting_conveyor_belts.length)];

                let ball = new Ball(this, starting_conveyor_belt.x, starting_conveyor_belt.y, this.elements[this.ballCount].name, this.elements[this.ballCount].type, this.difficulty);
                let hit_box_radius = Math.min(ball.hit_box_radius, this.ball_pit_height / 5 * 2);
                ball.body.setCircle(hit_box_radius);
                ball.body.offset.x = -hit_box_radius;
                ball.body.offset.y = -hit_box_radius;
                ball.start();
                this.balls.add(ball);
                this.ballCount++;
            }
        } else {
            throw new Error("Ran out of balls");
        }
    }

    // Found overlap betwene ball and basket, check what to do
    checkForBall(ball, basket) {

        if (ball.state != "picked" && ball.pit_number == null) {
            if (ball.type === basket.type.toLowerCase()) {
                this.points += ball.been_in_wrong_basket ? RIGHT_NOT_FIRST_TIME_SCORE : RIGHT_FIRST_TIME_SCORE;
                this.scene.get("HudScene").update_points(this.points);
                ball.destroyBall(); // destroy the ball
                this.answer_stats.get(basket.type).correct += 1; // update the correct count for the basket type`
                this.sound.play('correct', {
                    volume: 1
                });
            } else {
                this.sound.play('error', {
                    volume: 1
                });
                ball.goToPit();
                this.answer_stats.get(basket.type).incorrect += 1; // update the incorrect count for the basket type
            }
        }

    }

    getRandomNBElements(total) {
        const credits = this.normalBalance.map(row => row?.[1]).filter(Boolean);
        const debits = this.normalBalance.map(row => row?.[0]).filter(Boolean);
        const [creditNum, debitNum] = this.generateRandomNumbers(total, 2, false);

        const creditSamples = this.sample(credits, creditNum).map(name => ({ name, type: "credit" }));
        const debitSamples = this.sample(debits, debitNum).map(name => ({ name, type: "debit" }));

        return this.shuffle([...creditSamples, ...debitSamples]);
    }

    getRandomAllElements(total) {
        const typeNames = ["assets", "liabilities", "stakeholders_equity", "expenses", "revenues"];
        const colCount = this.allSheet[0]?.length ?? 0;
        const typeNums = this.generateRandomNumbers(total, colCount, false);

        return this.shuffle(
            Array.from({ length: colCount }).flatMap((_, i) => {
                const col = this.allSheet.map(row => row?.[i]).filter(Boolean);
                return this.sample(col, typeNums[i]).map(name => ({
                    name,
                    type: typeNames[i] ?? `type${i}`,
                }));
            })
        );
    }

    // 实用工具函数们
    sample(arr, count) {
        return arr.slice().sort(() => Math.random() - 0.5).slice(0, count);
    }

    shuffle(arr) {
        return arr.slice().sort(() => Math.random() - 0.5);
    }

    generateRandomNumbers(sum, count, equal = true) {
        if (equal) {
            return Array(count).fill(Math.ceil(sum / count));
        }
        const points = Array.from({ length: count - 1 }, () => Math.floor(Math.random() * (sum - count + 1))).sort((a, b) => a - b);
        points.unshift(0); points.push(sum);
        return Array.from({ length: count }, (_, i) => points[i + 1] - points[i]);
    }



    create() {
        if (this.sound.locked) {
            this.sound.once('unlocked', () => {
                this.game.musicManager.play(this,
                    'game_bgm');
            });
        } else {
            this.game.musicManager.play(this, 'game_bgm');
        }
        this.add.image(0, 0, "background")
            .setOrigin(0, 0);



        // TO DO
        // Load from player choice
        //let belts_chosen = [1, 2, 3, 4, 5];
        //let belt_types = [ASSETS, LIABITILITIES, STAKEHOLDERS_EQUITY, REVENUES, EXPENSES];

        // DEBIT VS CREDIT
        let belts_chosen = this.config.belt_labels;
        let belt_types = this.config.belt_types;

        // Place Conveyor Belts and Vocab Baskets
        this.conveyor_belts = [];
        this.baskets = [];
        this.starting_conveyor_belts = [];
        belts_chosen.forEach((belt_label) => {
            this.conveyor_belts.push(new ConveyorBelt(this));

            // Assumes default sprite for ConveyorBelt is up/down
            const BELT_WIDTH = this.conveyor_belts[this.conveyor_belts.length - 1].width;
            const BELT_HEIGHT = this.conveyor_belts[this.conveyor_belts.length - 1].height;

            let num_belts = NONE
            if (belt_label == 1 || belt_label == 2 || belt_label == 3) {
                num_belts = this.scale.height / BELT_HEIGHT;
            } else if (belt_label == 4 || belt_label == 5) {
                num_belts = this.scale.width / BELT_HEIGHT;
            } else {
                throw new Error("Undefined Conveyor Belt Choice");
            }

            // ___1___2___3___
            // |  ^   v   v
            // 4>
            // |
            // 5<
            // |
            // belt_num: int - how many belts along it is (0 is the first one)
            function get_pos_from_belt_and_num(scene, belt_label, belt_num) {
                let x;
                let y;

                if (belt_label == 2 || belt_label == 3) {
                    x = ((scene.scale.width / 4) * belt_label)
                    y = belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2)
                } else if (belt_label == 1) {
                    x = ((scene.scale.width / 4) * belt_label)
                    y = scene.scale.height - (belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2))
                } else if (belt_label == 5) {
                    y = ((scene.scale.height / 3) * (belt_label - 3))
                    x = belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2)
                } else if (belt_label == 4) {
                    y = ((scene.scale.height / 3) * (belt_label - 3))
                    x = scene.scale.width - (belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2))
                } else {
                    throw new Error("Undefined Conveyor Belt Choice");
                }

                return [x, y];
            }

            let [x, y] = get_pos_from_belt_and_num(this, belt_label, 0);
            this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_and_belt_label(x, y, belt_label);
            this.starting_conveyor_belts.push(this.conveyor_belts[this.conveyor_belts.length - 1]);

            let belt_num = 1
            while (belt_num < num_belts - 2) {
                this.conveyor_belts.push(new ConveyorBelt(this));

                let [x, y] = get_pos_from_belt_and_num(this, belt_label, belt_num);

                this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_and_belt_label(x, y, belt_label);
                belt_num += 1;
            }

            // Place Basket
            let basket_x;
            let basket_y;
            [basket_x, basket_y] = get_pos_from_belt_and_num(this, belt_label, belt_num);
            let basket = new Basket(this, basket_x, basket_y, belt_types[belt_label - 1]);
            this.tooltip.attachTo(basket, DESCRIPTION_MAP.get(belt_types[belt_label - 1]));
            this.baskets.push(basket);

        });

        // Reverse rendering order
        this.conveyor_belts.forEach((belt) => {
            if (belt.belt_label == 1 || belt.belt_label == 2 || belt.belt_label == 3) {
                this.children.bringToTop(belt);
            }
        })
        // Fix it so baskets are in front
        this.baskets.forEach((basket) => {
            this.children.bringToTop(basket);
        })

        const BELT_WIDTH = this.conveyor_belts[0].width;
        const BELT_HEIGHT = this.conveyor_belts[0].height;

        // Create ball return pits
        // (0 is the leftmost pit, there are four pits)
        this.get_ball_pit_x = (ball_pit_num) => (this.scale.width / 4) * (ball_pit_num + 0.5);
        this.ball_pit_y = (this.scale.height / 3) * 1.5;
        this.ball_pit_width = (this.scale.width / 4) - BELT_WIDTH;
        this.ball_pit_height = (this.scale.height / 3) - BELT_WIDTH;

        // Start ball spawning
        this.balls = this.add.group();


        // Enemy
        // this.enemy_blue = new BlueEnemy(this);

        // Player
        this.player = new Player({ scene: this });

        // Cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.cursors.space.on("down", () => {
        //     this.player.fire();
        // });
        // this.input.on("pointerdown", (pointer) => {
        //     this.player.fire(pointer.x, pointer.y);
        // });

        // Overlap player or ball with conveyor belts
        function move_along_conveyor_belt(scene, conveyor_belt, player_or_ball) {
            let { belt_label } = conveyor_belt

            if (player_or_ball.state === "picked" || player_or_ball.moved_by_belt_this_frame) {
                return;
            } // Ball already picked

            player_or_ball.moved_by_belt_this_frame = true;

            if (belt_label == 2 || belt_label == 3) {
                player_or_ball.y += scene.scale.height / config.time_move_across_screen;
            } else if (belt_label == 1) {
                player_or_ball.y -= scene.scale.height / config.time_move_across_screen;
            } else if (belt_label == 4) {
                player_or_ball.x -= scene.scale.width / config.time_move_across_screen;
            } else if (belt_label == 5) {
                player_or_ball.x += scene.scale.width / config.time_move_across_screen;
            } else {
                throw new Error("Undefined Conveyor Belt Choice");
            }
        }

        //this.physics.add.overlap(this.conveyor_belts, this.player, (conveyor_belt, player) => move_along_conveyor_belt(this, conveyor_belt, player))
        this.physics.add.overlap(this.conveyor_belts, this.balls, (conveyor_belt, ball) => {
            if (ball.state !== "picked") {
                // Check if ball's direction belt label needs to be set
                if (ball.direction_belt_label == null) {
                    ball.direction_belt_label = conveyor_belt.belt_label;
                }

                // Only move balls of this belt
                if (conveyor_belt.belt_label == ball.direction_belt_label) {
                    move_along_conveyor_belt(this, conveyor_belt, ball)
                }
            }
        });
        this.physics.add.overlap(this.balls, this.baskets, (ball, basket) => { this.checkForBall(ball, basket) });

        // Overlap enemy with bullets
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.points += 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // // Overlap player with enemy bullets
        // this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
        //     bullet.destroyBullet();
        //     this.cameras.main.shake(100, 0.01);
        //     // Flash the color white for 300ms
        //     this.cameras.main.flash(300, 255, 10, 10, false,);
        //     this.points -= 10;
        //     this.scene.get("HudScene")
        //         .update_points(this.points);
        // });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.difficulty = parseInt(localStorage.getItem('difficulty') || 1);
            this.time.addEvent({
                delay: this.config.time_between_ball_spawns, // happens every 2 seconds
                callback: this.addBall,
                callbackScope: this,
                loop: true
            });
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.conveyor_belts.forEach((conveyor_belt) => { conveyor_belt.start() });
            //this.enemy_blue.start();
            this.player.start();
            // this.balls.forEach((ball) => { ball.start() });

            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        // You need remove the event listener to avoid duplicate events.
                        // It is necessary to stop the scenes launched in parallel.
                        this.game.events.emit("exit-game");
                        this.scene.start("GameOverScene", { points: this.points });
                    } else {
                        this.game_over_timeout--;
                        this.scene.get("HudScene").update_timeout(this.game_over_timeout);
                    }
                }
            });
        });
        this.game.events.on("exit-game", () => {
            this.game.events.removeListener("start-game");
            this.scene.stop("HudScene");
        });


    }

    update(time, delta) {
        this.conveyor_belts.forEach((conveyor_belt) => { conveyor_belt.update(time, delta) });
        //this.enemy_blue.update();
        this.player.update(time, delta);
        this.balls.getChildren().forEach((ball) => { ball.update(time, delta) });

        // Sprite ordering
        // TEMP?
        //this.bringToTop(player)
        //this.balls.children.iterate((ball) => {
        //ball.update(); // Update each ball
        //})

        // Player movement entries
        if (this.cursors.up.isDown || this.W.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown || this.S.isDown) {
            this.player.move("down");
        }
        if (this.cursors.right.isDown || this.D.isDown) {
            this.player.move("right");
        }
        if (this.cursors.left.isDown || this.A.isDown) {
            this.player.move("left");
        }

        // Player movement and screen wrap
        const { width, height } = this.sys.canvas;

        if (this.player.x - this.player.width / 2 > width) {
            this.player.x = -this.player.width / 2;
        } else if (this.player.x + this.player.width / 2 < 0) {
            this.player.x = width + this.player.width / 2;
        }

        if (this.player.y - this.player.height / 2 > height) {
            this.player.y = -this.player.height / 2;
        } else if (this.player.y + this.player.height / 2 < 0) {
            this.player.y = height + this.player.height / 2;
        }


        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            // stop the main scene
            this.scene.pause();
            this.scene.launch("PauseScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.keySpace) || (this.input.activePointer.primaryDown && !this.mouse_down_last_frame)) {

            this.mouse_down_last_frame = this.input.activePointer.primaryDown;

            if (this.player.ball && this.player.ball.state === "picked") {
                this.player.drop();
                return
            }
            //let ball = this.physics.closest(this.player, this.balls.getChildren());
            let picked_up_ball = false;
            this.balls.getChildren().forEach((ball) => {
                if (picked_up_ball) {
                    return;
                }

                let player_bounds = this.player.getBounds();
                let ball_bounds = ball.getBounds();
                // if (Phaser.Math.Distance.Between(this.player.x, this.player.y, ball.x, ball.y) < 30) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(ball_bounds, player_bounds)) {
                    this.player.pick(ball);
                    picked_up_ball = true;
                }
            })
        } else {
            this.mouse_down_last_frame = this.input.activePointer.primaryDown;
        };

    }
}