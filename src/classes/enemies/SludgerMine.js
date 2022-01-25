import { Vector } from "../../utility/Vector.js";
import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/MediaManager.js";

export class SludgerMine extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        // According to gameplay footage killing a SludgerMine was worth 2 points
        super(xLocation, yLocation, Layer.SLUDGER_MINE, 24, 21, 0, NewMediaManager.Sprites.SludgerMine, velocityX, velocityY, 11, 4, playerShip, 20, 20, 2);

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

        let angleDiff = this.angleDiffTo(this.playerShipReference);
        // only move the mine angle toward player as fast as the turn ability will allow.
        if (angleDiff > 0) {
            if (this.TURN_ABILITY > angleDiff) {
                // only turn angle difference
                this.angle += angleDiff;
            } else { 
                // turn maximum amount possible
                this.angle += this.TURN_ABILITY;
            }
        } else {
            // Will handle if angleDiff = 0 since this next statement will be guaranteed to be true so we will add angleDiff to the angle, which would be 0 (meaning the angle would not change)
            if (-1 * this.TURN_ABILITY < angleDiff) {
                // only turn angle difference
                // Note that the angle different here is already negative
                this.angle += angleDiff;
            } else { 
                // turn maximum amount possible
                this.angle += -1 * this.TURN_ABILITY;
            }
        }

        // Keep angle between 0 and 2 * Math.PI
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        } else if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (this.angle > 2 * Math.PI || this.angle < 0) {
            this.error(`Slicer angle ${this.angle} was outside of the expected range`);
        }

        // Only accelerate if we close enough to pointing at what we are targeting
        if (angleDiff > -0.1 && angleDiff < 0.1) {
            this.calculateAcceleration();
        }

        // slow down object in perpendicular direction to help prevent "orbiting"
        let vectorToPlayer = new Vector(this.playerShipReference.x - this.x, this.playerShipReference.y - this.y);
        let velocity = new Vector(this.velocityX, this.velocityY);
        let perpendicularVelocity = velocity.subtract(vectorToPlayer.normalize().scale(velocity.dotProduct(vectorToPlayer.normalize())));
        // reduce perpendicular speed by 1%
        let dampeningAmount = perpendicularVelocity.scale(-.01);

        this.velocityX += dampeningAmount.x;
        this.velocityY += dampeningAmount.y;

        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}