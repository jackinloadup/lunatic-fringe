import { DurationPowerup } from "./DurationPowerup.js";

export class StoredDurationPowerup extends DurationPowerup {
    constructor(xLocation, yLocation, width, height, sprite, collisionRadius, mass, duration) {
        super(xLocation, yLocation, width, height, sprite, collisionRadius, mass, duration);
    }
}