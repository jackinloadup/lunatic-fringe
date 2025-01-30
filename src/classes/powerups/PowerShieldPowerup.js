import { GameConfig } from "../../config/GameConfig.js";
import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { StoredDurationPowerup } from "./StoredDurationPowerup.js";

export class PowerShieldPowerup extends StoredDurationPowerup {
    constructor(xLocation, yLocation) {
        super(xLocation, yLocation, Layer.STORED_POWERUP, 15, 19, MediaManager.Sprites.PowerShield, 9, 60 * GameConfig.POWER_SHIELD_DURATION_IN_SECONDS, 'powerShieldAvailable', 'V');
    }

    activate(playerShip) {
        MediaManager.Audio.InvincibleOrBoost.play();
        playerShip.sprite = MediaManager.Sprites.PlayerShipInvulnerable;
        playerShip.powerShieldActive = true;

        // Set all systems, spare parts, and fuel to max
        playerShip.saveFuelSparePartAndSystemsState();
        playerShip.resetFuelSparePartAndSystemsState();
    }

    deactivate(playerShip) {
        MediaManager.Audio.SpawnAndUpgradeExpired.play();
        document.getElementById(this.documentElementId).style.visibility = "hidden";
        playerShip.sprite = MediaManager.Sprites.PlayerShip;
        playerShip.powerShieldActive = false;

        // Restore all systems, spare parts, and fuel to original levels
        playerShip.restoreFuelSparePartAndSystemsState();
    }
}