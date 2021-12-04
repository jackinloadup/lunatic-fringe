import { PufferTest } from "../enemies/Puffer.js";
import { SludgerMineTest } from "../enemies/SludgerMine.js";
import { NewMediaManager } from "../NewMediaManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class PufferProjectileTest extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 17, 15, 0, NewMediaManager.Sprites.PufferShot, velocityX, velocityY, 10, 0, 50, 20);
    }

    handleCollision(otherObject, objectManager) {
        // In addition to what Puffer projectiles normally ignore, they also shouldn't hit other Puffers or puffer projectiles. They also ignore SludgerMine enemies (it "barrels" through them)
        // TODO: Should puffer projectiles _not_ hit puffers? Doesn't it make more sense for them to, like everything else does?
        if (!(otherObject instanceof PufferTest || otherObject instanceof PufferProjectileTest || otherObject instanceof SludgerMineTest)) {
            super.handleCollision(otherObject, objectManager);
        }
    }
}