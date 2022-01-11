import { InteractableGameObject } from "../InteractableGameObject.js";
import { Layer } from "../managers/Layer.js";

export class Asteroid extends InteractableGameObject {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, damageCausedByCollision) {
        super(xLocation, yLocation, Layer.ASTEROID, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);

        this.damageCausedByCollision = damageCausedByCollision;
    }

    updateState() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}