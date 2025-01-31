import { GameConfig } from "../config/GameConfig.js";
import { Vector } from "../utility/Vector.js";
import { GameObject } from "./GameObject.js";
import { GameManager } from "./managers/GameManager.js";
import { Layer } from "./managers/Layer.js";

export class InteractableGameObject extends GameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass) {
        super(xLocation, yLocation, width, height);

        this.angle = angle;
        this.sprite = sprite;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.collisionRadius = collisionRadius;
        this.mass = mass;
        this.layer = layer;
        /**
         * spriteXOffset: The x offset of the sprite to use when drawing. This should be zero unless a sprite is animated in which case it should correspond to whatever the x value is of the desired animation frame in the sprite. 
         *      The updating of this value should be handled in the specific objects updateState function.
         * spriteYOffset: The y offset of the sprite to use when drawing. This should be zero unless a sprite is animated and has multiple rows on the sprite sheet in which case it should correspond to whatever the y value of the desired
         *      row of the spritesheet is.
         * imageYOffset: The image y offset to use when drawing the sprite. This should be zero unless a sprite needs to have the image drawn off-center in the y direction in order for it to be positioned better within the collision circle.
         */
        this.spriteXOffset = 0;
        this.spriteYOffset = 0;
        this.imageYOffset = 0;
        // Used to cause static around the object image (for example when fading in)
        this.percentVisible = 100;
    }

    /**
     * Return the X coordinate of the center of the collision circle. By default this is just the X coordinate over the object itself as the collision circle is centered around the object itself. However, if the collision circle is not centered
     * around the objects location (like with the hammerhead weapon) than this needs to be overridden to return the actual X value for the center of the collision circle.
     * @returns number
     */
    getCollisionCenterX() {
        return this.x;
    }

    /**
     * Return the Y coordinate of the center of the collision circle. By default this is just the Y coordinate over the object itself as the collision circle is centered around the object itself. However, if the collision circle is not centered
     * around the objects location (like with the hammerhead weapon) than this needs to be overridden to return the actual Y value for the center of the collision circle.
     * @returns number
     */
    getCollisionCenterY() {
        return this.y;
    }

    /**
     * Handle the drawing of an object with a sprite on the context.
     * 
     * @param {*} context The drawing context
     */
    draw(canvasContext, effectCanvasContext, percentageVisible) {
        // handle the drawing that is common between all objects

        // There are two percentage visible attributes, to get total percentage visible multiple the two values. Ex. 90% x 90% should give a final percentage visible of 81%.
        // percentageVisible: percentage visible based on how damaged the system is (scanner or radar)
        // this.percentVisible: Used to apply percent visible effect to specific objects. For example, fading in the hammerhead hammer as it starts to respawn
        const totalPercentageVisible = percentageVisible * this.percentVisible / 100;

        // Draw object to the effect canvas, so that any effects can be applied to the sprite before it is drawn on the main canvas
        effectCanvasContext.drawImage(this.sprite, this.spriteXOffset, this.spriteYOffset, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2 - this.imageYOffset, this.width, this.height);

        // Draw image static effect. Only draw is percentage visible is not 100 percent, as no reason to read image data if we won't be causing a static effect
        if (this.percentVisible !== 100 || percentageVisible !== 100) {
            GameManager.applyStaticEffectToCanvas(effectCanvasContext, totalPercentageVisible, this.x - this.width / 2, this.y - this.height / 2 - this.imageYOffset, this.width, this.height)
        }

        // Sprite drawing
        // There is no rotation in this drawing since images are not actually rotated, the rotation comes from the sprite sheets
        // Object is drawn on the main canvas using the end result in the temp canvas
        canvasContext.drawImage(effectCanvasContext.canvas, 0, 0);
        // Clear the drawing off of the effect canvas to prevent interference with the next drawing
        effectCanvasContext.clearRect(this.x - this.width / 2, this.y - this.height / 2 - this.imageYOffset, this.width, this.height);

        // Common debug drawing
        if (GameConfig.debug) {
            // Draw collision circle
            canvasContext.beginPath();
            canvasContext.strokeStyle = "blue";
            canvasContext.arc(this.getCollisionCenterX(), this.getCollisionCenterY(), this.collisionRadius, 0, Math.PI * 2);
            canvasContext.stroke();

            // Draw object angle
            canvasContext.beginPath();
            canvasContext.strokeStyle = "blue";
            canvasContext.moveTo(this.x, this.y);
            // console.log("drawing line");
            if (this.layer === Layer.PLAYER) {
                // Player ship forces/angles are opposite everyone else
                canvasContext.lineTo(this.x + -Math.cos(this.angle) * this.collisionRadius * 2, this.y + -Math.sin(this.angle) * this.collisionRadius * 2);
            } else {
                canvasContext.lineTo(this.x + Math.cos(this.angle) * this.collisionRadius * 2, this.y + Math.sin(this.angle) * this.collisionRadius * 2);
            }
            canvasContext.stroke();
        }
    }

    handleCollision(otherObject) {
        if (this.mass == 0 && otherObject.mass == 0) {
            // This is bad because this means the new speed calculations will result in NaN
            error("Both objects had a mass of 0! Objects were: " + this.constructor.name + " and " + otherObject.constructor.name);
        }

        // To understand how this calculation works, https://imada.sdu.dk/~rolf/Edu/DM815/E10/2dcollisions.pdf is helpful in explaining it without trig functions
        // Trig functions are used here because it is less computationally intensive then doing all of the vector calculations
        let dx = this.x - otherObject.x;
        let dy = this.y - otherObject.y;

        let phi = Math.atan2(dy, dx);

        let thisMagnitude = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        let otherObjectMagnitude = Math.sqrt(otherObject.velocityX * otherObject.velocityX + otherObject.velocityY * otherObject.velocityY);

        let thisAngle = Math.atan2(this.velocityY, this.velocityX);
        let otherObjectAngle = Math.atan2(otherObject.velocityY, otherObject.velocityX);

        // Essentially this is getting the magnitude of the projection of thisVelocity onto the vector <dx, dy>
        let thisSpeedInNormalDirection = thisMagnitude * Math.cos(thisAngle - phi);
        // Essentially this is getting the magnitude of the porjection of thisVelocity onto a vector tangent to <dx, dy>. This works because to get a tangent vector you can use the same difference angle as before and subtract 90 degrees, 
        // but this is the same thing as just taking the sine of the difference angle instead of the cosine
        let thisSpeedInTangentDirection = thisMagnitude * Math.sin(thisAngle - phi);

        // Essentially this is getting the magnitude of the projection of otherObjectVelocity onto the vector <dx, dy>
        let otherObjectSpeedInNormalDirection = otherObjectMagnitude * Math.cos(otherObjectAngle - phi);

        // Calculate new speed in the normal direction, using the one-dimensional collision formula and the original speeds of this and otherObject in the normal direction
        // NOTE: otherObject.mass + otherObject.mass = 2 * otherObject.mass, but is less computationally intensive
        // NOTE: When otherObject mass is 0, the speed of this object in the normal direction won't change
        let thisNewSpeedInNormalDirection = ((this.mass - otherObject.mass) * thisSpeedInNormalDirection + (otherObject.mass + otherObject.mass) * otherObjectSpeedInNormalDirection) / (this.mass + otherObject.mass);

        // NOTE: Since there are no forces acting in the tangent direction of the collision, the new tangent speed is the same as the original tangent speed
        let thisNewSpeedInTangentDirection = thisSpeedInTangentDirection;

        // Convert the speeds in the normal and tangent directions back into x and y coordinates
        this.velocityX = Math.cos(phi) * thisNewSpeedInNormalDirection + Math.cos(phi + Math.PI / 2) * thisNewSpeedInTangentDirection;
        this.velocityY = Math.sin(phi) * thisNewSpeedInNormalDirection + Math.sin(phi + Math.PI / 2) * thisNewSpeedInTangentDirection;
    }

    calculateAcceleration() {
        let currentVelocity = new Vector(this.velocityX, this.velocityY);

        let acceleration;

        // The ship forces are opposite everything else. It doesn't move, it shifts the universe around it.
        if (this.layer === Layer.PLAYER) {
            acceleration = new Vector(-Math.cos(this.angle) * this.ACCELERATION, Math.sin(-this.angle) * this.ACCELERATION);
        } else {
            acceleration = new Vector(Math.cos(this.angle) * this.ACCELERATION, Math.sin(this.angle) * this.ACCELERATION);
        }

        let newVelocity = currentVelocity.add(acceleration);

        // Only apply Lorentz factor if acceleration increases speed
        if (newVelocity.magnitude() > currentVelocity.magnitude()) {
            let maxSpeed = this.getStaticValue('MAX_SPEED');
            if (!maxSpeed) {
                this.error(`Max speed for ${this.getClassName()} was not defined`);
            }
            let b = 1 - ((currentVelocity.magnitude() * currentVelocity.magnitude()) / (maxSpeed * maxSpeed));

            // If b is negative then just make it very small to prevent errors in the square root
            if (b <= 0) { b = 0.0000000001; }

            let lorentz_factor = Math.sqrt(b);

            acceleration = acceleration.scale(lorentz_factor);
        }

        currentVelocity = currentVelocity.add(acceleration);

        /* Allow acceleration in the forward direction to change the direction
        of currentVelocity by using the direction of newVelocity (without the Lorentz factor)
        with the magnitude of currentVelocity (that applies the Lorentz factor). Without this
        the ship is almost impossible to turn when at max speed. */
        if (currentVelocity.magnitude() > 0) {
            currentVelocity = newVelocity.normalize().scale(currentVelocity.magnitude());
        }

        this.velocityX = currentVelocity.x;
        this.velocityY = currentVelocity.y;
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

    /**
     * Used to get a static value off of a `this` instance when not in the class defition
     * @param {string} staticVariableName 
     * @returns The value of the static variable with the given name, or undefined if it doesn't exist
     */
    getStaticValue(staticVariableName) {
        return this.constructor[staticVariableName];
    }
}