import { NONE, Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import { ConveyorBelt } from "../gameobjects/ConveyorBelt";

const TIME_MOVE_ACROSS_SCREEN = 600;

import { Ball } from "../gameobjects/Ball";
import { Basket } from "../gameobjects/Basket";
export class MainScene extends Scene {
    player = null;
    // Easy fix to make it where we can use same key for picking up and putting down
    player_dropped_ball_this_frame = false;
    enemy_blue = null;
    cursors = null;

    points = 0;
    game_over_timeout = 20;


    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 0;
        this.game_over_timeout = 20;

        //this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        //this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    create() {
        this.add.image(0, 0, "background")
            .setOrigin(0, 0);
        this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);

        // TO DO
        // Load from player choice
        let belts_chosen = [1, 2, 3, 4, 5];

        // Place Conveyor Belts and Vocab Baskets
        this.conveyor_belts = [];
        this.baskets = [];
        belts_chosen.forEach((belt_label) => {
            this.conveyor_belts.push(new ConveyorBelt(this));

            let num_belts = NONE
            if (belt_label == 1 || belt_label == 2 || belt_label == 3) {
                num_belts = this.scale.height / this.conveyor_belts[this.conveyor_belts.length - 1].height;
            } else if (belt_label == 4 || belt_label == 5) {
                num_belts = this.scale.width / this.conveyor_belts[this.conveyor_belts.length - 1].width;
            } else {
                throw new Error("Undefined Conveyor Belt Choice");
            }

            const BELT_WIDTH = this.conveyor_belts[this.conveyor_belts.length - 1].width;
            const BELT_HEIGHT = this.conveyor_belts[this.conveyor_belts.length - 1].height;

            // ___1___2___3___
            // |
            // 4
            // |
            // 5
            // |
            // belt_num: int - how many belts along it is (0 is the first one)
            function get_pos_from_belt_and_num(scene, belt_label, belt_num) {
                let x;
                let y;

                if (belt_label == 1 || belt_label == 2 || belt_label == 3) {
                    x = ((scene.scale.width / 4) * belt_label)
                    y = belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2)
                } else if (belt_label == 4 || belt_label == 5) {
                    y = ((scene.scale.height / 3) * (belt_label - 3))
                    x = belt_num * BELT_WIDTH + (BELT_WIDTH / 2)
                } else {
                    throw new Error("Undefined Conveyor Belt Choice");
                }

                return [x, y];
            }

            let [x, y] = get_pos_from_belt_and_num(this, belt_label, 0);
            this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_and_belt_label(x, y, belt_label);

            let belt_num = 1
            while (belt_num < num_belts - 1) {
                this.conveyor_belts.push(new ConveyorBelt(this));

                let [x, y] = get_pos_from_belt_and_num(this, belt_label, belt_num);

                this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_and_belt_label(x, y, belt_label);
                belt_num += 1;
            }
            
            // Place Basket
            let basket_x;
            let basket_y;

            if (belt_label == 1 || belt_label == 2 || belt_label == 3) {
                basket_x = ((this.scale.width / 4) * belt_label)
                basket_y = belt_num * BELT_HEIGHT + (BELT_HEIGHT / 2)
            } else if (belt_label == 4 || belt_label == 5) {
                basket_y = ((this.scale.height / 3) * (belt_label - 3))
                basket_x = belt_num * BELT_WIDTH + (BELT_WIDTH / 2)
            }

            this.baskets.push(new Basket(this, basket_x, basket_y, "red"));
        });

        // Vocab Balls
        this.balls = [new Ball(this, 100, 100, "ball", "red")];

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
            let belt_label = conveyor_belt.belt_label

            if (belt_label == 1 || belt_label == 3) {
                player_or_ball.y += scene.scale.height / TIME_MOVE_ACROSS_SCREEN;
            } else if (belt_label == 2) {
                player_or_ball.y -= scene.scale.height / TIME_MOVE_ACROSS_SCREEN;
            } else if (belt_label == 4) {
                player_or_ball.x -= scene.scale.width / TIME_MOVE_ACROSS_SCREEN;
            } else if (belt_label == 5) {
                player_or_ball.x += scene.scale.width / TIME_MOVE_ACROSS_SCREEN;
            } else {
                throw new Error("Undefined Conveyor Belt Choice");
            }
        }
        this.physics.add.overlap(this.conveyor_belts, this.player, (conveyor_belt, player) => move_along_conveyor_belt(this, conveyor_belt, player))
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

        // Allow player to pick up balls
        this.physics.add.overlap(this.balls, this.player, (ball, player) => {
            if (Phaser.Input.Keyboard.JustDown(this.keySpace) && Phaser.Math.Distance.Between(player.x, player.y, ball.x, ball.y) < 30) {
                if (player.picked_up_ball == null) {
                    if (!this.player_dropped_ball_this_frame) {
                        ball.pick(player);
                        console.log("Picked up");
                    }
                    this.player_dropped_ball_this_frame = false;
                }
            }
        })

        // // Overlap enemy with bullets
        // this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
        //     bullet.destroyBullet();
        //     this.enemy_blue.damage(this.player.x, this.player.y);
        //     this.points += 10;
        //     this.scene.get("HudScene")
        //         .update_points(this.points);
        // });

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
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.conveyor_belts.forEach((conveyor_belt) => { conveyor_belt.start() });
            //this.enemy_blue.start();
            this.player.start();
            this.balls.forEach((ball) => { ball.start() });
            this.baskets.forEach((basket) => { basket.start() });

            // Game Over timeout
            // this.time.addEvent({
            //     delay: 1000,
            //     loop: true,
            //     callback: () => {
            //         if (this.game_over_timeout === 0) {
            //             // You need remove the event listener to avoid duplicate events.
            //             this.game.events.removeListener("start-game");
            //             // It is necessary to stop the scenes launched in parallel.
            //             this.scene.stop("HudScene");
            //             this.scene.start("GameOverScene", { points: this.points });
            //         } else {
            //             this.game_over_timeout--;
            //             this.scene.get("HudScene").update_timeout(this.game_over_timeout);
            //         }
            //     }
            // });
        });
    }

    update() {
        this.conveyor_belts.forEach((conveyor_belt) => { conveyor_belt.update() });
        //this.enemy_blue.update();
        this.player.update();

        // Sprite ordering
        // TEMP?
        //this.bringToTop(player)
        this.balls.forEach((ball) => { ball.update() });

        // Player movement entries
        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }
        if (this.cursors.right.isDown) {
            this.player.move("right");
        }
        if (this.cursors.left.isDown) {
            this.player.move("left");
        }

        // d key to drop the ball
        this.cursors.space.on("down", () => {
            if (!this.player_picked_up_ball_this_frame) {
                if (this.player.picked_up_ball != null) {
                    this.player.picked_up_ball.drop();
                    console.log("Put down");
                    this.player_dropped_ball_this_frame = true;
                }
            }
        });

    }
}