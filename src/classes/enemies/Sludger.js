import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { SludgerMine } from "./SludgerMine.js";

export class Sludger extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, Layer.SLUDGER, 34, 31, 0, NewMediaManager.Sprites.Sludger, velocityX, velocityY, 16, 8, playerShip, 10, 10, 25);

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 7;
        this.NUMBER_OF_ANIMATION_FRAMES = 15;

        this.numberOfTicksSinceSpawnedMine = 0;
        // A new mine should be spawned in every 5 seconds
        this.MINE_SPAWN_TIME = 5 * 60;
    }

    updateState() {
        // Handle animation
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            if (this.spriteXOffset >= (this.width * this.NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = 0;
            }
        }

        // Update position
        this.x += this.velocityX;
        this.y+= this.velocityY;

        // Spawn new sludger mines
        this.numberOfTicksSinceSpawnedMine++;
        if (this.numberOfTicksSinceSpawnedMine > this.MINE_SPAWN_TIME) {
            this.numberOfTicksSinceSpawnedMine = 0;
            let newSludgerMine = new SludgerMine(this.x, this.y, 0, 0, this.playerShipReference);
            ObjectManager.addObject(newSludgerMine, true);
        }
    }
}