import { PlayerShipTest } from "../PlayerShip.js";
import { Projectile } from "./Projectile.js";

export class EnemyProjectile extends Projectile
 {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage);
    }

    handleCollision(otherObject, objectManager) {
        // TODO: Revisit this function. Should projectiles be handled by physics? No right, since they just die anyway or pass through in the case of the sludger mine? in which case the super call here is not needed
        // TODO: Change this to be a list of things that _don't_ kill the projectile, like player projectile? Also make sure these interactions are acceptable
        // TODO: Player ship should handle playing sound when hit
        super.handleCollision(otherObject);
        if (otherObject instanceof AiGameObject || otherObject instanceof PlayerShipTest || otherObject instanceof Projectile) {
            this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
            objectManager.removeObject(this);
        }
    }
}