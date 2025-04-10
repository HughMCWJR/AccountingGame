import { Game } from "phaser";
import { Preloader } from "./preloader";
import { GameOverScene } from "./scenes/GameOverScene";
import { HudScene } from "./scenes/HudScene";
import { MainScene } from "./scenes/MainScene";
import { MenuScene } from "./scenes/MenuScene";
import { SplashScene } from "./scenes/SplashScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { PauseScene } from "./scenes/PauseScene";
import { SettingsScene } from "./scenes/SettingScene";
import MusicManager from './gameobjects/MusicManager';
// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 960,
    height: 540,
    backgroundColor: "#1c172e",
    pixelArt: true,
    roundPixel: false,
    max: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [
        Preloader,
        SplashScene,
        MainScene,
        MenuScene,
        HudScene,
        GameOverScene,
        MainMenuScene,
        PauseScene,
        SettingsScene,
    ]
};

const game = new Game(config);
game.musicManager = new MusicManager(game);