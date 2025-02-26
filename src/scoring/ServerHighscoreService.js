/**
 * Tracks highscores remotely on a server. The server specified by the 
 * `baseUrl` provided during construction must:
 * 1. Have a `/scores` path.
 * 1. Support `GET` and `POST` methods at the `/scores` path.
 * 1. `GET` responds with all the currently saved highscores.
 * 1. `POST` accepts an object shaped like {@link Score}, saves it as a new
 * highscore if it's better than an existing one (or there are fewer saved 
 * highscores than the server will track), and responds with the highscores
 * as of the possible addition of the submitted score.
 */
export class ServerHighscoreService {
  static #HIGHSCORES_BASE_PATH = '/scores';

  /**
   * @type {string}
   */
  #baseUrl;

  get #scoresUrl() {
    return new URL(`${this.#baseUrl}${ServerHighscoreService.#HIGHSCORES_BASE_PATH}`);
  }

  /**
   * @param {string} baseUrl - The base for the URL of the highscore server.
   * This needs to be the scheme, address, port, and any base that the server
   * uses. Do not use a trailing slash. Example: `https://lunatichighscores.com/api`.
   */
  constructor(baseUrl) {
    this.#baseUrl = baseUrl;
  }

  /**
   * @returns {Promise<Score[]>} - The highscores, in descending order. This array
   * will never be any larger than the number of highscores the service is configured
   * to track.
   */
  async getHighscores() {
    try {
      const res = await fetch(this.#scoresUrl);

      if (res.ok) {
        return res.json();
      }
    } catch (_err) {}

    return [];
  }

  /**
   * Submits the provided `score` to the highscore system. If the score is better
   * than an existing highscore or the server has saved fewer highscores than it
   * tracks, it will replace that score in persistence.
   *
   * @param {Score} score - The score to submit for evaluation.
   *
   * @returns {Promise<Score[]>} The current highscores after evaluating the
   * submission.
   */
  async submitScore(score) {
    try {
      const res = await fetch(this.#scoresUrl, {
        method: 'POST',
        body: JSON.stringify(score),
        mode: this.#scoresUrl.host !== location.host ? 'cors' : undefined,
      });

      if (res.ok) {
        return res.json();
      }
    } catch (_err) {}

    return [];
  }
}
