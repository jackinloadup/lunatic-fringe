import { MediaManager } from "../managers/MediaManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonMedium extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 10, 10, 0, MediaManager.Sprites.PhotonMedium, velocityX, velocityY, 5, 0, 50, 60);
    }
}