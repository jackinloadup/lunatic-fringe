import { NewMediaManager } from "../NewMediaManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class QuasBlasterProjectileTest extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 13, 11, 0, NewMediaManager.Sprites.PhotonQuad, velocityX, velocityY, 3, 0, 50, 5);
    }
}