import { DurationPowerup } from "./DurationPowerup.js";

export class PlayerProjectilePowerup extends DurationPowerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass, duration, documentElementId, shootingSpeed) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass, duration, documentElementId);

        this.shootingSpeed = shootingSpeed;
    }
}