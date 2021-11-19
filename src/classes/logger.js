import { GameConfig } from "../config/gameConfig.js";

// Logger class
export function Logger() {

    Logger.prototype.log = function (message) {
        if (GameConfig.debug) {
            try {
                console.log(message);
            } catch (e) { }
        }
    }
	
	Logger.prototype.error = function (message) {
        try {
            console.error(message);
        } catch (e) { }
	}
}