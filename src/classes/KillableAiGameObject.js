import { Vector } from "../utility/Vector.js";
import { AiGameObject } from "./AiGameObject.js";
import { GameServiceManager } from "./managers/GameServiceManager.js";
import { Layer } from "./managers/Layer.js";
import { NewMediaManager } from "./managers/NewMediaManager.js";
import { ObjectManager } from "./managers/ObjectManager.js";

export class KillableAiGameObject extends AiGameObject {
    constructor(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision, health, pointValue) {
        super(xLocation, yLocation, layer, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision);

        this.health = health;
        this.pointValue = pointValue;
    }

    playDeathSound() {
        // Sludger death sound is used for all enemy deaths except the sludger mine
        NewMediaManager.Audio.SludgerDeath.play();
    }

    die() {
        this.log(this.getClassName() + " died!");
        this.playDeathSound();
        ObjectManager.removeObject(this);
        
        // Increase count of number of enemies killed, even if not killed by player
        // TODO: Is this value ever used...?
        GameServiceManager.increaseEnemiesKilledCount(1);
    }

    handleCollision(otherObject) {
        let thisName = this.getClassName();
        let otherName = otherObject.getClassName();
        if (otherObject.layer === Layer.SLUDGER_MINE) {
            // SludgerMines are weak, so if they collide with anything they should die and the other
            // object should not get hurt or have their physics be affected, so return
            return;
        } else if (otherObject.layer === Layer.PLAYER_PROJECTILE || otherObject.layer === Layer.PUFFER_PROJECTILE || otherObject.layer === Layer.QUAD_BLASTER_PROJECTILE) {	
            // FUTURE TODO: Based on some small gameplay clips I found, projectiles should cause physics affects on the colliding object! (Based on the gameplay where enemy base bullet affects physics of
            // player ship). So we will still want to call super.handleCollision here, as well as give all of the projectiles a mass value.?			
            this.log(thisName + " hit by Projectile: " + otherName);
            this.health -= otherObject.damage;
            this.log(thisName + " health is now: " + this.health);
            if (this.health <= 0) {
                this.die();

                if(otherObject.layer === Layer.PLAYER_PROJECTILE) {
                    //Only award points if the player was the one to kill the this				
                    this.playerShipReference.addToScore(this.pointValue);
                }
            }
        } else if (otherObject.layer === Layer.PLAYER) {
            super.handleCollision(otherObject);
            this.log(thisName + " hit by the player");
            if(otherObject.isTurboThrusting()) {
                // Turbo thrusting player instantly kills any enemy (with the exception of the asteroids and enemy base)
                this.health = 0;
            } else {
                this.health -= otherObject.damageCausedByCollision;
            }
            this.log(thisName + " health is now: " + this.health);
            // If this dies from a player hitting it, points are still awarded
            if (this.health <= 0) {
                this.die();

                // Player killed the enemy, award points
                this.playerShipReference.addToScore(this.pointValue);
            }
        } else if (otherObject.layer === Layer.ASTEROID || otherObject.layer === Layer.PUFFER || otherObject.layer === Layer.QUAD_BLASTER || otherObject.layer === Layer.SLICER || otherObject.layer === Layer.SLUDGER) {
            super.handleCollision(otherObject);
            this.log(thisName + " hit by Game Object: " + otherName);
            this.health -= otherObject.damageCausedByCollision;
            this.log(thisName + " health is now: " + this.health);
            if (this.health < 0) {
                this.die();
            }
        }
    }

    getNewProjectilePosition(angleOffset = 0) {
        return new Vector(this.x + (Math.cos(this.angle + angleOffset) * this.collisionRadius), this.y + (Math.sin(this.angle + angleOffset) * this.collisionRadius));
    }

    getNewProjectileVelocity(projectileSpeed, angleOffset = 0) {
        return new Vector(this.velocityX + (Math.cos(this.angle + angleOffset) * projectileSpeed), this.velocityY + (Math.sin(this.angle + angleOffset) * projectileSpeed));
    }
}