import { InteractableGameObject } from "../InteractableGameObject.js";
import { ObjectManager } from "../managers/ObjectManager.js";

export class Projectile extends InteractableGameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, lifetime, damage) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);

        this.lifetime = lifetime;
        this.damage = damage;
        this.tickCountSinceCreation = 0;
    }

    updateState() {
        this.tickCountSinceCreation += 1;

        // an undefined lifetime means that the projectile should last indefinitely
        if (this.lifetime !== undefined && this.tickCountSinceCreation >= this.lifetime) {
            ObjectManager.removeObject(this);
        } else {
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
    }
}