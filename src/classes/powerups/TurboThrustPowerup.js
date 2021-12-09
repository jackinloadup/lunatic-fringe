import { NewMediaManager } from "../managers/NewMediaManager.js";
import { StoredDurationPowerup } from "./StoredDurationPowerup.js";

export class TurboThrustPowerup extends StoredDurationPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 15, 16, NewMediaManager.Sprites.TurboThrust, 8, 0, 60 * 2);
    }
}