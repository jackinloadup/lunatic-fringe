import { NewMediaManager } from "../NewMediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class SpreadShotPowerupTest extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 19, 16, NewMediaManager.Sprites.SpreadShot, 9, 0, 60 * 60, 39);
    }
}