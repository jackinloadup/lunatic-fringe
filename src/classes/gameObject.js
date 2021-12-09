import { Logger } from "./Logger.js";

export class GameObject extends Logger {
    constructor(xLocation, yLocation) {
        super();
        this.x = xLocation || 0;
        this.y = yLocation || 0;
    }

    updateState() {
        this.error("GameObject updateState function should be overwritten by concrete subclasses!");
    }

    draw(context) {
        this.error("GameObject draw function should be overwritten by concrete subclasses!");
    };
}