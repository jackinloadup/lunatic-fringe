export function MediaManager() {
  this.Sprites = {};
  this.Audio = {};

  this.LoadSprite = function (name, file) {
      this.Sprites[name] = new Image();
      this.Sprites[name].src = file;
      this.Sprites[name].Loaded = false;
      this.Sprites[name].onload = function () { this.Loaded = true; };
  };

  // Leave off the extension. MP3 or OGG will be used depending on browser. You must supply both and they must share the same file name. Ugh, this could be better.
  this.LoadAudio = function (name, fileName) {
      var ext;

      this.Audio[name] = new Audio();

      if (this.Audio[name].canPlayType("audio/ogg") === "probably" || this.Audio[name].canPlayType("audio/ogg") === "maybe") {
          ext = ".ogg";
      } else if (this.Audio[name].canPlayType("audio/mpeg") === "probably" || this.Audio[name].canPlayType("audio/mped") === "maybe") {
          ext = ".mp3";
      } else {
          log("No supported audio format detected.");
      }

      this.Audio[name].src = fileName + ext;
      this.Audio[name].preload = "auto";
      this.Audio[name].Loaded = false;
      this.Audio[name].onload = function () { game.mediaManager.Audio[name].Loaded = true; };
  };

  this.LoadSprite("Base", "images/Base.png");
  this.LoadSprite("EnemyBase", "images/EnemyBase.png");
  this.LoadSprite("Pebbles", "images/Pebbles.png");
  this.LoadSprite("PhotonQuad", "images/PhotonQuad.png");
  this.LoadSprite("PhotonSmall", "images/PhotonSmall.png");
  this.LoadSprite("PhotonMedium", "images/PhotonMedium.png");
  this.LoadSprite("PhotonLarge", "images/PhotonLarge.png");
  this.LoadSprite("PlayerShip", "images/PlayerShip.png");
  this.LoadSprite("PlayerShipInvulnerable", "images/PlayerShipInvulnerable.png");
  this.LoadSprite("Puffer", "images/Puffer.png");
  this.LoadSprite("QuadBlaster", "images/Quadblaster.png");
  this.LoadSprite("Rocko", "images/Rocko.png");
  this.LoadSprite("Slicer", "images/Slicer.png");
  this.LoadSprite("Sludger", "images/Sludger.png");
  this.LoadSprite("SludgerMine", "images/SludgerMine.png");
  this.LoadSprite("PufferShot", "images/PufferShot.png");
  this.LoadSprite("SpreadShot", "images/SpreadShot.png");
  this.LoadSprite("DoublePoints", "images/DoublePoints.png");
  this.LoadSprite("ExtraFuel", "images/ExtraFuel.png");
  this.LoadSprite("SpareParts", "images/SpareParts.png");
  this.LoadSprite("ShipRepairs", "images/RepairShip.png");
  this.LoadSprite("Invulnerability", "images/Invulnerability.png");
  this.LoadSprite("TurboThrust", "images/TurboThrust.png");

  this.LoadAudio("CollisionGeneral", "audio/collision_general");
  this.LoadAudio("CollisionSpreadshot", "audio/collision_spreadshot");
  this.LoadAudio("CollisionQuad", "audio/collision_quad");
  this.LoadAudio("CollisionDefaultWeapon", "audio/collision_defaultweapon");
  this.LoadAudio("PhotonSmall", "audio/PhotonSmall");
  this.LoadAudio("PhotonBig", "audio/PhotonBig")
  this.LoadAudio("PhotonSpread", "audio/PhotonSpread");
  this.LoadAudio("StartUp", "audio/StartUp");
  this.LoadAudio("SludgerMinePop", "audio/SludgerMinePop");
  this.LoadAudio("PlayerDeath", "audio/PlayerDeath");
  this.LoadAudio("SludgerDeath", "audio/SludgerDeath");
  this.LoadAudio("BaseRepair", "audio/baserepair");
  this.LoadAudio("PowerupWow", "audio/powerup_wow");
  this.LoadAudio("LowFuel", "audio/Low_Fuel");
  this.LoadAudio("InvincibleCollision", "audio/invincible_collision");
  this.LoadAudio("InvincibleOrBoost", "audio/invincible_boost");
  this.LoadAudio("NewLevel", "audio/newlevel");
  this.LoadAudio("RepairOrFuelPowerup", "audio/repair_fuel");
  this.LoadAudio("SlicerAttack", "audio/Slicer_attack");

  this.loaded = function () {
    var sprite, numLoaded = 0, total = 0;
    for (sprite in this.Sprites) {
      if (this.Sprites.hasOwnProperty(sprite)) {
        if (this.Sprites[sprite].Loaded) {
          numLoaded += 1;
        }
        total += 1;
      }
    }
    /*log(numLoaded + " of " + total + " sprites loaded");
    log(numLoaded / total * 100 + "%");*/
    return numLoaded / total * 100;
  };
};

// untested loaded checker
//var isloaded = function () {
//  var percent = mediaManager.loaded();
//  if (percent < 100) {
//    setTimeout(isloaded, 0);
//  }
//}
//setTimeout(isloaded, 0);
