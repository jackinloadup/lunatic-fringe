import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { Projectile } from "./Projectile.js";

export class PlayerProjectile extends Projectile {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, Layer.PLAYER_PROJECTILE, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage);
    }

    playCollisionSound() {
        this.error("The playCollisionSound function should be overwritten by concrete subclasses!");
    }

    handleCollision(otherObject) {
        this.log(this.getClassName() + " hit " + otherObject.getClassName());

        if (otherObject.layer !== Layer.PUFFER_PROJECTILE && otherObject.layer !== Layer.QUAD_BLASTER_PROJECTILE) {
            // Only play the weapon collision sound if not hitting an enemy projectile
           this.playCollisionSound();
        }
        ObjectManager.removeObject(this);
    }
}