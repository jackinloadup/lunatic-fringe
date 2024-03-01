import { MediaManager } from "../managers/MediaManager.js";
import { Powerup } from "./Powerup.js";

export class InstantPowerup extends Powerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius);
    }

    playPowerupGainedSound() {
        MediaManager.Audio.RepairOrFuelPowerup.play();
    }
}