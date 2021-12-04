import { Asteroid } from "./asteroid.js";

export class Rocko extends Asteroid {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, collisionRadius, and mass are always the same for a Rocko.
         */
        super(xLocation, yLocation, 35, 36, 0, NewMediaManager.Sprites.Rocko, velocityX, velocityY, 18, 500);
    }
}