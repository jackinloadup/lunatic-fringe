import { AiGameObject } from "./AiGameObject.js";
import { Layer } from "./managers/Layer.js";
import { NewMediaManager } from "./managers/NewMediaManager.js";

export class EnemyBase extends AiGameObject {
    constructor(xLocation, yLocation, playerShip) {
        /**
         * The width, height, angle (which doesn't really apply), sprite, velocityX, velocityY, collisionRadius, and mass are always the same for an EnemyBase.
         * While the xLocation and yLocation values are also always the same when a new EnemyBase is created, leaving that as a value to pass in for now.
         */
        super(xLocation, yLocation, Layer.ENEMY_BASE, 62, 60, 0, NewMediaManager.Sprites.EnemyBase, 0, 0, 28, 100000000, playerShip, 50);
    }

    handleCollision(otherObject) {
        // The EnemyBase should not do anything when other objects collide with it (including the Player), it is unmovable and indestructible
        return;
    }

    updateState() {
        // TODO: Fire bullets towards player if player is nearby, also handle spawning more enemies
    };
}