import { NewMediaManager } from "../NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class SparePartsPowerupTest extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 13, 13, NewMediaManager.Sprites.SpareParts, 7, 0);
    }
}