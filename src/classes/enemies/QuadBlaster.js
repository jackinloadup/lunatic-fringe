import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../NewMediaManager.js";

export class QuadBlasterTest extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 40, 50, 0, NewMediaManager.Sprites.QuadBlaster, velocityX, velocityY, 16, 8, playerShip, 15, 40, 30);

        // TODO: Other sprites have sprite offset of 10???? handle this better?
        this.spriteXOffset = 10;
    }
}