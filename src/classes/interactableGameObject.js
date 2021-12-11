import { GameConfig } from "../config/gameConfig.js";
import { NewVector } from "../utility/newVector.js";
import { GameObject } from "./GameObject.js";
import { Layer } from "./managers/Layer.js";

export class InteractableGameObject extends GameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass) {
        super(xLocation, yLocation);

        this.width = width;
        this.height = height;
        this.angle = angle; // TODO: Remove angle from here? Most things don't need it
        this.sprite = sprite;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.collisionRadius = collisionRadius;
        this.mass = mass;
        this.layer = layer;
        /**
         * The x offset of the sprite to use when drawing. This should be zero unless a sprite is animated in which case it should correspond to whatever the x value is of the desired animation frame in the sprite. 
         *      The updating of this value should be handled in the specific objects updateState function.
         * The y offset of the sprite to use when drawing. This should be zero unless a sprite is animated and has multiple rows on the sprite sheet in which case it should correspond to whatever the y value of the desired
         *      row of the spritesheet is.
         */
        this.spriteXOffset = 0;
        this.spriteYOffset = 0;
    }

    /**
     * Handle the drawing of an object with a sprite on the context.
     * TODO: Remove yoffset, have it be a variable on the object instead. Check to see which objects need a y offset.
     * TODO: Make spriteYOffset variable instead of 0, needed for player ship and invulnerability
     * TODO: Remove passed in 3 argument wherever it was passed in, that was removed
     * 
     * @param {*} context The drawing context
     * @param {*} yOffset The y offset when drawing the sprite on the context. This should be zero except in the few instances when raising/lowering the sprite when drawing makes it fit in the collision radius circle better.
     */
    draw(context, yOffset = 0) {
        // handle the drawing that is common between all objects

        // Sprite drawing
        // There is no rotation in this drawing since images are not actually rotated, the rotation comes from the sprite sheets
        context.drawImage(this.sprite, this.spriteXOffset, this.spriteYOffset, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2 - yOffset, this.width, this.height);

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
        let dx, dy, phi, magnitude_1, magnitude_2, direction_1, direction_2, new_xspeed_1, new_xspeed_2, new_yspeed_1, new_yspeed_2, final_xspeed_1, final_yspeed_1;
			
			if (this.mass == 0 && otherObject.mass == 0) {
				// This is bad because this means the new speed calculations will result in NaN
				error("Both objects had a mass of 0! Objects were: " + this.constructor.name + " and " + otherObject.constructor.name);
			}
			
            dx = this.x - otherObject.x;
            dy = this.y - otherObject.y;

            phi = Math.atan2(dy, dx);

            magnitude_1 = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
            magnitude_2 = Math.sqrt(otherObject.velocityX * otherObject.velocityX + otherObject.velocityY * otherObject.velocityY);

            direction_1 = Math.atan2(this.velocityY, this.velocityX);
            direction_2 = Math.atan2(otherObject.velocityY, otherObject.velocityX);

            new_xspeed_1 = magnitude_1 * Math.cos(direction_1 - phi);
            new_yspeed_1 = magnitude_1 * Math.sin(direction_1 - phi);

            new_xspeed_2 = magnitude_2 * Math.cos(direction_2 - phi);

            // TODO: Check this in the instance where 1 of the masses is 0, make sure it works how we want it to
            final_xspeed_1 = ((this.mass - otherObject.mass) * new_xspeed_1 + (otherObject.mass + otherObject.mass) * new_xspeed_2) / (this.mass + otherObject.mass);

            // TODO: Do we need the final y speed to factor in mass like the final x speed is???
            final_yspeed_1 = new_yspeed_1;

            this.velocityX = Math.cos(phi) * final_xspeed_1 + Math.cos(phi + Math.PI / 2) * final_yspeed_1;
            this.velocityY = Math.sin(phi) * final_xspeed_1 + Math.sin(phi + Math.PI / 2) * final_yspeed_1;
    }

    calculateAcceleration() {
        let currentVelocity = new NewVector(this.velocityX, this.velocityY);

        let acceleration;

        // The ship forces are opposite everything else. It doesn't move, it shifts the universe around it.
        // TODO: Where is this.acceleration set???
        if (this.layer === Layer.PLAYER) {
            acceleration = new NewVector(-Math.cos(this.angle) * this.ACCELERATION, Math.sin(-this.angle) * this.ACCELERATION);
        } else {
            acceleration = new NewVector(Math.cos(this.angle) * this.ACCELERATION, Math.sin(this.angle) * this.ACCELERATION);
        }

        let newVelocity = currentVelocity.add(acceleration);

        // Only apply Lorentz factor if acceleration increases speed
        if (newVelocity.magnitude() > currentVelocity.magnitude()) {
            // TODO: This maxSpeed is only defined at the higher level, should it be moved down to this class?
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