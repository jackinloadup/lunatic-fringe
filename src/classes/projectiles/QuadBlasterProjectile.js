import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/MediaManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class QuasBlasterProjectile extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, Layer.QUAD_BLASTER_PROJECTILE, 13, 11, 0, NewMediaManager.Sprites.PhotonQuad, velocityX, velocityY, 3, 0, 50, 5);
    }
}