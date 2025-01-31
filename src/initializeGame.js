import { DocumentManager } from './classes/managers/DocumentManager.js';
import {LunaticFringe} from './Fringe.js';
import { Vector } from './utility/Vector.js';

window.onload = function Initialize() {
    console.log("Initializing game");

    let scannerDimensions = DocumentManager.getElementDimensions('scanner');
    DocumentManager.setElementDimensions('scannerCanvas', scannerDimensions);

    // Another canvas for another layer of the scanner drawing area
    DocumentManager.setElementDimensions('projectilesScannerCanvas', scannerDimensions);
    
    // Add hidden canvas for drawing effects on sprites before drawing on the actual scanner canvas
    DocumentManager.setElementDimensions('effectScannerCanvas', scannerDimensions);

    let radarDimensions = DocumentManager.getElementDimensions('radar');
    DocumentManager.setElementDimensions('radarCanvas', radarDimensions);

    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    new LunaticFringe('scannerCanvas', 'projectilesScannerCanvas', 'effectScannerCanvas', 'radarCanvas', hidden, visibilityChange);
}