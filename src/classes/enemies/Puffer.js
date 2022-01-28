import { Vector } from "../../utility/Vector.js";
import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { PufferProjectile } from "../projectiles/PufferProjectile.js";

export class Puffer extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, Layer.PUFFER, 42, 49, 0, NewMediaManager.Sprites.Puffer, velocityX, velocityY, 14, 10, playerShip, 60, 200, 40);

        this.TURN_ABILITY = 0.015;
        this.MAX_SPEED = 1;
        this.ACCELERATION = 0.1;
        // Offset the drawing of the sprite by 2 pixels in the y direction so it fits in the collision circle better
        this.imageYOffset = 2;

        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
        this.MAX_FIRE_RATE = 3 * 60;
        this.MIN_FIRE_RATE = 0.3 * 60;
        this.PROJECTILE_SPEED = 10;

        this.numberOfTicksSinceShooting = 0;
        this.shootingRechargeTime = this.getRechargeTimeForShooting();
    }

    getRechargeTimeForShooting() {
        return (Math.random() * this.MAX_FIRE_RATE) + this.MIN_FIRE_RATE;
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

        // Keep angle between 0 and 2 * Math.PI
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        } else if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (this.angle > 2 * Math.PI || this.angle < 0) {
            this.error(`Puffer angle ${this.angle} was outside of the expected range`);
        }

        // Calculate which frame of the sprite. Note the following reasons for each part of the calculation:
        // +(Math.PI / 2): The sprite for the Puffer starts straight up, so an angle offset of Math.PI/2 (a quarter rotation of a circle) is needed for this calculation so that the correct frame is chosen since an angle of 0 is pointing to the right not straight up.
        // +(this.ROTATION_AMOUNT / 2): Adding half of the rotation amount here so that each frame is centered around the angles that it applies to.
        // +this.angle: The angle the ship is currently pointing.
        // % (2 * Math.PI): Takes whatever the result of the calculation with the above values is and makes it between 0 (inclusive) and 2 * Math.PI (exclusive).
        // FUTURE TODO: Due to the isometric sprite view there are some instances where the angles don't line up great with the sprite (barely). So in the future might want to look into how to make the angles match up with the sprite a little better.
        let frameAngle = ((Math.PI / 2) + this.ROTATION_AMOUNT / 2 + this.angle) % (2 * Math.PI);
        let frame = Math.floor(frameAngle/this.ROTATION_AMOUNT);

        this.spriteXOffset = this.width * frame;

        // The Puffer moves so slow that it feels better when it is always calculating acceleration, despite direction
        // This can result in the Puffer obriting the player but since it is so slow it only really happens when the player isn't moving
        this.calculateAcceleration();

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.numberOfTicksSinceShooting++;

        if (this.numberOfTicksSinceShooting > this.shootingRechargeTime) {
          if (angleDiff < 0.85 && angleDiff > -0.85) {
            let newProjectilePosition = this.getNewProjectilePosition();
            let newProjectileVelocity = this.getNewProjectileVelocity(this.PROJECTILE_SPEED);
            let newPufferProjectile = new PufferProjectile(newProjectilePosition.x, newProjectilePosition.y, newProjectileVelocity.x, newProjectileVelocity.y);
            ObjectManager.addObject(newPufferProjectile, true);
            this.numberOfTicksSinceShooting = 0;
            this.shootingRechargeTime = this.getRechargeTimeForShooting();
          }
        }
    }
}