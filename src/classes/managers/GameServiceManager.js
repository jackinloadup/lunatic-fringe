/**
 * Static manager for calling game service functions.
 * The reason the GameManager is passed into the init function here is because that way we don't have to import it, so
 * we avoid circular references with the GameManager class and other object classes that will use this manager.
 */
export class GameServiceManager {
    static gameManager;

    static initialize(gameManager) {
        this.gameManager = gameManager;
    }

    static endGame() {
        this.gameManager.endGame();
    }

    static enemiesRemaining() {
        return this.gameManager.enemiesRemaining();
    }

    static displayMessage(text, ticksToShow) {
        this.gameManager.displayMessage(text, ticksToShow);
    }

    static movePlayerShipTo(x, y) {
        this.gameManager.movePlayerShipTo(x, y);
    }

    static toggleGamePaused(activatedByKey) {
        this.gameManager.toggleGamePaused(activatedByKey);
    }

    static advanceOneFrame() {
        this.gameManager.advanceOneFrame();
    }

    static toggleDebugMode() {
        this.gameManager.toggleDebugMode();
    }
}