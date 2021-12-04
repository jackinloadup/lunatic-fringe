import { Powerup } from "./Powerup.js";

export class InstantPowerup extends Powerup {
    constructor(xLocation, yLocation, width, height, sprite, collisionRadius, mass) {
        super(xLocation, yLocation, width, height, sprite, collisionRadius, mass);
    }
}