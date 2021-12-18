export class RandomUtil {
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}