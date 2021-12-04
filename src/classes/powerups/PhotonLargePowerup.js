import { NewMediaManager } from "../NewMediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class PhotonLargePowerupTest extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 15, 16, NewMediaManager.Sprites.PhotonLarge, 8, 0, 60 * 30, 60);
    }
}