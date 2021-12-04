import { NewMediaManager } from "../NewMediaManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonSmallTest extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 7, 7, 0, NewMediaManager.Sprites.PhotonSmall, velocityX, velocityY, 4, 0, 50, 10);
    }
}