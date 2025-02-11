import { NONE, Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import { ConveyorBelt } from "../gameobjects/ConveyorBelt";

const TIME_MOVE_ACROSS_SCREEN = 400;

export class MainScene extends Scene {
    player = null;
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
    }

    create() {
        this.add.image(0, 0, "background")
            .setOrigin(0, 0);
        this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);

        // TO DO
        // Load from player choice
        let belts_chosen = [1, 2, 3, 4, 5];

        // Conveyor Belts
        this.conveyor_belts = [];
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

            this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_by_belt_and_num(belt_label, 0);

            let belt_num = 1
            while (belt_num < num_belts) {
                this.conveyor_belts.push(new ConveyorBelt(this));
                this.conveyor_belts[this.conveyor_belts.length - 1].set_pos_by_belt_and_num(belt_label, belt_num);
                belt_num += 1;
            }
        });

        // Enemy
        this.enemy_blue = new BlueEnemy(this);

        // Player
        this.player = new Player({ scene: this });

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });
        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });

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



        // Overlap enemy with bullets
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.points += 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // Overlap player with enemy bullets
        this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
            bullet.destroyBullet();
            this.cameras.main.shake(100, 0.01);
            // Flash the color white for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false,);
            this.points -= 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.conveyor_belts.forEach((conveyor_belt) => {conveyor_belt.start()});
            this.enemy_blue.start();
            this.player.start();

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
        this.conveyor_belts.forEach((conveyor_belt) => {conveyor_belt.update()});
        this.enemy_blue.update();
        this.player.update();

        // Sprite ordering
        // TEMP?
        //this.bringToTop(player)

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

    }
}