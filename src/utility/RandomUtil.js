export class RandomUtil {
    /**
     * Generates a random decimal number between min (inclusive) and max (exclusive)
     * @param {number} min 
     * @param {number} max 
     * @returns number in range [min, max)
     */
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generates a random integer number between min (inclusive) and max (exclusive)
     * @param {number} min 
     * @param {number} max 
     * @returns integer number in range [min, max)
     */
    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}