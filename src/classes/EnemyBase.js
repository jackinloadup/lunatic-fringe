import { AiGameObject } from "./AiGameObject.js";
import { Layer } from "./managers/Layer.js";
import { NewMediaManager } from "./managers/MediaManager.js";

export class EnemyBase extends AiGameObject {
    constructor(xLocation, yLocation, playerShip) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, velocityX, velocityY, collisionRadius, and mass are always the same for an EnemyBase.
         */
        super(xLocation, yLocation, Layer.ENEMY_BASE, 62, 60, 0, NewMediaManager.Sprites.EnemyBase, 0, 0, 28, 100000000, playerShip, 200);
    }

    handleCollision(otherObject) {
        // The EnemyBase should not do anything when other objects collide with it (including the Player), it is unmovable and indestructible
        return;
    }

    updateState() {
        // FUTURE TODO: Fire bullets towards player if player is nearby, also handle spawning more enemies
    };
}