import { NewMediaManager } from "../NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ExtraFuelPowerupTest extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 13, 13, NewMediaManager.Sprites.ExtraFuel, 7, 0);
    }
}