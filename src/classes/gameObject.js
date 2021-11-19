import { Logger } from "./logger.js";

/**
 * Class representing a GameObject. 
 * Inherits from the Logger class.
 * 
 * @param {*} x The x location to start the object at, defaults to 0
 * @param {*} y The y location to start the object at, defaults to 0
 */
function GameObject(xLocation, yLocation) {
    Logger.call(this); // Initialize the Logger base class

    // Class specific variables
    this.x = xLocation || 0;
    this.y = yLocation || 0;

    // Class specific exposed functions
    GameObject.prototype.updateState = function () {
        this.error("GameObject updateState function should be overwritten by concrete subclasses!");
    };

    GameObject.prototype.draw = function (context, isPlayerShip = false) {
        this.error("GameObject draw function should be overwritten by concrete subclasses!");
    };
}
GameObject.prototype = Object.create(Logger.prototype); // Inherit from the Logger class
GameObject.prototype.constructor = GameObject; // set constructor to function above

export {GameObject};