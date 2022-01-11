import { InteractableGameObject } from "./InteractableGameObject.js";
import { Layer } from "./managers/Layer.js";
import { NewMediaManager } from "./managers/MediaManager.js";

export class PlayerBase extends InteractableGameObject {
    constructor(xLocation, yLocation) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, velocityX, velocityY, collisionRadius, and mass are always the same for a PlayerBase.
         */
        super(xLocation, yLocation, Layer.PLAYER_BASE, 42, 32, 0, NewMediaManager.Sprites.Base, 0, 0, 30, 0);

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 6;
        this.NUMBER_OF_ANIMATION_FRAMES = 4;
    }

    updateState() {
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            if (this.spriteXOffset >= (this.width * this.NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = 0;
            }
        }
    }

    handleCollision(otherObject) {
        // The PlayerBase should not do anything when other objects collide with it (including the Player)
        return;
    }
}