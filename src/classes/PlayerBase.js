import { InteractableGameObject } from "./InteractableGameObject.js";
import { NewMediaManager } from "./NewMediaManager.js";

export class PlayerBase extends InteractableGameObject {
    constructor(xLocation, yLocation) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, velocityX, velocityY, collisionRadius, and mass are always the same for a PlayerBase.
         * While the xLocation and yLocation values are also always the same when a new PlayerBase is created, leaving that as a value to pass in for now.
         */
        super(xLocation, yLocation, 42, 32, 0, NewMediaManager.Sprites.Base, 0, 0, 30, 0);

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 6;
        this.NUMBER_OF_ANIMATION_FRAMES = 4;
    }

    updateState() {
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            if (this.spriteXOffset >= (this.width * NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = 0;
            }
        }
    }
}