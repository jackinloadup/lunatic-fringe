import { NewMediaManager } from "../managers/NewMediaManager.js";
import { PlayerBase } from "../PlayerBase.js";
import { PlayerShip } from "../PlayerShip.js";
import { Powerup } from "../powerups/Powerup.js";
import { Projectile } from "./Projectile.js";

export class PlayerProjectile extends Projectile {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage);
    }

    handleCollision(otherObject, objectManager) {
        this.log(this.getClassName() + " hit " + otherObject.getClassName());

        // TODO: Make this if statement less dumb, invert condition then won't need else
        if (otherObject instanceof PlayerBase || otherObject instanceof PlayerShip || otherObject instanceof Powerup || otherObject instanceof PlayerProjectile) {
            // Do not want player projectiles to collide with the player base, the player ship, in world powerups, or other player projectiles
            return;
        } else {
            NewMediaManager.Audio.CollisionDefaultWeapon.play();
            objectManager.removeObject(this);
        }
    }
}