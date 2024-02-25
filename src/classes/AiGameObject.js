import { Vector } from "../utility/Vector.js";
import { InteractableGameObject } from "./InteractableGameObject.js";

export class AiGameObject extends InteractableGameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);

        this.playerShipReference = playerShip;
        this.damageCausedByCollision = damageCausedByCollision;
    }
}