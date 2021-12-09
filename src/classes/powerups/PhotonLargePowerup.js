import { NewMediaManager } from "../managers/NewMediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class PhotonLargePowerup extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 15, 16, NewMediaManager.Sprites.PhotonLarge, 8, 0, 60 * 30, 60);
    }
}