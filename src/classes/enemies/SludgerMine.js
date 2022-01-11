import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";

export class SludgerMine extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, Layer.SLUDGER_MINE, 24, 21, 0, NewMediaManager.Sprites.SludgerMine, velocityX, velocityY, 11, 4, playerShip, 5, 5, 2);

        this.TURN_ABILITY = 0.09;
        this.MAX_SPEED = 4;
        this.ACCELERATION = 0.1;
        

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 18;
        this.NUMBER_OF_ANIMATION_FRAMES = 8;
        // Start the animation at a random frame
        this.spriteXOffset = (Math.floor(Math.random() * this.NUMBER_OF_ANIMATION_FRAMES)) * this.width;
    }

    playDeathSound() {
        // Override method to play the sludger mine specific death sound
        NewMediaManager.Audio.SludgerMinePop.play();
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