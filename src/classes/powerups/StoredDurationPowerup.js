import { DurationPowerup } from "./DurationPowerup.js";

export class StoredDurationPowerup extends DurationPowerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, duration, documentElementId, activationKey) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius, duration, documentElementId);

        this.activationKey = activationKey;
    }
}