import { DocumentManager } from "./DocumentManager.js";
import { GameManager } from "./GameManager.js";
import { Layer } from "./Layer.js";
import { MediaManager } from "./MediaManager.js";

export class LevelManager {
    static level;
    static spawnStack = [];
    static LEVEL_COMPLETION_SCORE_BONUS = 100;
    static delayFrameCount = 0;
    static inNextLevelDelay = false;
    static DELAY_UNTIL_NEXT_LEVEL = 1 * 60;
    
    static initializeGame() {
        this.setLevel(1);
    }

    static setLevel(level) {
        this.level = level;

        DocumentManager.updateLevel(this.level);
        this.addEnemiesToSpawnQueueForCurrentLevel();
    }

    incrementLevel() {
        this.setLevel(this.level + 1);
    }

    // FUTURE TODO: When Hammerhead is added into the game that will need to be added here too
    static addEnemiesToSpawnQueueForCurrentLevel() {
        let numberOfEnemiesToSpawn = this.level + 4;

        for (let i = 0; i < numberOfEnemiesToSpawn; i++) {
            let random = Math.random();
            if (this.level < 4) {
                /*
                    Odds of spawning:
                    QuadBlaster: 40%
                    Sludger: 30%
                    Puffer: 30%
                */
               if (random < .4) {
                    this.spawnStack.push(Layer.QUAD_BLASTER);
               } else if (random < .7) {
                    this.spawnStack.push(Layer.SLUDGER);
               } else {
                   this.spawnStack.push(Layer.PUFFER);
               }
            } else {
                /*
                    Once level is 4 or higher, add chance of slicer spawning in

                    Odds of spawning:
                    QuadBlaster: 35%
                    Sludger: 30%
                    Puffer: 30%
                    Slicer: 5%
                */
                if (random < .35) {
                    this.spawnStack.push(Layer.QUAD_BLASTER);
                } else if (random < .65) {
                    this.spawnStack.push(Layer.SLUDGER);
                } else if (random < .95) {
                    this.spawnStack.push(Layer.PUFFER);
                } else {
                    this.spawnStack.push(Layer.SLICER);
                }
            }
        }
    }

    static getCurrentLevelCompletionScoreBonus() {
        return this.level * this.levelCompletionScoreBonus;
    }

    static shouldActivateNextLevel() {
        return this.spawnStack.length === 0 && GameManager.enemiesRemaining() === 0;
    }

    static activateNextLevel() {
        // Add to player score, before we set the next level
        GameManager.playerShip.addToScore(this.LEVEL_COMPLETION_SCORE_BONUS * this.level)

        // Set the next level
        this.setLevel(this.level + 1);

        // Give the player a message telling them what level they are on
        GameManager.displayMessage(`Level ${this.level}`, 3 * 60);

        // Play new level sound
        MediaManager.Audio.NewLevel.play();

        // 20% chance to spawn a new powerup
        if (Math.random() < .2) {
            GameManager.spawnRandomPowerup();
        }
    }

    static update(frameCount) {
        if (this.shouldActivateNextLevel()) {
            if (this.inNextLevelDelay) {
                this.delayFrameCount += frameCount;
                if (this.delayFrameCount >= this.DELAY_UNTIL_NEXT_LEVEL) {
                    this.activateNextLevel();
                    this.delayFrameCount = 0;
                    this.inNextLevelDelay = false;
                }
            } else {
                this.inNextLevelDelay = true;
            }
        }
    }
}