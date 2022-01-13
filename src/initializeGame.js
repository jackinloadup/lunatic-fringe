import { DocumentManager } from './classes/managers/DocumentManager.js';
import {LunaticFringe} from './Fringe.js';

window.onload = function Initialize() {
    console.log("Initializing game");
    let scannerDimensions = DocumentManager.getElementDimensions('scanner');
    DocumentManager.setElementDimensions('scannerCanvas', scannerDimensions);

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

    new LunaticFringe('scannerCanvas', hidden, visibilityChange);
}