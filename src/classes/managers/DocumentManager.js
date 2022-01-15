import { Vector } from "../../utility/Vector.js";

export class DocumentManager {
    static setElementDimensions(elementName, desiredDimensionsVector) {
        document.getElementById(elementName).width = desiredDimensionsVector.x;
        document.getElementById(elementName).height = desiredDimensionsVector.y;
    }

    static getElementDimensions(elementName) {
        return new Vector(document.getElementById(elementName).clientWidth, document.getElementById(elementName).clientHeight)
    }

    static updateFuelBar(fuelPercentageRemaining) {
        const fuelBar = document.getElementById('fuel-bar');
        
        const lostPercent = 100 - fuelPercentageRemaining;
         
        fuelBar.style.background = `linear-gradient(to right, transparent 0% ${lostPercent}%, lime ${lostPercent}% 50%, yellow 50% 75%, red 75%)`;
    }

    static updateSparePartsBar(sparePartsPercentageRemaining) {
        const sparePartsBar = document.getElementById('spare-parts-bar');
        
        const lostPercent = 100 - sparePartsPercentageRemaining;

        console.log('updating spare parts: ', lostPercent)
         
        sparePartsBar.style.background = `linear-gradient(to right, transparent 0% ${lostPercent}%, blue ${lostPercent}%)`;
    }

    static updateScore(score) {
        document.getElementById("player-score").innerHTML = score;
    }
}