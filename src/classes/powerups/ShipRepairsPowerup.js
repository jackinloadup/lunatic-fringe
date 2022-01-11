import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ShipRepairsPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.INSTANT_POWERUP, 13, 13, NewMediaManager.Sprites.ShipRepairs, 7);
    }

    activate(playerShip) {
        // Regain back 1/3 of the ship help
        playerShip.updateHealth(Math.floor(playerShip.MAXIMUM_HEALTH / 3));
    }
}