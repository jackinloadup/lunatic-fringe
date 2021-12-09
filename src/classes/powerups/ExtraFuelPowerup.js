import { NewMediaManager } from "../managers/NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ExtraFuelPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 13, 13, NewMediaManager.Sprites.ExtraFuel, 7, 0);
    }
}