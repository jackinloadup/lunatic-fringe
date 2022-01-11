import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/MediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ShipRepairsPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.INSTANT_POWERUP, 13, 13, NewMediaManager.Sprites.ShipRepairs, 7);
    }

    activate(playerShip) {
        // Regain back 1/3 of the ship help, rounded down to keep the value an integer
        playerShip.updateHealth(Math.floor(playerShip.MAXIMUM_HEALTH / 3));
    }
}