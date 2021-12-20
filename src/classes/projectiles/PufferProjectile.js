import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class PufferProjectile extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, Layer.PUFFER_PROJECTILE, 17, 15, 0, NewMediaManager.Sprites.PufferShot, velocityX, velocityY, 10, 0, 50, 20);
    }

    handleCollision(otherObject) {
        // TODO: Player ship should handle playing sound when hit since it could be invulnerable, right? Should sound be played when other things are hit? Player projectile handles plays its sound so this might require more thought
        // Puffer projectiles "barrel through" Sludger Mines, so don't die when this are hit
        this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
        if (otherObject.layer !== Layer.SLUDGER_MINE) {
            ObjectManager.removeObject(this);
        }
    }
}