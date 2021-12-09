export class KeyStateManager {
    static keysPressed = {};
    static SPACE = 32;
    static LEFT = 37;
    static UP = 38;
    static RIGHT = 39;
    static DOWN = 40;
	static CAPSLOCK = 20;
	static V = 86;
	static B = 66;
	static K = 75;

    static isDown(keyCode) {
        return this.keysPressed[keyCode];
    }

    static onKeyDown(event) {
        // TODO: If caps locks was pressed (and is not already registered as being down before this), handle pausing/unpausing depending on the current state
        // if (event.keyCode == this.CAPSLOCK && this.keysPressed[event.keyCode] != true) {
        // 	isCapsPaused = !isCapsPaused;
        // 	if (isCapsPaused) {
        // 		objectManager.pauseGame();
        // 	} else {
        // 		objectManager.resumeGame();
        // 	}
        // }
        
        this.keysPressed[event.keyCode] = true;
    }

    static onKeyUp(event) {
        delete this.keysPressed[event.keyCode];
    }
}