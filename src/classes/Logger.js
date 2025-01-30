import { GameConfig } from "../config/GameConfig.js";

export class Logger {
    static getClassName() {
        return this.name;
    }
    getClassName() {
        return this.constructor.name;
    }

    log(message) {
        if (GameConfig.debug) {
            try {
                console.log(message);
            } catch (e) { }
        }
    }

    error(message) {
        try {
            console.error(message);
        } catch (e) { }
    }
}