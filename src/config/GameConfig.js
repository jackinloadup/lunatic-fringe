export let GameConfig = {
    debug: false,
    showPowerupsOnRadar: true

    /*
    As I review gameplay footage and find offical values for parts of the games
    I will add the values here so that I know it is the official value. Keeping the
    values in a config also opens the door for allowing someone to tweak the values
    to their enjoyment when they play.
    */

   // Default playing shooting speed. Represents the number of frames that must pass before a bullet can be shoot again.
   // A speed of 13 matches up best with the original game's rate of fire at 60fps
   DEFAULT_SHOOTING_SPEED: 13,

   // Duration that the Power Shield (invulnerability) powerup lasts
   POWER_SHIELD_DURATION_IN_SECONDS: 40,

   // Number of shots the Large Photon power up lasts
   LARGE_PHOTON_NUMBER_OF_SHOTS: 10,

   // Number of shots the Spreadshot power up lasts
   SPREAD_SHOT_NUMBER_OF_SHOTS: 30
};