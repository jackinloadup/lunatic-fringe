import { Score } from './Score';

/**
 * Tracks highscores in local storage in the client's browser. Because
 * it uses local storage, highscores are persisted between visits to
 * the site.
 */
export class LocalStorageHighscoreService {
  static #HIGHSCORES_STORAGE_KEY = 'lunatic:highscores';

  /**
   * @type {number}
   */
  #numHighscoresToTrack;

  /**
   * @param {number} numHighscoresToTrack - How many highscores can exist at a
   * time.
   */
  constructor(numHighscoresToTrack = 10) {
    this.#numHighscoresToTrack = numHighscoresToTrack;
  }

  /**
   * @returns {Promise<Score[]>} - The highscores, in descending order. This array
   * will never be any larger than the number of highscores the service is configured
   * to track.
   */
  async getHighscores() {
    try {
      return JSON.parse(localStorage.getItem(LocalStorageHighscoreService.#HIGHSCORES_STORAGE_KEY) ?? '[]')
        .sort(this.#sortScores)
        .slice(0, this.#numHighscoresToTrack);
    } catch (_err) {}

    return [];
  }

  /**
   * Submits the provided `score` to the highscore system. If the score is better
   * than an existing highscore or persistence has fewer highscores than this service
   * tracks, it will replace that score in persistence.
   *
   * @param {Score} score - The score to submit for evaluation.
   *
   * @returns {Promise<Score[]>} The current highscores after evaluating the
   * submission.
   */
  async submitScore(score) {
    const existingScores = await this.getHighscores();

    const isNewScoreSubmissible =
      existingScores.length < this.#numHighscoresToTrack ||
      existingScores.some((existingScores) => score.score > existingScores.score);

    if (isNewScoreSubmissible) {
      const newScores = [...existingScores, score].sort(this.#sortScores).slice(0, this.#numHighscoresToTrack);

      localStorage.setItem(LocalStorageHighscoreService.#HIGHSCORES_STORAGE_KEY, JSON.stringify(newScores));

      return newScores;
    }

    return existingScores;
  }

  /**
   * @param {Score} scoreA
   * @param {Score} scoreB
   */
  #sortScores(scoreA, scoreB) {
    return scoreB.score - scoreA.score;
  }
}
