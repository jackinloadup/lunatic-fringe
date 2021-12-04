import { Powerup } from "./Powerup.js";

export class DurationPowerup extends Powerup {
    constructor(xLocation, yLocation, width, height, sprite, collisionRadius, mass, duration) {
        super(xLocation, yLocation, width, height, sprite, collisionRadius, mass);

        this.duration = duration;
    }
}