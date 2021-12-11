import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { PufferProjectile } from "../projectiles/PufferProjectile.js";

export class Puffer extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, Layer.PUFFER, 42, 49, 0, NewMediaManager.Sprites.Puffer, velocityX, velocityY, 14, 10, playerShip, 15, 50, 40);

        this.TURN_ABILITY = 0.015;
        this.MAX_SPEED = 1;
        this.ACCELERATION = 0.1;
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better

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
        // TODO: What if angleDiff is = 0? Or is 180 degrees? Which ever way mean we are facing the player, we don't need to adjust in that instance
        if ( angleDiff > 0 ) {
            this.angle += turnAbility;
        } else {
            this.angle -= turnAbility;
        }
        // TODO: Have an else statement like slicer does for negative difference away??

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

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.numberOfTicksSinceShooting++;

        if (this.numberOfTicksSinceShooting > this.shootingRechargeTime) {
          if (angleDiff < 0.85 && angleDiff > -0.85) {
            let startingX = this.x + (-Math.cos(this.angle) * this.collisionRadius);
            let startingY = this.y + (-Math.sin(this.angle) * this.collisionRadius);
            let newPufferProjectile = new PufferProjectile(startingX, startingY, Math.cos(this.angle) * this.PROJECTILE_SPEED, Math.sin(this.angle) * this.PROJECTILE_SPEED);
            ObjectManager.addObject(newPufferProjectile, true);
            this.numberOfTicksSinceShooting = 0;
            this.shootingRechargeTime = this.getRechargeTimeForShooting();
          }
        }
    }
}