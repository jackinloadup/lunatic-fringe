import { Layer } from "../managers/Layer.js";

export class PowerupStateManager {
    constructor(player) {
        this.player = player;
        this.storedPowerups = {};
        this.activeDurationPowerups = {};
        this.bulletPowerup = null;
    }

    obtainPowerup(powerup) {
        if (powerup.layer === Layer.INSTANT_POWERUP) {
            powerup.activate(this.player);
        } if (powerup.layer === Layer.DURATION_POWERUP) {
            powerup.activate(this.player);
            this.activeDurationPowerups[powerup.getClassName()] = {"powerup": powerup, "duration": powerup.duration};
        } else if (powerup.layer === Layer.BULLET_POWERUP) {
            // If other bullet powerups are active, deactivate them first.
            if (this.bulletPowerup) {
                this.bulletPowerup.deactivate();
                this.bulletPowerup = null;
            }
            powerup.activate(this.player);
            this.bulletPowerup = {"powerup": powerup, "duration": powerup.duration};
        } else if (powerup.layer === Layer.STORED_POWERUP) {
            if (!this.storedPowerups[powerup.activationKey] && !this.activeDurationPowerups[powerup.getClassName()]) {
                // If this powerup is not already stored or is not currently active, add it to the stored powerups list
                this.storedPowerups[powerup.activationKey] = powerup;
                // set the element visible in the document to indicate that we have it
                document.getElementById(this.documentElementId).style.visibility = "visible";
            }
        }
    }

    activateStoredPowerup(key) {
        for (const [entryKey, entryValue] of Object.entries(this.storedPowerups)) {
            if (key === entryKey) {
                // activate the stored powerup
                let powerup = entryValue;
                powerup.activate();
                this.activeDurationPowerups[powerup.getClassName()] = {"powerup": powerup, "duration": powerup.duration};
            }
        }
    }

    deactivateAllActivePowerups() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i)) {
                this.activeDurationPowerups[i].deactivate();
                // The powerup is no longer active, remove it from the active powerups
                delete this.activeDurationPowerups[i];
            }
        }
    }

    updateDurations() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i) && this.activeDurationPowerups[i].duration > 0) {
                this.activeDurationPowerups[i].durations -= 1;
            }
        }

        if (this.bulletPowerup && this.bulletPowerup.duration > 0) {
            this.bulletPowerup.duration -= 1;
        }
    }

    updatePowerupState() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i) && this.activeDurationPowerups[i].duration === 0) {
                this.activeDurationPowerups[i].deactivate();
                // The powerup is no longer active, remove it from the active powerups
                delete this.activeDurationPowerups[i];
            }
        }
    }
}