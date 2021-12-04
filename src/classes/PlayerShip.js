import { InteractableGameObject } from "./InteractableGameObject.js";
import { NewMediaManager } from "./NewMediaManager.js";

export class PlayerShipTest extends InteractableGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 42, 37, 0, NewMediaManager.Sprites.PlayerShip, velocityX, velocityY, 12, 10);
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better
    }

    processInput(KeyState) {
        // TODO: Implement
    }
}