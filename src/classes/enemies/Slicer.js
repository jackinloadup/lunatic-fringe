import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../NewMediaManager.js";

export class SlicerTest extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 50, 50, 0, NewMediaManager.Sprites.Slicer, velocityX, velocityY, 14, 50, playerShip, 25, 100, 100);

        this.TURN_ABILITY = 0.3;
        this.MAX_SPEED = 10;
        this.ACCELERATION = 0.175;
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better

        this.NUMBER_OF_ANIMATION_FRAMES = 26;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
    }

    handleCollision(otherObject, objectManager) {
        // Slicers should ignore collisions with other Slicers and the enemy base
        let isIgnorableType = otherObject instanceof SlicerTest || otherObject instanceof EnemyBase

        if (!isIgnorableType) {
            super.handleCollision(otherObject, objectManager);
        }
    }

    updateState() {
        let angleDiff = this.angleDiffTo(this.playerShipReference);

        // only move the ship angle toward player as fast as the turn ability will allow.
        // If turn angle is greater than the actual angle to the player, only turn to the actual angle to the player
        // TODO: Check this logic. It be sus.
        if (angleDiff > 0) {
            if (turnAbility > angleDiff) {
                // only turn angle difference
                this.angle += angleDiff;
            } else { 
                // turn maximum amount possible
                this.angle += turnAbility;
            }
        } else {
            if (-1*turnAbility < angleDiff) {
                this.angle -= -1*angleDiff;
            } else { 
                this.angle -= turnAbility;
            }
        }
        // TODO: Add logic for not changing angle when different is 0?

        // Calculate the Slicer animation frame to show
        let frameAngle = this.angle+Math.PI/2;
        // TODO: Fix this. This makes it so that each frame is not centered based on the angle the frame represents, the frame is on the boundary of the allowed angles for the frame.
        let frame = Math.floor(frameAngle/rotationAmount);

        if (frame < 0) {
            frame += this.NUMBER_OF_ANIMATION_FRAMES;
        }

        this.spriteXOffset = this.width * frame;

        if (angleDiff <= this.angle + 0.1 || angleDiff > this.angle - 0.1) {
            this.calculateAcceleration();
        }

        //Update position of Slicer
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}