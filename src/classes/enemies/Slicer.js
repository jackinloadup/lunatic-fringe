import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";

export class Slicer extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, Layer.SLICER, 50, 50, 0, NewMediaManager.Sprites.Slicer, velocityX, velocityY, 14, 50, playerShip, 25, 100, 100);

        this.TURN_ABILITY = 0.3;
        this.MAX_SPEED = 10;
        this.ACCELERATION = 0.175;

        this.NUMBER_OF_ANIMATION_FRAMES = 26;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
    }

    updateState() {
        let angleDiff = this.angleDiffTo(this.playerShipReference);

        // only move the ship angle toward player as fast as the turn ability will allow.
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

        // Keep angle between -Math.PI and Math.PI
        if (this.angle > Math.PI) {
            this.angle -= 2 * Math.PI;
        } else if (this.angle < -Math.PI) {
            this.angle += 2 * Math.PI;
        }

        // Calculate which frame of the sprite. Note the following reasons for each part of the calculation:
        // +(Math.PI / 2): The sprite for the Slicer starts straight up, so an angle offset of Math.PI/2 (a quarter rotation of a circle) is needed for this calculation so that the correct frame is chosen since an angle of 0 is pointing to the right not straight up.
        // +(this.ROTATION_AMOUNT / 2): Adding half of the rotation amount here so that each frame is centered around the angles that it applies to.
        // +this.angle: The angle the ship is currently pointing.
        // +(2 * Math.PI): The only purpose of this is to make sure the frame angle is positive, without changing the angle for the calculations (since 2 * Math.PI is a full circle rotation). This makes the calculation easier since it means we don't have to deal with negative numbers
        // % (2 * Math.PI): Takes whatever the result of the calculation with the above values is and makes it between 0 (inclusive) and 2 * Math.PI (exclusive).
        // FUTURE TODO: Due to the isometric sprite view there are some instances where the angles don't line up great with the sprite (barely). So in the future might want to look into how to make the angles match up with the sprite a little better.
        // Note that there are also not the same number of frames for each quadrant of the slicer, which leads to futher complexity getting correct angles.
        let frameAngle = ((Math.PI / 2) + this.ROTATION_AMOUNT / 2 + this.angle + (2 * Math.PI)) % (2 * Math.PI);
        let frame = Math.floor(frameAngle/this.ROTATION_AMOUNT);

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