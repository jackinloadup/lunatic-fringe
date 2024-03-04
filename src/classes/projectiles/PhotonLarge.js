import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

export class PhotonLarge extends PlayerProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, 15, 16, 0, MediaManager.Sprites.PhotonLarge, velocityX, velocityY, 8, 0, 50, 120);
    }

    playCollisionSound() {
        // TODO: There is a sound for this that we do not have yet. Once this sound is obtained this should be replaced.
        // See sound https://www.youtube.com/watch?v=zZglGbYGRtI&t=928s
        MediaManager.Audio.CollisionDefaultWeapon.play();
    }

    handleCollision(otherObject) {
        this.log(this.getClassName() + " hit " + otherObject.getClassName());

        // The large photon also ignores SludgerMine enemies (it "barrels" through them)
        if (otherObject.layer !== Layer.PUFFER_PROJECTILE && otherObject.layer !== Layer.QUAD_BLASTER_PROJECTILE && otherObject.layer !== Layer.SLUDGER_MINE) {
            // Only play the weapon collision sound if not hitting an enemy projectile or sludger mine
            this.playCollisionSound();
        }

        if (otherObject.layer !== Layer.SLUDGER_MINE) {
            // Only remove object if not hitting a sludger mine, since the large photons barrel through sludger mines
            ObjectManager.removeObject(this);
        }
    }
}