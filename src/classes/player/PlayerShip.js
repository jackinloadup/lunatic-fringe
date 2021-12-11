import { Vector } from "../../utility/Vector.js";
import { InteractableGameObject } from "../InteractableGameObject.js";
import { CollisionManager } from "../managers/CollisionManager.js";
import { GameServiceManager } from "../managers/GameServiceManager.js";
import { KeyStateManager } from "../managers/KeyManager.js";
import { Layer } from "../managers/Layer.js";
import { NewMediaManager } from "../managers/NewMediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { PhotonLarge } from "../projectiles/PhotonLarge.js";
import { PhotonMedium } from "../projectiles/PhotonMedium.js";
import { PhotonSmall } from "../projectiles/PhotonSmall.js";
import { PowerupStateManager } from "./PowerupStateManager.js";

export class PlayerShip extends InteractableGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        // TODO: Make starting position 1 pixel offset from center of canvas to line up better with base?
        // Collision radius of 12 is a good balance between wings sticking out and body taking up the whole circle
        // Start at angle of Math.PI / 2 so angle matches sprite. Normally since the canvas is y flipped from a normal graph you would want
        //      -Math.PI / 2 to be pointing straight up, but the ships forces are opposites all other objects
        super(xLocation, yLocation, Layer.PLAYER ,42, 37, Math.PI / 2, NewMediaManager.Sprites.PlayerShip, velocityX, velocityY, 12, 10);
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better

        this.MAX_SPEED = 12;
        this.ACCELERATION = 0.1;
        this.damageCausedByCollision = 10;

        this.currentLives = 3;
        this.MAXIMUM_HEALTH = 100;
        this.health = this.MAXIMUM_HEALTH;
        this.updateDocumentHealth();
        this.MAXIMUM_FUEL = 1500;
        this.fuel = this.MAXIMUM_FUEL;
        this.updateDocumentFuel();
        this.MAXIMUM_SPARE_PARTS = 100;
        this.spareParts = this.MAXIMUM_SPARE_PARTS
        this.updateDocumentSpareParts();

        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
        this.spriteYOffset = 0; // Start with sprite not showing thrusters

        this.isAccelerating = false;
        this.atBase = false;
        this.isLowFuel = false;

        this.lowFuelSoundPlayCount = 0;
        this.LOW_FUEL_SOUND_PLAY_COUNT_MAX = 3;
        NewMediaManager.Audio.LowFuel.addEventListener('ended', function() {
            if (this.lowFuelSoundPlayCount < this.LOW_FUEL_SOUND_PLAY_COUNT_MAX) {
                NewMediaManager.Audio.LowFuel.play();
                this.lowFuelSoundPlayCount++;
            } else {
                this.lowFuelSoundPlayCount = 0;
            }
        });

        this.numFramesSince = {
            left: 0,
            right: 0,
            shooting: 0,
			repair: 0,
			death: 0,
            healFromSparePart: 0,
            takenDamage: 0
		}

        this.score = 0;
        this.powerupStateManager = new PowerupStateManager(this);
        // Possible bullet states
		this.BULLETS = {
			SMALL: 1,
			SPREADSHOT: 2,
			LARGE: 3
		};
        this.bulletState = this.BULLETS.SMALL;
		this.DEFAULT_SHOOTING_SPEED = 13; // Shooting speed without powerups and with normal bullets
		this.bulletShootingSpeed = this.DEFAULT_SHOOTING_SPEED;
        this.PROJECTILE_SPEED = 10;
		this.scoreMultiplier = 1;
		// The speed you got at when using the turbo thrust powerup
		this.SPEED_OF_TURBO_THRUST = 2 * this.MAX_SPEED;
		// What to set the speed of the ship to after turbo thrusting so you get a little "drifting" after the boost
		this.SPEED_AFTER_TURBO_THRUST = 1;

        this.turboThrustActive = false;
        this.invulnerabilityActive = false;
    }

    processInput() {
        this.isAccelerating = false;

        // TODO: Move updates frames into update state? Combine the two functions?? Why does it need to be separate? really this should just be part of the updateState for the player ship since no other objects have this function...
        for (let i in this.numFramesSince) {
            if (this.numFramesSince.hasOwnProperty(i)) {
                this.numFramesSince[i] += 1;
            }
        }
        
        this.powerupStateManager.updateDurations();

        if (KeyStateManager.isDown(KeyStateManager.UP) && this.fuel > 0 && !this.isTurboThrusting()) {
            this.isAccelerating = true;
            this.updateFuel(-1);
            this.calculateAcceleration();
            this.spriteYOffset = this.height;
        } else {
            this.spriteYOffset = 0;
        }

        if (KeyStateManager.isDown(KeyStateManager.LEFT) && this.numFramesSince.left >= 3 && !this.isTurboThrusting()) {
            this.numFramesSince.left = 0;
            this.spriteXOffset -= this.width;
            this.angle -= this.ROTATION_AMOUNT;
            if (this.spriteXOffset < 0) {
                this.spriteXOffset = this.width * this.NUMBER_OF_ANIMATION_FRAMES - this.width;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.RIGHT) && this.numFramesSince.right >= 3 && !this.isTurboThrusting()) {
            this.numFramesSince.right = 0;
            this.spriteXOffset += this.width;
            this.angle += this.ROTATION_AMOUNT;
            if (this.spriteXOffset >= this.width * this.NUMBER_OF_ANIMATION_FRAMES) {
                this.spriteXOffset = 0;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.SPACE) && !this.atBase && !this.isTurboThrusting()) {
            if (this.numFramesSince.shooting >= this.bulletShootingSpeed) { // 13 matches up best with the original game's rate of fire at 60fps
                let photon;
                let photonX = this.x + (-Math.cos(this.angle) * this.collisionRadius)
                let photonY = this.y + (-Math.sin(this.angle) * this.collisionRadius)
                let photonVelocityX = -Math.cos(this.angle) * this.PROJECTILE_SPEED;
                let photonVelocityY = -Math.sin(this.angle) * this.PROJECTILE_SPEED;
                if (this.bulletState == this.BULLETS.SMALL) {
                    photon = new PhotonSmall(photonX, photonY, photonVelocityX, photonVelocityY);
                    NewMediaManager.Audio.PhotonSmall.play();
                } else if (this.bulletState == this.BULLETS.LARGE) {
                    photon = new PhotonLarge(photonX, photonY, photonVelocityX, photonVelocityY);
                    NewMediaManager.Audio.PhotonBig.play();
                } else if (this.bulletState == this.BULLETS.SPREADSHOT) {
                    let photonVelocityX2 = -Math.cos(this.angle + (Math.PI / 16)) * this.PROJECTILE_SPEED;
                    let photonVelocityY2 = -Math.sin(this.angle + (Math.PI / 16)) * this.PROJECTILE_SPEED;
                    let photonVelocityX3 = -Math.cos(this.angle - (Math.PI / 16)) * this.PROJECTILE_SPEED;
                    let photonVelocityY3 = -Math.sin(this.angle - (Math.PI / 16)) * this.PROJECTILE_SPEED;
                    photon = new PhotonMedium(photonX, photonY, photonVelocityX, photonVelocityY);
                    let photon2 = new PhotonMedium(photonX, photonY, photonVelocityX2, photonVelocityY2);
                    let photon3 = new PhotonMedium(photonX, photonY, photonVelocityX3, photonVelocityY3);
                    // TODO: investigate why photon 2 falls behind the other photons when shooting sometimes
                    ObjectManager.addObject(photon2, true);
                    ObjectManager.addObject(photon3, true);
                    NewMediaManager.Audio.PhotonSpread.play();
                }
                ObjectManager.addObject(photon, true);
                this.numFramesSince.shooting = 0;
            }
        }
        
        if (KeyStateManager.isDown(KeyStateManager.V)) {
            this.powerupStateManager.activateStoredPowerup('V')
        }
        
        if (KeyStateManager.isDown(KeyStateManager.B)) {
            this.powerupStateManager.activateStoredPowerup('B')
        }
        
        // Allow a keypress of K to autokill the player. Do not allow this event to be fired more than once per second (60 frames) or when the player is at the base.
        if(KeyStateManager.isDown(KeyStateManager.K) && this.numFramesSince.death > 60 && !this.atBase) {
            this.die();
        }
    }

    addToScore(amount) {
        this.score += amount * this.scoreMultiplier;
    }

    isInvulnerable() {
        return this.invulnerabilityActive;
    }

    isTurboThrusting() {
        return this.turboThrustActive;
    }

    updateHealth(healthChange) {
        if (healthChange < 0) {
            this.numFramesSince.takenDamage = 0;
        }

        this.log("ship Health: " + this.health + ", changing by: " + healthChange);
        this.health += healthChange;

        if (this.health > this.MAXIMUM_HEALTH) {
            this.health = this.MAXIMUM_HEALTH;
        } else if (this.health <= 0) {
            this.health = 0;
            this.die();
        }

        this.updateDocumentHealth();
    }

    updateDocumentHealth() {
        // Update the document
        document.getElementById('health').setAttribute('value', this.health);
    }

    updateFuel(fuelChange) {
        this.fuel += fuelChange;

        if (this.fuel > this.MAXIMUM_FUEL) {
            this.fuel = this.MAXIMUM_FUEL;
        } else if (this.fuel <= 0) {
            this.fuel = 0;
        }

        this.updateDocumentFuel();
    }

    updateDocumentFuel() {
        // Update the document
        document.getElementById('fuel').setAttribute('value', this.fuel);
    }

    updateSpareParts(sparePartsChange) {
        this.spareParts += sparePartsChange;

        if (this.spareParts > this.MAXIMUM_SPARE_PARTS) {
            this.spareParts = this.MAXIMUM_SPARE_PARTS;
        } else if (this.spareParts < 0) {
            this.spareParts = 0;
        }

        this.updateDocumentSpareParts();
    }

    updateDocumentSpareParts() {
        // Update the document
        document.getElementById('spareParts').setAttribute('value', this.spareParts);
    }

    playCollisionSound(otherObject) {
        if (otherObject.layer === Layer.SLUDGER_MINE) {
            // Hitting sludger mines does not make any collision sound, the only sound comes from the sludger mine death
            return;
        } else if (this.isInvulnerable()) {
            NewMediaManager.Audio.InvincibleCollision.play();
        } else {
            NewMediaManager.Audio.CollisionGeneral.play();
        }
    }

    handleCollision(otherObject) {
        if (otherObject.layer === Layer.QUAD_BLASTER_PROJECTILE || otherObject.layer === Layer.PUFFER_PROJECTILE) {
            this.log("Player was hit by projectile: " + otherObject.getClassName());
            this.playCollisionSound(otherObject);
            if (!this.isInvulnerable()) {
                this.updateHealth(-1*otherObject.damage);
            }
        } else if (otherObject.layer === Layer.ASTEROID || CollisionManager.isEnemyLayer(otherObject.layer)) {
            this.log("Player hit: " + otherObject.getClassName());
            if (!this.isTurboThrusting() || otherObject.layer === Layer.ASTEROID || otherObject.layer === Layer.ENEMY_BASE) {
                // Hitting other objects (besides asteroids and the enemy base) only changes your direction and speed if you are not turbo thrusting
                super.handleCollision(otherObject);
            }	
            this.playCollisionSound(otherObject);
            if (!this.isInvulnerable()) {
                this.updateHealth(-1*otherObject.damageCausedByCollision);
            }		
        } else if (otherObject.layer === Layer.PLAYER_BASE && !this.isTurboThrusting()) {
            // TODO: Clean up this code at all?
            this.atBase = true;
            // Make it so that the ship will go towards the Player Base
            // These are the coordinates the Base should be at if the ship is centered on the base
            // TODO: Store these values in the config, along with Enemy base coordinates. Currently rely on having access to context...maybe just get Base location from other object instead?
            let baseX = otherObject.x; //context.canvas.width / 2 - (this.width / 2);
            let baseY = otherObject.y; //context.canvas.height / 2 - (this.height / 2) + 2.5;
            // There will be rounding error with the program, so don't check that the 
            // values are equal but rather that they are within this threshold
            let threshold = .5; 
            if (this.velocityX == 0 && this.velocityY == 0 && Math.abs(otherObject.x - baseX) < threshold && Math.abs(otherObject.y - baseY) < threshold) {
                //The player ship is stopped at the base
                
                if (this.numFramesSince.repair >= 60 && (this.health < this.MAXIMUM_HEALTH || this.fuel < this.MAXIMUM_FUEL)) {
                    //Repair ship
                    this.numFramesSince.repair = 0;
                    NewMediaManager.Audio.BaseRepair.play();
                    if (this.health < this.MAXIMUM_HEALTH) {
                        this.updateHealth(3);
                    }
                    if (this.fuel < this.MAXIMUM_FUEL) {
                        this.updateFuel(25);
                    }
                }
            } else if (!this.isAccelerating && (Math.abs(otherObject.x - baseX) > threshold || Math.abs(otherObject.y - baseY) > threshold)) {
                // Only pull the ship in if it is not accelerating
                
                let vectorToBase = new Vector(otherObject.x - baseX, otherObject.y - baseY);
                let playerShipVelocity = new Vector(this.velocityX, this.velocityY);
                let velocityChange = playerShipVelocity.add(vectorToBase).scale(0.001);
                let minimumVelocityChangeMagnitude = 0.08;
                if (velocityChange.magnitude() < minimumVelocityChangeMagnitude) {
                    // Change the magnitude to the minimum magnitude
                    velocityChange = velocityChange.scale(minimumVelocityChangeMagnitude / velocityChange.magnitude());
                }
                
                //let dampeningFactor = Math.sqrt(playerShipVelocity.Magnitude()/this.MaxSpeed)*0.09+.9;
                let dampeningFactor = playerShipVelocity.magnitude()/this.MAX_SPEED*0.09+.9;
                
                let mag = playerShipVelocity.magnitude();
                if (mag < .5) {
                    dampeningFactor = .90;
                } else if (mag < .6) {
                    dampeningFactor = .92;
                } else if (mag < .75) {
                    dampeningFactor = .94;
                } else if (mag < 1) {
                    dampeningFactor = .96;
                } else if (mag < 2) {
                    dampeningFactor = .98;
                } else {
                    dampeningFactor = .99;
                }
                
                let minimumDampening = .9;
                if (dampeningFactor < minimumDampening) {
                    dampeningFactor = minimumDampening;
                }
                this.velocityX += velocityChange.x;
                this.velocityX *= dampeningFactor;
                this.velocityY += velocityChange.y;
                this.velocityY *= dampeningFactor;
            } else if (!this.isAccelerating && this.velocityX != 0 && this.velocityY != 0) {
                this.velocityX = this.velocityX/4;
                this.velocityY = this.velocityY/4;
                if (this.velocityX < 0.000001 && this.velocityY < 0.00001) {
                    this.velocityX = 0;
                    this.velocityY = 0;
                }
            }
        } else if (CollisionManager.isPowerupLayer(otherObject.layer)) {
            this.powerupStateManager.obtainPowerup(otherObject);
        }
    }

    die() {
        // TODO: Many object manager references in here....import that static service once it is made
        NewMediaManager.Audio.PlayerDeath.play();

        this.velocityX = 0;
        this.velocityY = 0;
        this.angle = Math.PI / 2;
        this.spriteXOffset = 0;

        this.lives--;

        if (this.lives <= 0) {
            GameServiceManager.endGame();
        } else {
            if (this.lives === 1) {
                GameServiceManager.displayMessage("1 life left", 60 * 5)
            } else {
                GameServiceManager.displayMessage(this.lives + " lives left", 60 * 5)
            }
            // TODO: Fixes this. Probably just make it a function objectManager deals with.
            GameServiceManager.movePlayerShipTo(Math.random() * (ObjectManager.GameBounds.Right - ObjectManager.GameBounds.Left + 1) + ObjectManager.GameBounds.Left, Math.random() * (ObjectManager.GameBounds.Bottom - ObjectManager.GameBounds.Top + 1) + ObjectManager.GameBounds.Top);

            // reset health and fuel and spare parts to full
            this.log("Setting ship back to max health/fuel/spare parts");
            this.updateHealth(this.MAXIMUM_HEALTH);
            this.updateFuel(this.MAXIMUM_HEALTH);
            this.updateSpareParts(this.MAXIMUM_SPARE_PARTS);

            // deactivate all active powerups
            this.powerupStateManager.deactivateAllActivePowerups();

            // NOTE: You do not gain any stored powerups when you die (nor do you lose the ones you had)

            // reset all number of frames values
            for (i in this.numFramesSince) {
                if (this.numFramesSince.hasOwnProperty(i)) {
                    this.numFramesSince[i] = 0;
                }
            }
        }
    }

    updateState() {
        // TODO: Should all of this.numFramesSince values be updated here???

        if (this.atBase) {
            // remove the at base indicator so that if we have left the base it goes away
            // TODO: Is this necessary? Where is it used that we need to store the value in the object that we are at base?
            this.atBase = false;
        }

        // TODO: Move this inside of the game manager, player should not be in charge of this.
        if (GameServiceManager.enemiesRemaining() == 0) {
            GameServiceManager.displayMessage("You conquered the fringe with a score of " + score, 99999999);
            this.velocityX = 0;
            this.velocityY = 0;
            ObjectManager.removeObject(this);
        }

        // update the power up state
        this.powerupStateManager.updatePowerupState();

        // Handle playing the initial low fuel sound
        // TODO: Move this const elsewhere?
        const fuelSoundThreshold = (this.MAXIMUM_FUEL / 5);
        if (this.fuel < fuelSoundThreshold && !this.isLowFuel) {
            NewMediaManager.Audio.LowFuel.play();
            this.isLowFuel = true;
        } else if (this.fuel > fuelSoundThreshold && this.isLowFuel) {
            this.isLowFuel = false;
        }

        // Handle healing from spare parts
        if (this.health < this.MAXIMUM_HEALTH && this.spareParts > 0 && this.numFramesSince.healFromSparePart > 30 && this.numFramesSince.takenDamage > 120) {
            this.numFramesSince.healFromSparePart = 0;
            this.updateSpareParts(-1);
            this.updateHealth(1);

            // TODO: I don't remember if there was a sound played here. I'll leave it out for now until I know for sure there was one
        }
    }
}