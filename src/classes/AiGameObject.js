import { Vector } from "../utility/Vector.js";
import { InteractableGameObject } from "./InteractableGameObject.js";

export class AiGameObject extends InteractableGameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass);

        this.playerShipReference = playerShip;
        this.damageCausedByCollision = damageCausedByCollision;
    }

    relativePositionTo(object) {
        let x = object.x - this.x;
        let y = object.y - this.y;
        return new Vector(x, y);
    }

    angleTo(object) {
        let relativePositionTo = this.relativePositionTo(object);
        return Math.atan2(relativePositionTo.y, relativePositionTo.x);
    }

    angleDiffTo(object) {
        let angleToObject = this.angleTo(object);
        let angleDiff = angleToObject - this.angle;

        // when calculating angle diff compensate when the angle swiches to the opposite side
        // of the angle spectrem. eg: a ship flys from 10deg->0deg->350deg
        // this is important when doing gradual shifts to angles and not cause
        // the shift to loop around the circle long ways
        if (Math.abs(angleDiff) > Math.PI) {
            if (angleDiff > 0) {
                angleDiff -= (Math.PI * 2);
            } else {
                angleDiff += (Math.PI * 2);
            }
        }

        if (angleDiff < -Math.PI || angleDiff > Math.PI) {
            this.error(`AngleDiff was not in expected range for ${this.getClassName()}`);
        }

        return angleDiff;
    }
}