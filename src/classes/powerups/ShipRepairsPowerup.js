import { NewMediaManager } from "../NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ShipRepairsPowerupTest extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 13, 13, NewMediaManager.Sprites.ShipRepairs, 7, 0);
    }
}