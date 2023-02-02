import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class EnemyBasePhoton extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, Layer.ENEMY_BASE_PHOTON, 17, 15, 0, MediaManager.Sprites.EnemyBasePhoton, velocityX, velocityY, 9, 2, 80, 150);
    }

    handleCollision(otherObject) {
        // We only want to play a sound when the player is hit, so don't handle playing sound here, have player handle it.
        // Puffer projectiles "barrel through" Sludger Mines, so don't die when this are hit
        this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
        if (otherObject.layer !== Layer.SLUDGER_MINE) {
            ObjectManager.removeObject(this);
        }
    }
}