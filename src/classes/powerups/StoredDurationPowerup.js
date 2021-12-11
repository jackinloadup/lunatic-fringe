import { Layer } from "../managers/Layer.js";
import { DurationPowerup } from "./DurationPowerup.js";

export class StoredDurationPowerup extends DurationPowerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass, duration, documentElementId, activationKey) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass, duration, documentElementId);

        this.activationKey = activationKey;
    }
}