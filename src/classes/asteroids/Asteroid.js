import { InteractableGameObject } from "../InteractableGameObject.js";

export class Asteroid extends InteractableGameObject {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass) {
        super(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);
    }

    updateState() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}