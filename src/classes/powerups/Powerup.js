import { InteractableGameObject } from "../InteractableGameObject.js";
import { NewMediaManager } from "../NewMediaManager.js";
import { PlayerShipTest } from "../PlayerShip.js";

export class Powerup extends InteractableGameObject {
    /**
     * Powerups do not move in the world, so their velocityX and velocityY should always be 0.
     * angle also does not really apply, so set that to 0.
     * TODO: Set mass to 0 here since it doesn't apply to powerups?
     */
    constructor(xLocation, yLocation, width, height, sprite, collisionRadius, mass) {
        
        super(xLocation, yLocation, width, height, 0, sprite, 0, 0, collisionRadius, mass);

        this.log(this.getClassName() + " created at: (" + this.x + "," + this.y + ")");
    }

    handleCollision(otherObject, objectManager) {
        // Collision only matters if it is with the Player ship
        // All powerups play the PowerupWow sound when they are gained by the player, and then they are destroyed
        if (otherObject instanceof PlayerShipTest) {
            this.log(this.getClassName() + " gained by the player");
            NewMediaManager.Audio.PowerupWow.play();
            objectManager.removeObject(this);
        }
    }
}