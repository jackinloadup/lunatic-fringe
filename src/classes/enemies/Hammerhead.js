import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { HammerheadWeapon } from "../projectiles/HammerheadWeapon.js";

export class Hammerhead extends KillableAiGameObject {
    static MAX_SPEED = 1;
    hammerheadWeaponReference = undefined;

    constructor(xLocation, yLocation, velocityX, velocityY, angle, playerShip) {
        super(xLocation, yLocation, Layer.HAMMERHEAD, 44, 51, angle, MediaManager.Sprites.Hammerhead, velocityX, velocityY, 14, 10, playerShip, 60, 150, 100);

        this.TURN_ABILITY = 0.020;
        this.ACCELERATION = 0.1;

        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
        this.PROJECTILE_SPEED = 4;

        // set the initial sprite x offset based on the angle given
        this.setSpriteXOffsetForAngle();

        // Create the initial Hammerhead weapon that spawns in
        // Number of pixels to offset the position of the hammerhead weapon so that it aligned with the rotation spot correctly
        this.HAMMERHEAD_WEAPON_Y_OFFSET = 10;
        this.HAMMERHEAD_THROW_DIRECTION_TOLERANCE = 0.13;
        this.HAMMERHEAD_WEAPON_THROW_RANGE_TOLERANCE = 0.05;
        this.DISTANCE_WILL_THROW_WEAPON_AT_PLAYER_SHIP = 550;
        const newHammerheadWeapon = new HammerheadWeapon(this.x, this.y - this.HAMMERHEAD_WEAPON_Y_OFFSET, 0, 0);
        this.hammerheadWeaponReference = newHammerheadWeapon;
        this.isHammerheadWeaponAttached = true;
        ObjectManager.addObject(newHammerheadWeapon, true);

        this.ticksSinceWeaponThrow = 0;
        this.TIME_TO_RESPAWN_NEW_HAMMER = this.hammerheadWeaponReference.LIFETIME_ONCE_THROW + 300 // 5 minutes after hammer would despawn from being thrown
    }

    setSpriteXOffsetForAngle() {
        // Calculate which frame of the sprite. Note the following reasons for each part of the calculation:
        // +(Math.PI / 2): The sprite for the Puffer starts straight up, so an angle offset of Math.PI/2 (a quarter rotation of a circle) is needed for this calculation so that the correct frame is chosen since an angle of 0 is pointing to the right not straight up.
        // +(this.ROTATION_AMOUNT / 2): Adding half of the rotation amount here so that each frame is centered around the angles that it applies to.
        // +this.angle: The angle the ship is currently pointing.
        // % (2 * Math.PI): Takes whatever the result of the calculation with the above values is and makes it between 0 (inclusive) and 2 * Math.PI (exclusive).
        // FUTURE TODO: Due to the isometric sprite view there are some instances where the angles don't line up great with the sprite (barely). So in the future might want to look into how to make the angles match up with the sprite a little better.
        let frameAngle = ((Math.PI / 2) + this.ROTATION_AMOUNT / 2 + this.angle) % (2 * Math.PI);
        let frame = Math.floor(frameAngle / this.ROTATION_AMOUNT);

        this.spriteXOffset = this.width * frame;
    }

    die() {
        super.die();

        // If hammerhead weapon is still attached to the ship, destory that too.
        if (this.isHammerheadWeaponAttached) {
            ObjectManager.removeObject(this.hammerheadWeaponReference);
        }
    }

    updateState() {
        let angleDiff = this.angleDiffTo(this.playerShipReference);

        // only move the ship angle toward player as fast as the turn ability will allow.
        if (angleDiff > 0) {
            if (this.TURN_ABILITY > angleDiff) {
                // only turn angle difference
                this.angle += angleDiff;
            } else {
                // turn maximum amount possible
                this.angle += this.TURN_ABILITY;
            }
        } else {
            // Will handle if angleDiff = 0 since this next statement will be guaranteed to be true so we will add angleDiff to the angle, which would be 0 (meaning the angle would not change)
            if (-1 * this.TURN_ABILITY < angleDiff) {
                // only turn angle difference
                // Note that the angle different here is already negative
                this.angle += angleDiff;
            } else {
                // turn maximum amount possible
                this.angle += -1 * this.TURN_ABILITY;
            }
        }

        // // Keep angle between 0 and 2 * Math.PI
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        } else if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (this.angle > 2 * Math.PI || this.angle < 0) {
            this.error(`Hammerhead angle ${this.angle} was outside of the expected range`);
        }

        this.setSpriteXOffsetForAngle();

        // The Hammerhead moves so slow that it feels better when it is always calculating acceleration, despite direction
        // This can result in the Hammerhead obriting the player but since it is so slow it only really happens when the player isn't moving
        this.calculateAcceleration();

        this.x += this.velocityX;
        this.y += this.velocityY;

        // If hammerhead weapon is still attached update its position to stay with the hammerhead
        if (this.isHammerheadWeaponAttached) {
            this.hammerheadWeaponReference.x = this.x;
            this.hammerheadWeaponReference.y = this.y - this.HAMMERHEAD_WEAPON_Y_OFFSET;
        } else {
            // hammerhead weapon is not attached
            this.ticksSinceWeaponThrow++;

            if (this.ticksSinceWeaponThrow > this.TIME_TO_RESPAWN_NEW_HAMMER) {
                // Spawn in new hammerhead weapon
                const newHammerheadWeapon = new HammerheadWeapon(this.x, this.y - this.HAMMERHEAD_WEAPON_Y_OFFSET, 0, 0);
                this.hammerheadWeaponReference = newHammerheadWeapon;
                this.isHammerheadWeaponAttached = true;
                ObjectManager.addObject(newHammerheadWeapon, true);
            }
        }

        // Check to see if the hammerhead weapon should be thrown
        // To be thrown, the angle of the hammerhead must be in an acceptable range and the angle of the hammerhead weapon must be in an acceptable range
        if (this.isHammerheadWeaponAttached
            && this.hammerheadWeaponReference.isReadyToBeThrown
            && angleDiff < this.HAMMERHEAD_THROW_DIRECTION_TOLERANCE
            && angleDiff > -this.HAMMERHEAD_THROW_DIRECTION_TOLERANCE
            && this.relativePositionTo(this.playerShipReference).magnitude() <= this.DISTANCE_WILL_THROW_WEAPON_AT_PLAYER_SHIP) {
            const hammerheadWeaponDiff = this.hammerheadWeaponReference.angleDiffTo(this.playerShipReference);
            // Hammerhead weapon is thrown when happen is at roughly 90 degrees (aka Pi/2) from the player
            if (hammerheadWeaponDiff < (Math.PI / 2) + this.HAMMERHEAD_WEAPON_THROW_RANGE_TOLERANCE && hammerheadWeaponDiff > (Math.PI / 2) - this.HAMMERHEAD_WEAPON_THROW_RANGE_TOLERANCE) {
                this.isHammerheadWeaponAttached = false;
                // throw hammerhead weapon and set lifetime
                const newProjectileVelocity = this.getNewProjectileVelocity(this.PROJECTILE_SPEED);
                this.hammerheadWeaponReference.detachFromHammerhead(newProjectileVelocity);
                this.ticksSinceWeaponThrow = 0;
            }
        }
    }
}