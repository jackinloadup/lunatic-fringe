import { Layer } from "../managers/Layer.js";
import { Powerup } from "./Powerup.js";

export class InstantPowerup extends Powerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass);
    }
}