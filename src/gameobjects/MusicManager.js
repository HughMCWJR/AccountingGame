export default class MusicManager {
    constructor(game) {
        this.game = game;
        this.currentMusic = null;
        this.currentKey = null;
    }

    play(scene, key, config = { loop: true, volume: 0.8 }) {
        // avoid playing the same music
        if (this.currentKey === key && this.currentMusic?.isPlaying) {
            return;
        }

        // stop current music
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.stop();
        }

        // create new music
        const newMusic = scene.sound.add(key, config);
        newMusic.play();

        // set current music
        this.currentMusic = newMusic;

        this.currentKey = key;
    }

    stop() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.stop();
        }
        this.currentKey = null;
    }

    pause() {
        if (this.currentMusic?.isPlaying) {
            this.currentMusic.pause();
        }
    }

    resume() {
        if (this.currentMusic?.isPaused) {
            this.currentMusic.resume();
        }
    }

    isPlaying() {
        return this.currentMusic?.isPlaying || false;
    }

    setVolume(volume) {
        if (this.currentMusic) {
            this.currentMusic.setVolume(volume);
        }
    }
}
