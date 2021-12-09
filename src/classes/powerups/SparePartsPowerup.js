import { NewMediaManager } from "../managers/NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class SparePartsPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 13, 13, NewMediaManager.Sprites.SpareParts, 7, 0);
    }
}