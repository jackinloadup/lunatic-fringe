import { DurationPowerup } from "./DurationPowerup.js";

export class PlayerProjectilePowerup extends DurationPowerup {
    constructor(xLocation, yLocation, width, height, sprite, collisionRadius, mass, duration, shootingSpeed) {
        super(xLocation, yLocation, width, height, sprite, collisionRadius, mass, duration);

        this.shootingSpeed = shootingSpeed;
    }
}