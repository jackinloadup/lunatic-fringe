import { Puffer } from "../enemies/Puffer.js";
import { SludgerMineTest } from "../enemies/SludgerMine.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class PufferProjectile extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 17, 15, 0, NewMediaManager.Sprites.PufferShot, velocityX, velocityY, 10, 0, 50, 20);
    }

    handleCollision(otherObject, objectManager) {
        // In addition to what Puffer projectiles normally ignore, they also shouldn't hit other Puffers or puffer projectiles. They also ignore SludgerMine enemies (it "barrels" through them)
        // TODO: Should puffer projectiles _not_ hit puffers? Doesn't it make more sense for them to, like everything else does?
        if (!(otherObject instanceof Puffer || otherObject instanceof PufferProjectile || otherObject instanceof SludgerMineTest)) {
            super.handleCollision(otherObject, objectManager);
        }
    }
}