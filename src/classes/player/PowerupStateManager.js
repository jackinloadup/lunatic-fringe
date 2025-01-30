import { GameConfig } from "../../config/GameConfig.js";
import { Layer } from "../managers/Layer.js";

export class PowerupStateManager {
    constructor(player) {
        this.player = player;
        this.storedPowerups = {};
        this.activeDurationPowerups = {};
        this.activeBulletPowerups = {};
    }

    obtainPowerup(powerup) {
        if (powerup.layer === Layer.INSTANT_POWERUP) {
            powerup.activate(this.player);
        } if (powerup.layer === Layer.DURATION_POWERUP) {
            powerup.activate(this.player);
            this.activeDurationPowerups[powerup.getClassName()] = {"powerup": powerup, "duration": powerup.duration};
        } else if (powerup.layer === Layer.BULLET_POWERUP) {
            powerup.activate(this.player);
            this.activeBulletPowerups[powerup.getClassName()] = {"powerup": powerup, "numberOfShots": powerup.numberOfShots, "shootingSpeed": powerup.shootingSpeed}

            // Set the new player speed to be the maximum (slowest) of all of the powerups shooting speeds
            this.player.bulletShootingSpeed = Math.max(...Object.values(this.activeBulletPowerups).map((powerupInformation) => powerupInformation.shootingSpeed));
        } else if (powerup.layer === Layer.STORED_POWERUP) {
            if (!this.storedPowerups[powerup.activationKey] && !this.activeDurationPowerups[powerup.getClassName()]) {
                // If this powerup is not already stored or is not currently active, add it to the stored powerups list
                this.storedPowerups[powerup.activationKey] = powerup;
                // set the element visible in the document to indicate that we have it
                document.getElementById(powerup.documentElementId).style.visibility = "visible";
            }
        }
    }

    activateStoredPowerup(key) {
        const matchingStoredPowerup = this.storedPowerups[key];
        if (matchingStoredPowerup) {
            matchingStoredPowerup.activate(this.player);
            this.activeDurationPowerups[matchingStoredPowerup.getClassName()] = {"powerup": matchingStoredPowerup, "duration": matchingStoredPowerup.duration};
            delete this.storedPowerups[key];
        }
    }

    deactivateAndRemoveAllPowerups() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i)) {
                this.activeDurationPowerups[i].powerup.deactivate(this.player);
                // The powerup is no longer active, remove it from the active powerups
                delete this.activeDurationPowerups[i];
            }
        }

        for (let i in this.activeBulletPowerups) {
            if (this.activeBulletPowerups.hasOwnProperty(i)) {
                this.activeBulletPowerups[i].powerup.deactivate(this.player);
                // The powerup is no longer active, remove it from the active powerups
                delete this.activeBulletPowerups[i];
            }
        }

        // Based on gameplay footage you lose any stored powerups you had when you die, see https://www.youtube.com/watch?v=zZglGbYGRtI at 0:14 and 34:22
        for (let i in this.storedPowerups) {
            if (this.storedPowerups.hasOwnProperty(i)) {
                this.storedPowerups[i].deactivate(this.player);
                // The powerup is no longer active, remove it from the active powerups
                delete this.storedPowerups[i];
            }
        }
    }

    updateDurations() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i) && this.activeDurationPowerups[i].duration > 0) {
                this.activeDurationPowerups[i].duration -= 1;
            }
        }
    }

    updatePowerupState() {
        for (let i in this.activeDurationPowerups) {
            if (this.activeDurationPowerups.hasOwnProperty(i) && this.activeDurationPowerups[i].duration === 0) {
                this.activeDurationPowerups[i].powerup.deactivate(this.player);
                // The powerup is no longer active, remove it from the active powerups
                delete this.activeDurationPowerups[i];
            }
        }
    }

    isBulletPowerupActive(bulletPowerupClassName) {
        return this.activeBulletPowerups[bulletPowerupClassName]?.numberOfShots > 0;
    }

    bulletPowerupShotUsed(bulletPowerupClassName) {
        this.activeBulletPowerups[bulletPowerupClassName].numberOfShots--;
        if (this.activeBulletPowerups[bulletPowerupClassName].numberOfShots <= 0) {
            this.activeBulletPowerups[bulletPowerupClassName].powerup.deactivate();
            delete this.activeBulletPowerups[bulletPowerupClassName];

            if (Object.values(this.activeBulletPowerups).length !== 0) {
                this.player.bulletShootingSpeed = Math.max(...Object.values(this.activeBulletPowerups).map((powerupInformation) => powerupInformation.shootingSpeed));
            } else {
                this.player.bulletShootingSpeed = GameConfig.DEFAULT_SHOOTING_SPEED;
            }
        }
    }
}