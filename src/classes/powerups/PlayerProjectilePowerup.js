import { Powerup } from "./Powerup.js";

export class PlayerProjectilePowerup extends Powerup {
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, numberOfShots, documentElementId, shootingSpeed) {
        super(xLocation, yLocation, layer, width, height, sprite, collisionRadius);

        this.numberOfShots = numberOfShots
        this.documentElementId = documentElementId;
        this.shootingSpeed = shootingSpeed;
    }
}