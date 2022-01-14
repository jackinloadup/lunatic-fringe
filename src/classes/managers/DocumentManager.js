import { Vector } from "../../utility/Vector.js";

export class DocumentManager {
    static setElementDimensions(elementName, desiredDimensionsVector) {
        document.getElementById(elementName).width = desiredDimensionsVector.x;
        document.getElementById(elementName).height = desiredDimensionsVector.y;
    }

    static getElementDimensions(elementName) {
        return new Vector(document.getElementById(elementName).clientWidth, document.getElementById(elementName).clientHeight)
    }
}