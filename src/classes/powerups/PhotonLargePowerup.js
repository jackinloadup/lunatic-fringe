import { GameConfig } from "../../config/GameConfig.js";
import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class PhotonLargePowerup extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.BULLET_POWERUP, 15, 16, MediaManager.Sprites.PhotonLarge, 8, GameConfig.LARGE_PHOTON_NUMBER_OF_SHOTS, 'photonLargeActive', 60);
    }

    activate(playerShip) {
        document.getElementById(this.documentElementId).style.visibility = "visible";
    }

    deactivate(playerShip) {
        document.getElementById(this.documentElementId).style.visibility = "hidden";
    }
}