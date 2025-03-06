// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // Load all the assets
        this.load.setPath("assets");
        this.load.image("logo", "logo.png");
        this.load.image("background", "background.png");

        this.load.image("player", "player/aubie.png");
        // this.load.atlas("propulsion-fire", "player/propulsion/propulsion-fire.png", "player/propulsion/propulsion-fire_atlas.json");
        // this.load.animation("propulsion-fire-anim", "player/propulsion/propulsion-fire_anim.json");

        // Conveyor Belts
	    this.load.image("belt", "objects/conveyor-belt/Conveyor_Belt_Base.png")
        this.load.atlas("up-belt", "objects/conveyor-belt/up-belt/up-belt.png", "objects/conveyor-belt/up-belt/up-belt_atlas.json");
        this.load.animation("up-belt-anim", "objects/conveyor-belt/up-belt/up-belt_anim.json");
        this.load.atlas("down-belt", "objects/conveyor-belt/down-belt/down-belt.png", "objects/conveyor-belt/down-belt/down-belt_atlas.json");
        this.load.animation("down-belt-anim", "objects/conveyor-belt/down-belt/down-belt_anim.json");
        this.load.atlas("right-belt", "objects/conveyor-belt/right-belt/right-belt.png", "objects/conveyor-belt/right-belt/right-belt_atlas.json");
        this.load.animation("right-belt-anim", "objects/conveyor-belt/right-belt/right-belt_anim.json");
        this.load.atlas("left-belt", "objects/conveyor-belt/left-belt/left-belt.png", "objects/conveyor-belt/left-belt/left-belt_atlas.json");
        this.load.animation("left-belt-anim", "objects/conveyor-belt/left-belt/left-belt_anim.json");

        // Bullets
        this.load.image("bullet", "player/bullet.png");
        this.load.image("flares")

        // Balls
        this.load.image("ball", "ball.png");

        // basket
        this.load.image("basket", "box.png");

        // Enemies
        this.load.atlas("enemy-blue", "enemies/enemy-blue/enemy-blue.png", "enemies/enemy-blue/enemy-blue_atlas.json");
        this.load.animation("enemy-blue-anim", "enemies/enemy-blue/enemy-blue_anim.json");
        this.load.image("enemy-bullet", "enemies/enemy-bullet.png");

        // Fonts
        this.load.bitmapFont("pixelfont", "fonts/pixelfont.png", "fonts/pixelfont.xml");
        this.load.image("knighthawks", "fonts/knight3.png");

        // Event to update the loading bar
        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {
        // Create bitmap font and load it in cache
        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        // When all the assets are loaded go to the next scene
        this.scene.start("SplashScene");
    }
}
