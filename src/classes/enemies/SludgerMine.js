import { EnemyBase } from "../enemyBase.js";
import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { SludgerTest } from "./Sludger.js";

export class SludgerMineTest extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 24, 21, 0, NewMediaManager.Sprites.SludgerMine, velocityX, velocityY, 11, 4, playerShip, 5, 5, 2);

        this.TURN_ABILITY = 0.09;
        this.MAX_SPEED = 4;
        this.ACCELERATION = 0.1;
        

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 18;
        this.NUMBER_OF_ANIMATION_FRAMES = 8;
        // Start the animation at a random frame
        this.spriteXOffset = (Math.floor(Math.random() * this.NUMBER_OF_ANIMATION_FRAMES)) * this.width;
    }

    handleCollision(otherObject, objectManager) {
        // Sludger mines should ignore collisions with Sluders, other Sludermines, and the EnemyBase
        let isIgnorableType = otherObject instanceof SludgerTest || otherObject instanceof SludgerMineTest || otherObject instanceof EnemyBase

        if (!isIgnorableType) {
            super.handleCollision(otherObject, objectManager);
        }
    }

    updateState() {
        // Handle animation
        // TODO: This logic is the same as in the PlayerBase, make some sort of common function?
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            if (this.spriteXOffset >= (this.width * NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = 0;
            }
        }

        let angleToPlayer = this.angleTo(this.playerShipReference);
        let angleDifference = angleToPlayer - this.angle;
        this.angle += angleDifference;

        if (angleToPlayer <= this.angle + 0.1 || angleToPlayer > this.angle - 0.1) {
            this.calculateAcceleration();
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}