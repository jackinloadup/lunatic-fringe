import {LunaticFringe} from './fringe.js';

window.onload = function Initialize() {
    console.log("Initializing game");
    document.getElementById('fringeCanvas').width = window.innerWidth;
    document.getElementById('fringeCanvas').height = window.innerHeight;

    var hidden, visibilityChange;
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

    new LunaticFringe('fringeCanvas', hidden, visibilityChange);
}