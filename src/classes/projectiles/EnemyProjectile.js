import { ObjectManager } from "../managers/ObjectManager.js";
import { Projectile } from "./Projectile.js";

export class EnemyProjectile extends Projectile {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage);
    }

    handleCollision(otherObject) {
        // We only want to play a sound when the player is hit, so don't handle playing sound here, have player handle it.
        this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
        ObjectManager.removeObject(this);
    }
}