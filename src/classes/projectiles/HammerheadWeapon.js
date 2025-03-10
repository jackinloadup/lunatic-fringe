import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class HammerheadWeapon extends EnemyProjectile {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        super(xLocation, yLocation, Layer.HAMMERHEAD_WEAPON, 75, 55, 0, MediaManager.Sprites.HammerheadWeapon, velocityX, velocityY, 10, 0, undefined, 100);

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 3;
        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.spriteXOffset = 0;
        this.currentFrameOfAnimation = 0;
        // Angles for all of the sprites, in the order that the sprites are defined on the spritesheet. Due to the isometric view, this is more accurate than just increasing the angle by a set anount for each sprite frame
        this.frameAngles = [
            90,
            110.8,
            128.29,
            139.64,
            152.53,
            163.81,
            168.69,
            176.82,
            186.93,
            195.12,
            205.87,
            214.16,
            225,
            234.25,
            250.91,
            262.15,
            272.05,
            282.53,
            297.41,
            308.66,
            319.76,
            329.62,
            336.37,
            348.11,
            353.09,
            3.27,
            14.47,
            24.90,
            32.01,
            43.45,
            54.46,
            74.74
        ].map((degreeValue) => degreeValue * 2 * Math.PI / 360);

        this.LIFETIME_ONCE_THROW = 150;
        this.NUMBER_OF_TICK_TO_FADE_IN = 150;
        this.numberOfTicksSinceCreation = 0;
        this.isReadyToBeThrown = false;
        this.percentVisible = 0;
        this.isAttachedToHammerhead = true;
    }

    getCollisionCenterX() {
        return this.x + Math.cos(this.angle) * 17;
    }

    getCollisionCenterY() {
        return this.y + Math.sin(this.angle) * 15;
    }

    detachFromHammerhead(newVelocity) {
        this.velocityX = newVelocity.x;
        this.velocityY = newVelocity.y;
        this.lifetime = this.LIFETIME_ONCE_THROW;
        this.tickCountSinceCreation = 0;
        this.isAttachedToHammerhead = false;
    }

    handleCollision(otherObject) {
        // We only want to play a sound when the player is hit, so don't handle playing sound here, have player handle it.
        // Hammerhead weapons "barrel through" Sludger Mines, so don't die when this are hit
        // Hammerhead weapon is also not stopped by player projectiles
        // Hammerhead weapon is also invincible while attached to the hammerhead
        this.log("Projectile " + this.getClassName() + " hit " + otherObject.getClassName());
        if (!this.isAttachedToHammerhead && otherObject.layer !== Layer.SLUDGER_MINE && otherObject.layer !== Layer.PLAYER_PROJECTILE) {
            ObjectManager.removeObject(this);
        }
    }

    updateState() {
        // Perform normal updating state operations
        super.updateState();

        // Handle animation
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            if (this.spriteXOffset >= (this.width * this.NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = 0;
            }

            this.currentFrameOfAnimation = this.spriteXOffset / this.width;
            this.angle = this.frameAngles[this.currentFrameOfAnimation];
        }

        
        this.numberOfTicksSinceCreation += 1;
        // Set percent static for fade in effect
        if (this.numberOfTicksSinceCreation < this.NUMBER_OF_TICK_TO_FADE_IN) {
            this.percentVisible = 100 * (this.numberOfTicksSinceCreation / this.NUMBER_OF_TICK_TO_FADE_IN);
        } else if (this.percentVisible !== 100) {
            // Weapon is completely faded in, set percentage to 0 if not already there
            this.percentVisible = 100;
        }

        // Determine whether the weapon is ready to be thrown or not
        if (!this.isReadyToBeThrown && this.numberOfTicksSinceCreation > this.NUMBER_OF_TICK_TO_FADE_IN) {
            this.isReadyToBeThrown = true;
        }
    }
}