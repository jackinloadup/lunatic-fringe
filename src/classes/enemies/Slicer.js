import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../NewMediaManager.js";

export class SlicerTest extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 50, 50, 0, NewMediaManager.Sprites.Slicer, velocityX, velocityY, 14, 50, playerShip, 25, 100, 100);

        this.TURN_ABILITY = 0.3;
        this.MAX_SPEED = 10;
        this.ACCELERATION = 0.175;
    }
}