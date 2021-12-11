import { InteractableGameObject } from "../InteractableGameObject.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";

export class Powerup extends InteractableGameObject {
    /**
     * Powerups do not move in the world, so their velocityX and velocityY should always be 0.
     * angle also does not really apply, so set that to 0.
     * TODO: Set mass to 0 here since it doesn't apply to powerups?
     */
    constructor(xLocation, yLocation, layer, width, height, sprite, collisionRadius, mass) {
        super(xLocation, yLocation, layer, width, height, 0, sprite, 0, 0, collisionRadius, mass);

        this.log(this.getClassName() + " created at: (" + this.x + "," + this.y + ")");
    }

    handleCollision(otherObject) {
        this.log(this.getClassName() + " obtained by " + otherObject.getClassName());
        NewMediaManager.Audio.PowerupWow.play();
        ObjectManager.removeObject(this);
    }

    activate(playerShip) {
        this.error("The activate function should be overwritten by concrete subclasses!");
    }
}