import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ExtraFuelPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.INSTANT_POWERUP, 13, 13, NewMediaManager.Sprites.ExtraFuel, 7, 0);
    }

    activate(playerShip) {
        // Gain back half of the max fuel amount
        playerShip.updateFuel(playerShip.MAXIMUM_FUEL / 2);
    }
}