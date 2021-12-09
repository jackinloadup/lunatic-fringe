import { NewMediaManager } from "../managers/NewMediaManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonMedium extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 10, 10, 0, NewMediaManager.Sprites.PhotonMedium, velocityX, velocityY, 5, 0, 50, 15);
    }
}