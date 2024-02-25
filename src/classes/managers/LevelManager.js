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
    /* To keep the game from getting too easy/boring at the end of each level there should be a minimum number of enemies present in the world
        that the level manager keeps track of and uses to determine when to start a next level. 
        To start, during level 1 add this many extra enemies to the game. Then, when determing when the next level should occur the spawn stack
        should be empty and there should be either this many enemies or less still alive. In this way, the next level can start and new enemies
        can start spawning before all of the enemies have been destroyed from the world, making it so it is not too easy for the player at the
        end of a level.
    */
    static MINIMUM_ENEMIES_IN_WORLD = 3;
    
    static initializeGame() {
        this.setLevel(1);
    }

    static setLevel(level) {
        this.level = level;

        DocumentManager.updateLevel(this.level);
        this.addEnemiesToSpawnQueueForCurrentLevel();
    }

    // FUTURE TODO: When Hammerhead is added into the game that will need to be added here too
    static addEnemiesToSpawnQueueForCurrentLevel() {
        let numberOfEnemiesToSpawn = this.level + 4;
        if (this.level === 1) {
            numberOfEnemiesToSpawn += this.MINIMUM_ENEMIES_IN_WORLD;
        }

        for (let i = 0; i < numberOfEnemiesToSpawn; i++) {
            let random = Math.random();
            if (this.level < 4) {
                /*
                    Odds of spawning:
                    QuadBlaster: 30%
                    Sludger: 25%
                    Puffer: 20%
                    Hammerhead: 25%
                */
               if (random < .3) {
                    this.spawnStack.push(Layer.QUAD_BLASTER);
               } else if (random < .55) {
                    this.spawnStack.push(Layer.SLUDGER);
               } else if (random < .75) {
                   this.spawnStack.push(Layer.PUFFER);
               } else {
                    this.spawnStack.push(Layer.HAMMERHEAD);
               }
            } else {
                /*
                    Once level is 4 or higher, add chance of slicer spawning in

                    Odds of spawning:
                    QuadBlaster: 29%
                    Sludger: 24%
                    Puffer: 19%
                    Hammerhead: 24%
                    Slicer: 4%
                */
                if (random < .29) {
                    this.spawnStack.push(Layer.QUAD_BLASTER);
                } else if (random < .53) {
                    this.spawnStack.push(Layer.SLUDGER);
                } else if (random < .72) {
                    this.spawnStack.push(Layer.PUFFER);
                } else if (random < .96) {
                    this.spawnStack.push(Layer.HAMMERHEAD);
                } else {
                    this.spawnStack.push(Layer.SLICER);
                }
            }
        }
    }

    static shouldActivateNextLevel() {
        return this.spawnStack.length === 0 && GameManager.enemiesRemaining() <= this.MINIMUM_ENEMIES_IN_WORLD;
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
        if (Math.random() < .75) {
            GameManager.spawnRandomPowerup();
        }
    }

    static update(frameCount) {
        if (this.shouldActivateNextLevel()) {
            // Next level delay is used to create a slight delay between an enemy being killed and starting the next level
            // This also helps prevent the enemy death sound and next level sound from overlapping
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