import { GameObject } from "./GameObject.js";

export class Star extends GameObject {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, 1, 1);

        this.TWINKLE_MAX = 1 * 60;
        this.TWINKLE_MIN = 0.2 * 60;
        this.color =  ("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        this.currentColor = this.color;
        this.numberOfTicksForColor = this.getColorDuration();
        this.hasColor = true;
    }

    getColorDuration() {
        return (Math.random() * this.TWINKLE_MAX) + this.TWINKLE_MIN;
    }

    draw(context) {
        context.fillStyle = this.currentColor;
        context.fillRect(this.x, this.y, 1, 1);
    }

    updateState() {
        if (this.numberOfTicksForColor <= 0) {
            if (this.hasColor) {
              this.currentColor = "rgb(0,0,0)";
            } else {
              this.currentColor = this.color;
            }
            this.hasColor = !this.hasColor; // toggle

            this.numberOfTicksForColor = this.getColorDuration();
          }

          this.numberOfTicksForColor--;
    }
}