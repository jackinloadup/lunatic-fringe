import { GameConfig } from "../../config/GameConfig.js";
import { Logger } from "../Logger.js";
import { DocumentManager } from "../managers/DocumentManager.js";

export class PlayerSystem extends Logger {
    constructor(systemDocumentName, documentLabel) {
        super();
        this.systemDocumentName = systemDocumentName;
        this.documentLabel = documentLabel;
        // Every system starts at the blue condition (indicator 0)
        this.currentActiveIndicator = 0;
        // Determines at what values the blue, green, yellow, and red lights should be shown
        // After thinking about it, blue should only show at 100%, that way it is obvious to a 
        // player when a system is at full capacity and when it is not
        this.operatingPercentageThresholds = [99, 67, 33];
        this.resetSystem();
    }

    resetSystem() {
        // Every system starts at 100% operating capacity
        this.operatingPercentage = 100;
        
        this.activateIndicator(0);
    }

    takeDamage(damageAmount) {
        this.operatingPercentage -= damageAmount;
        if (this.operatingPercentage < 0) {
            this.operatingPercentage = 0;
        }

        this.updateActiveIndicator();
    }

    repairDamage(repairAmount) {
        this.operatingPercentage += repairAmount;
        if (this.operatingPercentage > 100) {
            this.operatingPercentage = 100;
        }

        this.updateActiveIndicator();
    }

    updateActiveIndicator() {
        let indicatorValue;
        for(indicatorValue = 0; indicatorValue < this.operatingPercentageThresholds.length; indicatorValue++) {
            if (this.operatingPercentage > this.operatingPercentageThresholds[indicatorValue]) {
                // break out of the for loop to preservce current indicator value
                break;
            }
        }

        if (indicatorValue !== this.currentActiveIndicator) {
            this.activateIndicator(indicatorValue);
        }
    }

    activateIndicator(indicatorNumber) {
        // Deactivate current active indicator
        this.deactivateIndicator(this.currentActiveIndicator);

        // Activate new indicator
        // Remove precious class for grey dot
        DocumentManager.removeClassFromElement(`${this.systemDocumentName}-${indicatorNumber}`, 'grey-dot');
        // Add class for appropriate colored dot
        DocumentManager.addClassToElement(`${this.systemDocumentName}-${indicatorNumber}`, this.getIndicatorColorClass(indicatorNumber));

        // Set this indicator as the new active indicator
        this.currentActiveIndicator = indicatorNumber;
    }

    deactivateIndicator(indicatorNumber) {
        // Remove precious class for colored dot
        DocumentManager.removeClassFromElement(`${this.systemDocumentName}-${indicatorNumber}`, this.getIndicatorColorClass(indicatorNumber));
        // Add class for grey dot
        DocumentManager.addClassToElement(`${this.systemDocumentName}-${indicatorNumber}`, 'grey-dot');
    }

    updateLabel() {
        DocumentManager.updateElementText(`${this.systemDocumentName}-label`, GameConfig.debug ? `${this.documentLabel}: (${this.operatingPercentage})` : `${this.documentLabel}:`)
    }

    getIndicatorColorClass(indicatorNumber) {
        switch (indicatorNumber) {
            case 0:
                return "blue-dot";
            case 1:
                return "green-dot";
            case 2:
                return "yellow-dot";
            case 3:
                return "red-dot";
            default:
                this.error(`Unexpected player system indicator number: "${indicatorNumber}"`)
        }
    }

    toString() {
        return `${this.systemDocumentName}:${this.operatingPercentage}`
    }
}