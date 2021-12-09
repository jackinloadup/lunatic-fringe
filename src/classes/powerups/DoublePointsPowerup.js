import { NewMediaManager } from "../managers/NewMediaManager.js";
import { DurationPowerup } from "./DurationPowerup.js";

export class DoublePointsPowerup extends DurationPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 15, 16, NewMediaManager.Sprites.DoublePoints, 8, 0, 60 * 90);
    }
}