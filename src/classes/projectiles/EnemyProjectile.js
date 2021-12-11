import { ObjectManager } from "../managers/ObjectManager.js";
import { Projectile } from "./Projectile.js";

export class EnemyProjectile extends Projectile {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage);
    }

    handleCollision(otherObject) {
        // TODO: Player ship should handle playing sound when hit since it could be invulnerable, right? Should sound be played when other things are hit? Player projectile handles plays its sound so this might require more thought
        this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
        ObjectManager.removeObject(this);
    }
}