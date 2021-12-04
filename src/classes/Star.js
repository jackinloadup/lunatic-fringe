import { GameObject } from "./GameObject.js";

export class Star extends GameObject {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation);

        this.TWINKLE_MAX = 1 * 60;
        this.TWINKLE_MIN = 0.2 * 60;
        this.color = 0; // TODO: Randomize color
        this.currentColor = this.color;
    }
}