import { SludgerMineTest } from "../enemies/SludgerMine.js";
import { NewMediaManager } from "../NewMediaManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonLargeTest extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 15, 16, 0, NewMediaManager.Sprites.PhotonLarge, velocityX, velocityY, 8, 0, 50, 30);
    }

    handleCollision(otherObject, objectManager) {
        // In addition to what player projectiles normally ignore, the large photon also ignores SludgerMine enemies (it "barrels" through them)
        if (!(otherObject instanceof SludgerMineTest)) {
            super.handleCollision(otherObject, objectManager);
        }
    }
}