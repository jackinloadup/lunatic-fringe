import { Logger } from "./Logger.js";

export class GameObject extends Logger {
    constructor(xLocation, yLocation, width, height) {
        super();
        this.x = xLocation || 0;
        this.y = yLocation || 0;
        // Width and height as also needed for any game object
        this.width = width;
        this.height = height;
        // Object id to be set by the ObjectManager
        this.objectId = undefined;
    }

    updateState() {
        this.error("GameObject updateState function should be overwritten by concrete subclasses!");
    }

    draw(context) {
        this.error("GameObject draw function should be overwritten by concrete subclasses!");
    };
}