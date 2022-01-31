import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { PlayerProjectilePowerup } from "./PlayerProjectilePowerup.js";

export class PhotonLargePowerup extends PlayerProjectilePowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.BULLET_POWERUP, 15, 16, MediaManager.Sprites.PhotonLarge, 8, 60 * 30, 'photonLargeActive', 60);
    }

    activate(playerShip) {
        playerShip.bulletState = playerShip.BULLETS.LARGE;
        playerShip.bulletShootingSpeed = this.shootingSpeed;
        document.getElementById(this.documentElementId).style.visibility = "visible";
    }

    deactivate(playerShip) {
        playerShip.bulletState = playerShip.BULLETS.SMALL;
        playerShip.bulletShootingSpeed = playerShip.DEFAULT_SHOOTING_SPEED;
        document.getElementById(this.documentElementId).style.visibility = "hidden";
    }
}