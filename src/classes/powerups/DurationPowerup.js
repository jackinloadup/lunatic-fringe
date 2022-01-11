import { Powerup } from "./Powerup.js";

export class DurationPowerup extends Powerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, duration, documentElementId) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius);

        this.duration = duration;
        this.documentElementId = documentElementId;
    }

    deactivate(playerShip) {
        this.error("The deactivate function should be overwritten by concrete subclasses!");
    }
}