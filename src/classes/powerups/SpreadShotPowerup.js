import { NewMediaManager } from "../managers/NewMediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class SpreadShotPowerup extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 19, 16, NewMediaManager.Sprites.SpreadShot, 9, 0, 60 * 60, 39);
    }
}