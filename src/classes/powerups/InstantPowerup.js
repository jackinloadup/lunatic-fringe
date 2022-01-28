import { Powerup } from "./Powerup.js";

export class InstantPowerup extends Powerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius);
    }
}