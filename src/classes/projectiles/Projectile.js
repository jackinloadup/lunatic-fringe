import { AiGameObject } from "../aiGameObject.js";
import { InteractableGameObject } from "../InteractableGameObject.js";

export class Projectile extends InteractableGameObject {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);

        this.lifetime = lifetime;
        this.damage = damage;
        this.tickCountSinceCreation = 0;
    }

    // TODO: Pass in objectManager to all updateState functions?
    updateState(objectManager) {
        // TODO: Increase tick count since creation and destory projectile if past lifetime
        this.tickCountSinceCreation += 1;

        if (this.tickCountSinceCreation >= this.lifetime) {
            objectManager.removeObject(this);
        } else {
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
    }
}