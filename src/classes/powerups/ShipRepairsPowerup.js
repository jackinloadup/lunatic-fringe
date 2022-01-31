import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { InstantPowerup } from "./InstantPowerup.js";

export class ShipRepairsPowerup extends InstantPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.INSTANT_POWERUP, 13, 13, MediaManager.Sprites.ShipRepairs, 7);
    }

    activate(playerShip) {
        // Total systems health is between 400 and 500 (100 per system, 80 damage per system means death) so restore around 1/3 of total health
        playerShip.repairShip(150);
    }
}