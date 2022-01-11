import { NewMediaManager } from "../managers/MediaManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonSmall extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 7, 7, 0, NewMediaManager.Sprites.PhotonSmall, velocityX, velocityY, 4, 0, 50, 10);
    }
}