import { GameConfig } from "../config/gameConfig.js";
import { GameObject } from "./gameObject.js";

/**
 * Class representing an InteractableGameObject. 
 * Inherits from the GameObject class.
 * 
 * @param {*} x The x location to start the object at, defaults to 0
 * @param {*} y The y location to start the object at, defaults to 0
 */
function InteractableGameObject(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius) {
    GameObject.call(this, xLocation, yLocation); // Initialize the GameObject base class

    // Class specific variables
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.sprite = sprite;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.collisionRadius = collisionRadius;

    // Class specific exposed functions
    /**
     * Handle the drawing of an object with a sprite on the context.
     * 
     * @param {*} context The drawing context
     * @param {*} spriteXOffset The x offset of the sprite to use when drawing. This should be zero unless a sprite is animated in which case it should correspond to whatever the x value is of the desired animation frame in the sprite.
     *                          The y offset of the sprite should never be needed as all sprite sheets are just one row of sprites, as opposed to multiple rows.
     * @param {*} yOffset The y offset when drawing the sprite on the context. This should be zero except in the few instances when raising/lowering the sprite when drawing makes it fit in the collision radius circle better.
     * @param {*} isPlayerShip 
     */
    InteractableGameObject.prototype.draw = function (context, spriteXOffset = 0, yOffset = 0, isPlayerShip = false) {
        // handle the drawing that is common between all objects

        // Sprite drawing
        // There is no rotation in this drawing since images are not actually rotated, the rotation comes from the sprite sheets
        context.drawImage(this.sprite, spriteXOffset, 0, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2 - yOffset, this.width, this.height);

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
            if (isPlayerShip) {
                // Player ship forces/angles are opposite everyone else
                context.lineTo(this.x + -Math.cos(this.angle) * this.collisionRadius * 2, this.y + -Math.sin(this.angle) * this.collisionRadius * 2);
            } else {
                context.lineTo(this.x + Math.cos(this.angle) * this.collisionRadius * 2, this.y + Math.sin(this.angle) * this.collisionRadius * 2);
            }
            context.stroke();
        }

        
    };

    InteractableGameObject.prototype.handleCollision = function (otherObject) {
        this.error("InteractableGameObject handleCollision function should be overwritten by concrete subclasses!");
    };
}
InteractableGameObject.prototype = Object.create(GameObject.prototype); // Inherit from the GameObject class
InteractableGameObject.prototype.constructor = InteractableGameObject; // set constructor to function above

export {InteractableGameObject};