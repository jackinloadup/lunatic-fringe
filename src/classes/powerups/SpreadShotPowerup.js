import { GameConfig } from "../../config/GameConfig.js";
import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class SpreadShotPowerup extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.BULLET_POWERUP, 19, 16, MediaManager.Sprites.SpreadShot, 9, GameConfig.SPREAD_SHOT_NUMBER_OF_SHOTS, 'spreadShotActive', 39);
    }

    activate(playerShip) {
        document.getElementById(this.documentElementId).style.visibility = "visible";
    }

    deactivate(playerShip) {
        document.getElementById(this.documentElementId).style.visibility = "hidden";
    }
}