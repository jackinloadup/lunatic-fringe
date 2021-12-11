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
        log(thisName + " died!");
        this.playDeathSound();
        ObjectManager.removeObject(this);
        
        // Increase count of number of enemies killed, even if not killed by player
        // TODO: Is this value ever used...?
        GameServiceManager.increaseEnemiesKilledCount(1);
    }

    handleCollision(otherObject) {
        // TODO: Move this into other class files?
        let thisName = this.getClassName();
        let otherName = otherObject.getClassName();
        if (otherObject.layer === Layer.SLUDGER_MINE) {
            // SludgerMines are weak, so if they collide with anything they should die and the other
            // object should not get hurt or have their physics be affected, so return
            return;
        } else if (otherObject.layer === Layer.PLAYER_PROJECTILE || otherObject.layer === Layer.PUFFER_PROJECTILE || otherObject.layer === Layer.QUAD_BLASTER_PROJECTILE) {	
            // TODO: Should projectiles not have physics effects when hit? Currently they don't but maybe they should?			
            log(thisName + " hit by Projectile: " + otherName);
            this.health -= otherObject.damage;
            log(thisName + " health is now: " + this.health);
            if (this.health <= 0) {
                this.die();

                if(otherObject.layer === Layer.PLAYER_PROJECTILE) {
                    //Only award points if the player was the one to kill the this				
                    playerShip.addToScore(this.pointValue);
                }
            }
        } else if (otherObject.layer === Layer.PLAYER) {
            super.handleCollision(otherObject);
            log(thisName + " hit by the player");
            if(otherObject.isTurboThrusting()) {
                // Turbo thrusting player instantly kills any enemy (with the exception of the asteroids and enemy base)
                this.health = 0;
            } else {
                this.health -= otherObject.damageCausedByCollision;
            }
            log(thisName + " health is now: " + this.health);
            // If this dies from a player hitting it, points are still awarded
            if (this.health <= 0) {
                this.die();

                // Player killed the enemy, award points
                playerShip.addToScore(this.pointValue);
            }
        } else if (otherObject.layer === Layer.ASTEROID || otherObject.layer === Layer.PUFFER || otherObject.layer === Layer.QUAD_BLASTER || otherObject.layer === Layer.SLICER || otherObject.layer === Layer.SLUDGER) {
            super.handleCollision(otherObject);
            log(thisName + " hit by Game Object: " + otherName);
            this.health -= otherObject.damageCausedByCollision;
            log(thisName + " health is now: " + this.health);
            if (this.health < 0) {
                this.die();
            }
        }
    }
}