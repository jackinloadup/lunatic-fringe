import { GameConfig } from './config/GameConfig.js';
import { NewMediaManager } from './classes/managers/MediaManager.js';
import { GameManager } from './classes/managers/GameManager.js';
import { KeyStateManager } from './classes/managers/KeyManager.js';

/*  Lunatic Fringe - http://code.google.com/p/lunatic-fringe/
    Copyright (C) 2011-2013 James Carnley, Lucas Riutzel, 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* JSLint validation options */
/*jslint devel: true, browser: true, maxerr: 50, indent: 4 */
/*global Audio: false */
export function LunaticFringe(canvas, hidden, visibilityChange) {
    "use strict";

	let version = "2.0";
	log("Game Version: " + version);

    if (typeof canvas !== 'object') {
        canvas = document.getElementById(canvas);
    }

    // Opera sort of blows and doesn't support Object.create at this time
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() { }
            F.prototype = o;
            return new F();
        };
    }

    // This is simpler than parsing the query string manually. The better regex solutions gave JSLint hell so I removed them.
    if (window.location.href.indexOf("debug=1") !== -1) {
        GameConfig.debug = true;
    }

    // Initialize the media (audio/sprites)
    NewMediaManager.init();

    // Initialize the game
    GameManager.initializeGame(canvas.getContext("2d"));

    // Add listeners
    function handleVisibilityChange() {
        console.log('visibility change!', document[hidden])
        if (document[hidden]) {
			// Only pause the game if the game is not already paused
			if(!GameManager.isPaused) {
				GameManager.pauseGame();
			}
        } else {
			// Only resume the game if the game is currently paused and was not paused by a key press.
            // Do this so that if the player pauses with a key press and then leaves the browser window 
            // the game won't unpause until they explicitly do that key press again.
			if(GameManager.isPaused && !GameManager.wasPausedByKey) {
				GameManager.resumeGame();
			}
        }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    window.addEventListener('resize', function (event) { GameManager.handleResize(event); }, false);
    window.addEventListener('keyup', function (event) { KeyStateManager.onKeyUp(event); }, false);
    window.addEventListener('keydown', function (event) { KeyStateManager.onKeyDown(event); }, false);

}
