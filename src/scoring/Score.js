export class Score {
  /**
   * @param {string} username
   * @param {number} score
   */
  constructor(username, score) {
    this.username = username;
    this.score = score;
  }

  toJSON() {
    return {
      username: this.username,
      score: this.score,
    };
  }
}
