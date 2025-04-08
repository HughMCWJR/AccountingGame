import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // according to the id of the module, split the code into different chunks
                    if (id.includes('phaser')) {
                        return 'phaser';
                    }
                    if (id.includes('axios')) {
                        return 'axios';
                    }
                }
            }
        }
    }
});
