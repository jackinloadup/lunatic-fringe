import { AiGameObject } from "./aiGameObject.js";
import { Asteroid } from "./asteroids/asteroid.js";
import { SludgerMineTest } from "./enemies/SludgerMine.js";
import { NewMediaManager } from "./NewMediaManager.js";
import { PlayerShipTest } from "./PlayerShip.js";
import { PlayerProjectile } from "./projectiles/PlayerProjectile.js";
import { Projectile } from "./projectiles/Projectile.js";

export class KillableAiGameObject extends AiGameObject {
    constructor(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision, health, pointValue) {
        super(xLocation, yLocation, width, height, angle, sprite, velocityX, velocityY, collisionRadius, mass, playerShip, damageCausedByCollision);

        this.health = health;
        this.pointValue = pointValue;
    }

    handleCollision(otherObject, objectManager) {
        // TODO: Move this into other class files?
        var thisName = this.getClassName();
        var otherName = otherObject.getClassName();
        if (otherObject instanceof SludgerMineTest) {
            // SludgerMines are weak, so if they collide with anything they should die and the other
            // object should not get hurt, so return
            return;
        } else if (otherObject instanceof Projectile) {	
            // TODO: Should projectiles not have physics effects when hit? Currently they don't but maybe they should?			
            log(thisName + " hit by Projectile: " + otherName);
            this.health -= otherObject.damage;
            log(thisName + " health is now: " + this.health);
            if (this.health <= 0) {
                // this object dies
                log(thisName + " died!");
                // TODO: Have objects handle their own death, including playing the appropriate sound!
                if (this instanceof SludgerMineTest) {
                    NewMediaManager.Audio.SludgerMinePop.play();
                } else {
                    NewMediaManager.Audio.SludgerDeath.play();
                }
                objectManager.removeObject(this);
                
                // TODO: Have game/object manager handle keeping track of number of enemies killed
                // This could be handled in a removeEnemy method that functions like removeObject?
                // numEnemiesKilled++;

                if(otherObject instanceof PlayerProjectile) {
                    //Only award points if the player was the one to kill the this				
                    playerShip.addToScore(this.pointValue);
                }
            }
        } else if (otherObject instanceof PlayerShipTest) {
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
                // this dies
                log(thisName + " died!");
                // TODO: Have objects handle their own death, including playing the appropriate sound!
                if (this instanceof SludgerMineTest) {
                    NewMediaManager.Audio.SludgerMinePop.play();
                } else {
                    NewMediaManager.Audio.SludgerDeath.play();
                }
                objectManager.removeObject(this);

                // TODO: Have game/object manager handle keeping track of number of enemies killed
                // numEnemiesKilled++;

                playerShip.addToScore(this.pointValue);
            }
        } else if (otherObject instanceof AiGameObject || otherObject instanceof Asteroid) {
            super.handleCollision(otherObject);
            log(thisName + " hit by Game Object: " + otherName);
            this.health -= otherObject.damageCausedByCollision;
            log(thisName + " health is now: " + this.health);
            if (this.health < 0) {
                // this dies, no points awared as the player had nothing to do with it
                log(thisName + " died!");
                // TODO: Have objects handle their own death, including playing the appropriate sound!
                if (this instanceof SludgerMineTest) {
                    NewMediaManager.Audio.SludgerMinePop.play();
                } else {
                    NewMediaManager.Audio.SludgerDeath.play();
                }
                objectManager.removeObject(this);
                
                // TODO: Have game/object manager handle keeping track of number of enemies killed
                // numEnemiesKilled++;
            }
        }
    }
}