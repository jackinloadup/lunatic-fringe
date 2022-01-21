import { GameConfig } from "../../config/GameConfig.js";
import { Logger } from "../Logger.js";
import { PlayerSystem } from "./PlayerSystem.js";

export class PlayerSystemsManager extends Logger {
    // Assign damage in increments of this amount
    static DAMAGE_INCREMENT = 5;
    // Repair systems in increments of this amount
    static REPAIR_INCREMENT = 1;

    constructor() {
        super();
        this.overallCondition = new PlayerSystem("overall-condition");
        // Thresholds for overall condition light indicators, based on sum of all system light indicators
        this.overallConditionThresholds = [2, 7, 11];

        this.enginesCondition = new PlayerSystem("engines-condition", "Engines");
        this.turnJetsCondition = new PlayerSystem("turn-jets-condition", "Turn Jets");
        this.gunsCondition = new PlayerSystem("guns-condition", "Guns");
        this.scannerCondition = new PlayerSystem("scanner-condition", "Scanner");
        this.radarCondition = new PlayerSystem("radar-condition", "Radar");
        this.affectableSystems = [this.enginesCondition, this.turnJetsCondition, this.gunsCondition, this.scannerCondition, this.radarCondition];

        this.updateOverallCondition();
    }

    damageSystems(totalDamage) {
        this.log(`Damaging systems by ${totalDamage}`);

        let systemsThatCanBeDamaged = [];
        this.affectableSystems.forEach(system => 
            {
                if (system.operatingPercentage > 0) {
                    systemsThatCanBeDamaged.push(system);
                }
            }
        )
        let remainingDamage = totalDamage;
        let allSystemsAtZero = systemsThatCanBeDamaged.length === 0

        while(remainingDamage > 0 && !allSystemsAtZero) {
            let systemToDamageIndex = Math.floor(Math.random() * systemsThatCanBeDamaged.length);
            let systemToDamage = systemsThatCanBeDamaged[systemToDamageIndex];
            let damageToDeal;
            if (remainingDamage < PlayerSystemsManager.DAMAGE_INCREMENT) {
                damageToDeal = remainingDamage;
            } else {
                damageToDeal = PlayerSystemsManager.DAMAGE_INCREMENT;
            }
            let damageDealt;
            if (systemToDamage.operatingPercentage < damageToDeal) {
                damageDealt = systemToDamage.operatingPercentage;
            } else {
                damageDealt = damageToDeal;
            }

            systemToDamage.takeDamage(damageDealt);
            remainingDamage -= damageDealt;
            if (systemToDamage.operatingPercentage === 0) {
                systemsThatCanBeDamaged.splice(systemToDamageIndex, 1)
            }

            if (systemsThatCanBeDamaged.length === 0) {
                // No more damage can be dealt
                this.log('All systems are at 0 operating percentage');
                allSystemsAtZero = true;
            }
        }

        this.updateOverallCondition();
    }

    repairSystems(totalRepair) {
        this.log(`Repairing systems by ${totalRepair}`);

        let systemsThatCanBeRepaired = [];
        this.affectableSystems.forEach(system => 
            {
                if (system.operatingPercentage < 100) {
                    systemsThatCanBeRepaired.push(system);
                }
            }
        )
        let remainingRepair = totalRepair;
        let allSystemsAtFull = systemsThatCanBeRepaired.length === 0

        while(remainingRepair > 0 && !allSystemsAtFull) {
            let systemToRepairIndex = Math.floor(Math.random() * systemsThatCanBeRepaired.length);
            let systemToRepair = systemsThatCanBeRepaired[systemToRepairIndex];
            let amountToRepair;
            if (remainingRepair < PlayerSystemsManager.REPAIR_INCREMENT) {
                amountToRepair = remainingRepair;
            } else {
                amountToRepair = PlayerSystemsManager.REPAIR_INCREMENT
            }
            let amountRepaired;
            if (100 - systemToRepair.operatingPercentage < amountToRepair) {
                amountRepaired = 100 - systemToRepair.operatingPercentage;
            } else {
                amountRepaired = amountToRepair;
            }

            systemToRepair.repairDamage(amountRepaired);
            remainingRepair -= amountRepaired;
            if (systemToRepair.operatingPercentage === 100) {
                systemsThatCanBeRepaired.splice(systemToRepairIndex, 1)
            }

            if (systemsThatCanBeRepaired.length === 0) {
                // No more damage can be dealt
                this.log('All systems are at full operating percentage');
                allSystemsAtFull = true;
            }
        }

        this.updateOverallCondition();
    }

    resetSystems() {
        // Reset all systems to base state
        this.affectableSystems.forEach(system => system.resetSystem());

        // Update overall condition
        this.updateOverallCondition();
    }

    updateAllLabels() {
        this.affectableSystems.forEach(system => {
            system.updateLabel();
        });
    }

    updateOverallCondition() {
        // Get sum of all system indicators (higher means player is more damaged)
        let indicatorSum = 0;
        this.affectableSystems.forEach(system => {
            indicatorSum += system.currentActiveIndicator;
        });

        let indicatorValue = 0;
        for(indicatorValue = 0; indicatorValue < this.overallConditionThresholds.length; indicatorValue++) {
            if (indicatorSum <= this.overallConditionThresholds[indicatorValue]) {
                // break out of the for loop to preservce current indicator value
                break;
            }
        }
        this.overallCondition.activateIndicator(indicatorValue);

        // Also update all labels if game is in debug mode
        if (GameConfig.debug) {
            this.updateAllLabels();
        }
    }

    isShipDestroyed() {
        let isShipDestroyed = true;
        this.affectableSystems.forEach(system => {
            if (system.currentActiveIndicator !== 3) {
                isShipDestroyed = false;
            }
        });
        return isShipDestroyed;
    }

    isShipAtFullOpeartingCapacity() {
        let isShipAtFullOpeartingCapacity = true;
        this.affectableSystems.forEach(system => {
            if (system.operatingPercentage !== 100) {
                isShipAtFullOpeartingCapacity = false;
            }
        });
        return isShipAtFullOpeartingCapacity;
    }
}