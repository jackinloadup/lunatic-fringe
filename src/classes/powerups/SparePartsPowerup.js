import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class SparePartsPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.INSTANT_POWERUP, 13, 13, NewMediaManager.Sprites.SpareParts, 7, 0);
    }

    activate(playerShip) {
        // Regain back 1/4th of the 
        playerShip.updateSpareParts(playerShip.MAXIMUM_SPARE_PARTS / 4);
    }
}