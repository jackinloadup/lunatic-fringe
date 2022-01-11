import { GameConfig } from "../config/GameConfig.js";
import { Vector } from "../utility/Vector.js";
import { GameObject } from "./GameObject.js";
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
    }

    /**
     * Handle the drawing of an object with a sprite on the context.
     * 
     * @param {*} context The drawing context
     * @param {*} yOffset The y offset when drawing the sprite on the context. This should be zero except in the few instances when raising/lowering the sprite when drawing makes it fit in the collision radius circle better.
     */
    draw(context) {
        // handle the drawing that is common between all objects

        // Sprite drawing
        // There is no rotation in this drawing since images are not actually rotated, the rotation comes from the sprite sheets
        context.drawImage(this.sprite, this.spriteXOffset, this.spriteYOffset, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2 - this.imageYOffset, this.width, this.height);

        // Common debug drawing
        if (GameConfig.debug) {
            // Draw collision circle
            context.beginPath();
            context.strokeStyle = "blue";
            context.arc(this.x, this.y, this.collisionRadius, 0, Math.PI * 2);
            context.stroke();

            // Draw object angle
            context.beginPath();
            context.strokeStyle = "blue";
            context.moveTo(this.x, this.y);
            // console.log("drawing line");
            if (this.layer === Layer.PLAYER) {
                // Player ship forces/angles are opposite everyone else
                context.lineTo(this.x + -Math.cos(this.angle) * this.collisionRadius * 2, this.y + -Math.sin(this.angle) * this.collisionRadius * 2);
            } else {
                context.lineTo(this.x + Math.cos(this.angle) * this.collisionRadius * 2, this.y + Math.sin(this.angle) * this.collisionRadius * 2);
            }
            context.stroke();
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
            // NOTE: MAX_SPEED is not defined in this class as not every class extended from this calls calculateAcceleration. All classes that use this function should define a MAX_SPEED. This function should probably move into 
            // a subclass of objects that actually use it but for now it will remain here
            let b = 1 - ((currentVelocity.magnitude() * currentVelocity.magnitude()) / (this.MAX_SPEED * this.MAX_SPEED));

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
}