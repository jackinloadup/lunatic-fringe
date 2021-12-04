import { NewMediaManager } from "../NewMediaManager.js";
import { DurationPowerup } from "./DurationPowerup.js";

export class DoublePointsPowerupTest extends DurationPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 15, 16, NewMediaManager.Sprites.DoublePoints, 8, 0, 60 * 90);
    }
}