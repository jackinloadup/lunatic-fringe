import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../NewMediaManager.js";

export class PufferTest extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 42, 49, 0, NewMediaManager.Sprites.Puffer, velocityX, velocityY, 14, 10, playerShip, 15, 50, 40);

        this.TURN_ABILITY = 0.015;
        this.MAX_SPEED = 1;
        this.ACCELERATION = 0.1;
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better
    }
}