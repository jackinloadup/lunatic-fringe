import { GameConfig } from "../../config/gameConfig.js";
import { EnemyBase } from "../EnemyBase.js";
import { KillableAiGameObject } from "../KillableAiGameObject.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { QuasBlasterProjectile } from "../projectiles/QuadBlasterProjectile.js";

export class QuadBlaster extends KillableAiGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY, playerShip) {
        super(xLocation, yLocation, 40, 50, 0, NewMediaManager.Sprites.QuadBlaster, velocityX, velocityY, 16, 8, playerShip, 15, 40, 30);

        // TODO: Other sprites have sprite offset of 10???? handle this better? might be better as an offset constant or something
        this.BASE_SPRITE_X_OFFEST = 10;
        this.spriteXOffset = this.BASE_SPRITE_X_OFFEST;

        this.currentTicksInAnimationFrame = 0;
        this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES = 10;
        this.NUMBER_OF_ANIMATION_FRAMES = 8;
        // A full animation of the sprite is actually 1/4th of a turn for this enemy, so multiply number of frames times 4 here
        this.ROTATION_AMOUNT = (2 * Math.PI) / (this.NUMBER_OF_ANIMATION_FRAMES * 4);
        this.MAX_FIRE_RATE = 3 * 60;
        this.MIN_FIRE_RATE = 0.3 * 60;
        this.PROJECTILE_SPEED = 10;

        this.numberOfTicksSinceShooting = 0;
        this.shootingRechargeTime = this.getRechargeTimeForShooting();
        this.QUADRANTS = [
            0,
            Math.PI/2,
            -Math.PI/2,
            Math.PI
        ];

        // TODO: Is this necessary? How much does this improve performance? Is there another reason to do this? Check original commit
        this.inScene = false;
    }

    getRechargeTimeForShooting() {
        return (Math.random() * this.MAX_FIRE_RATE) + this.MIN_FIRE_RATE;
    }

    getAngleOfBarrelTowardPlayer() {
        let angleToPlayer = this.angleTo(this.playerShipReference);

        let quadrantAdjusted = [];
        for (let i = 0; i < 4; i++) {
            quadrantAdjusted[i] = this.QUADRANTS[i] + this.angle;
            if (quadrantAdjusted[i] > Math.PI) {
                quadrantAdjusted[i] -= Math.PI *2;
            }
            // Set closest if it is not defined or if the new value is smaller than the existing closest value
            if (!closest || Math.abs(quadrantAdjusted[i] - angleToPlayer) < Math.abs(closest - angleToPlayer)) {
                closest = quadrantAdjusted[i];
            }
        }

        return closest;
    }

    draw(context) {
        super.draw(context, 0, false);
        // Drawing means we are in the scene...?
        this.inScene = true;

        // Draw additional debug arc for which barrel is closest to the player
        if (GameConfig.debug) {
            let barrelAngle = this.getAngleOfBarrelToward();
            context.beginPath();
            context.strokeStyle = "green";
            context.moveTo(this.x, this.y);
            context.lineTo(this.x + Math.cos(barrelAngle) * this.collisionRadius * 2, this.y + Math.sin(barrelAngle) * this.collisionRadius * 2);
            context.stroke();

            context.beginPath();
            context.strokeStyle = "red";
            context.arc(this.x, this.y, this.collisionRadius + 2, barrelAngle-0.775, barrelAngle+0.775);
            context.lineWidth = 2;
            context.stroke();
        }
    }

    handleCollision(otherObject, objectManager) {
        // Quadblaster should ignore collisions with other Quadblasters and the enemy base
        let isIgnorableType = otherObject instanceof QuadBlaster || otherObject instanceof EnemyBase

        if (!isIgnorableType) {
            super.handleCollision(otherObject, objectManager);
        }
    }

    updateState(objectManager) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (!this.inScene) {
            // Don't perform the rest of the updates if not in scene
            return;
        }
        this.inScene = false;

        // Handle animation
        // TODO: This logic is the same as in the PlayerBase, make some sort of common function?
        this.currentTicksInAnimationFrame += 1;
        if (this.currentTicksInAnimationFrame >= this.NUMBER_OF_TICKS_BETWEEN_ANIMATION_FRAMES) {
            this.currentTicksInAnimationFrame = 0;
            this.spriteXOffset += this.width;
            this.angle += this.ROTATION_AMOUNT;
            if (this.angle > Math.PI) {
                this.angle -= 2 * Math.PI;
            }
            if (this.spriteXOffset >= (this.width * this.NUMBER_OF_ANIMATION_FRAMES)) {
                this.spriteXOffset = this.BASE_SPRITE_X_OFFEST;
            }
        }

        this.numberOfTicksSinceShooting++;

        if (this.numberOfTicksSinceShooting > this.shootingRechargeTime) {
            let barrelToPlayer = this.getAngleOfBarrelTowardPlayer();
            let angleToPlayer = this.angleTo(this.playerShipReference);
            let angleRatio = angleToPlayer/barrelToPlayer;
          if (angleRatio < 1.15 && angleRatio > 0.85) {
            // TODO: Original code had the bullet starting at location of blaster, not on edge of collision radius. Do we want to change that?
            let startingX = this.x + (-Math.cos(this.angle) * this.collisionRadius);
            let startingY = this.y + (-Math.sin(this.angle) * this.collisionRadius);
            let newQuadBlasterProjectile = new QuasBlasterProjectile(startingX, startingY, Math.cos(this.angle) * this.PROJECTILE_SPEED, Math.sin(this.angle) * this.PROJECTILE_SPEED);
            objectManager.addObject(newQuadBlasterProjectile, true);
            this.numberOfTicksSinceShooting = 0;
            this.shootingRechargeTime = this.getRechargeTimeForShooting();
          }
        }
    }
}