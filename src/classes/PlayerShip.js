import { NewVector } from "../utility/newVector.js";
import { AiGameObject } from "./AiGameObject.js";
import { Asteroid } from "./asteroids/Asteroid.js";
import { Slicer } from "./enemies/Slicer.js";
import { SludgerMineTest } from "./enemies/SludgerMine.js";
import { InteractableGameObject } from "./InteractableGameObject.js";
import { KeyStateManager } from "./managers/KeyManager.js";
import { NewMediaManager } from "./managers/NewMediaManager.js";
import { DoublePointsPowerup } from "./powerups/DoublePointsPowerup.js";
import { DurationPowerup } from "./powerups/DurationPowerup.js";
import { ExtraFuelPowerup } from "./powerups/ExtraFuelPowerup.js";
import { Powerup } from "./powerups/Powerup.js";
import { ShipRepairsPowerup } from "./powerups/ShipRepairsPowerup.js";
import { StoredDurationPowerup } from "./powerups/StoredDurationPowerup.js";
import { EnemyProjectile } from "./projectiles/EnemyProjectile.js";
import { PhotonLarge } from "./projectiles/PhotonLarge.js";
import { PhotonMedium } from "./projectiles/PhotonMedium.js";
import { PhotonSmall } from "./projectiles/PhotonSmall.js";

export class PlayerShip extends InteractableGameObject {
    constructor(xLocation, yLocation, velocityX, velocityY) {
        // TODO: Fix starting angle....
        // TODO: Make starting position 1 pixel offset from center of canvas to line up better with base?
        // Collision radius of 12 is a good balance between wings sticking out and body taking up the whole circle
        // TODO: Store separate sprite for invulnerability as a variable?
        super(xLocation, yLocation, 42, 37, 0, NewMediaManager.Sprites.PlayerShip, velocityX, velocityY, 12, 10);
        // TODO: Offset the drawing of the sprite by 2 pixels up so it fits in the circle better

        this.MAX_SPEED = 12;
        this.ACCELERATION = 0.1;
        this.damageCausedByCollision = 10;

        this.currentLives = 3;
        this.MAXIMUM_HEALTH = 100;
        this.updateHealth(this.MAXIMUM_HEALTH); // Set health to max and update document
        this.MAXIMUM_FUEL = 1500;
        this.updateFuel(this.MAXIMUM_FUEL); // set fuel to max and update document
        this.MAXIMUM_SPARE_PARTS = 100;
        this.updateSpareParts(this.MAXIMUM_SPARE_PARTS); // set spare parts to max and update document

        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;

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

        // Subtracted from each cycle, if > 0 powerup is active
        this.powerupFrameRemaining = {
			SpreadShotPowerup: 0,
			PhotonLargePowerup: 0,
			DoublePointsPowerup: 0,
			InvulnerabilityPowerup: 0,
			TurboThrustPowerup: 0
        };

        // Stored powerups indicated by true here
        // TODO: These definitely are not all needed, condense this somehow into a better way to keep track of the stored powerups?
		this.storedPowerupsAvailable = {
			InvulnerabilityPowerup: {
				available: true,
				duration: 60 * 10 // TODO: Connect this to the invulnerability powerup
			},
			TurboThrustPowerup: {
				available: true,
				duration: 60 * 2 // TODO: Connect this to the turbo thrust powerup
			}
		};
        // Stored powerups that are currently activated indicated by true here
		this.storedPowerupsActivated = {
			InvulnerabilityPowerup: false,
			TurboThrustPowerup: false
		};
        // Possible bullet states
		this.BULLETS = {
			SMALL: 1,
			SPREADSHOT: 2,
			LARGE: 3
		};
        this.bulletState = this.Bullets.SMALL;
		this.DEFAULT_SHOOTING_SPEED = 13; // Shooting speed without powerups and with normal bullets
		this.bulletShootingSpeed = this.defaultShootingSpeed;
		this.scoreMultiplier = 1;
		// The speed you got at when using the turbo thrust powerup
		this.SPEED_OF_TURBO_THRUST = 2 * this.MAX_SPEED;
		// What to set the speed of the ship to after turbo thrusting so you get a little "drifting" after the boost
		this.SPEED_AFTER_TURBO_THRUST = 1;

        // TODO: Improve the hell out of powerup storage and tracking
    }

    processInput() {
        this.isAccelerating = false;

        // TODO: Move updates frames into update state? Combine the two functions?? Why does it need to be separate? really this should just be part of the updateState for the player ship since no other objects have this function...
        for (let i in this.numFramesSince) {
            if (this.numFramesSince.hasOwnProperty(i)) {
                this.numFramesSince[i] += 1;
            }
        }
        
        for (let i in this.powerupFramesRemaining) {
            if (this.powerupFramesRemaining.hasOwnProperty(i) && this.powerupFramesRemaining[i] > 0) {
                this.powerupFramesRemaining[i] -= 1;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.UP) && this.fuel > 0 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
            this.isAccelerating = true;
            this.updateFuel(-1);
            this.calculateAcceleration();
            spriteY = this.height;
        } else {
            spriteY = 0;
        }

        if (KeyStateManager.isDown(KeyStateManager.LEFT) && this.numFramesSince.left >= 3 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
            this.numFramesSince.left = 0;
            this.spriteXOffset -= this.width;
            this.angle -= rotationAmount;
            if (this.spriteXOffset < 0) {
                this.spriteXOffset = this.width * animationFrames - this.width;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.RIGHT) && this.numFramesSince.right >= 3 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
            this.numFramesSince.right = 0;
            this.spriteXOffset += this.width;
            this.angle += rotationAmount;
            if (this.spriteXOffset >= this.width * animationFrames) {
                this.spriteXOffset = 0;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.SPACE) && !this.atBase && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
            if (this.numFramesSince.shooting >= this.bulletShootingSpeed) { // 13 matches up best with the original game's rate of fire at 60fps
                let photon;
                if (this.bulletState == this.BULLETS.SMALL) {
                    photon = new PhotonSmall(this);
                    NewMediaManager.Audio.PhotonSmall.play();
                } else if (this.bulletState == this.BULLETS.LARGE) {
                    photon = new PhotonLarge(this);
                    NewMediaManager.Audio.PhotonBig.play();
                } else if (this.bulletState == this.BULLETS.SPREADSHOT) {
                    photon = new PhotonMedium(this, 0);
                    let photon2 = new PhotonMedium(this, -Math.PI/16);
                    let photon3 = new PhotonMedium(this, Math.PI/16);
                    objectManager.addObject(photon2, this);
                    objectManager.addObject(photon3, this);
                    NewMediaManager.Audio.PhotonSpread.play();
                }
                objectManager.addObject(photon, this);
                this.numFramesSince.shooting = 0;
            }
        }
        
        if (KeyStateManager.isDown(KeyStateManager.V) && this.storedPowerupsAvailable['InvulnerabilityPowerup'].available == true) {
            this.activateInvulnerability();
        }
        
        if (KeyStateManager.isDown(KeyStateManager.B) && this.storedPowerupsAvailable['TurboThrustPowerup'].available == true && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
            this.activateTurboThrust();
        }
        
        // Allow a keypress of K to autokill the player. Do not allow this event to be fired more than once per second (60 frames) or when the player is at the base.
        if(KeyStateManager.isDown(KeyStateManager.K) && this.numFramesSince.death > 60 && !this.atBase) {
            this.die();
        }
    }

    addToScore(amount) {
        score += amount * this.scoreMultiplier;
    }

    isInvulnerable() {
        return this.storedPowerupsActivated['InvulnerabilityPowerup'];;
    }

    isTurboThrusting() {
        return this.storedPowerupsActivated['TurboThrustPowerup'];
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

        // Update the document
        document.getElementById('spareParts').setAttribute('value', this.spareParts);
    }

    handleCollision(otherObject, objectManager) {
        // TODO: Clean this up, could definitely be made a bit simpler. Could combine some of the logic for asteroids, projectiles, and ai game objects
        if (otherObject instanceof Asteroid) {
            super.handleCollision(otherObject, objectManager);     
            log("Player hit a Asteroid");
            if (!this.isInvulnerable()) {
                NewMediaManager.Audio.CollisionGeneral.play();
                this.updateHealth(-1*otherObject.damageCausedByCollision);
            } else {
                NewMediaManager.Audio.InvincibleCollision.play();
            }
            return;
        } else if (otherObject instanceof EnemyProjectile) {
            log("Player was hit by projectile: " + otherObject.getClassName());
            if (!this.isInvulnerable()) {
                this.updateHealth(-1*otherObject.damage);
            }
            return;
        } else if (otherObject instanceof AiGameObject) {
            if (!this.isInvulnerable()) {
                this.updateHealth(-1*otherObject.damageCausedByCollision);
                if (!(otherObject instanceof SludgerMineTest) && !(otherObject instanceof Slicer)) {
                    NewMediaManager.Audio.CollisionGeneral.play();
                } else if (otherObject instanceof Slicer) {
                    NewMediaManager.Audio.SlicerAttack.play();
                }
            } else {
                NewMediaManager.Audio.InvincibleCollision.play();
            }
            if (!this.isTurboThrusting() || otherObject instanceof EnemyBase) {
                // Hitting other objects (besides asteroids and the enemy base) only changes your direction and speed if you are not turbo thrusting
                // TODO: Have this handled first so that it is not possible to die and then have collision handled in this function
                super.handleCollision(otherObject, objectManager);
            }				
        } else if (otherObject instanceof Base && !this.isTurboThrusting()) {
            // TODO: Clean up this code at all?
            this.atBase = true;
            // Make it so that the ship will go towards the Player Base
            // These are the coordinates the Base should be at if the ship is centered on the base
            // TODO: Store these values in the config, along with Enemy base coordinates. Currently rely on having access to context...maybe just get Base location from other object instead?
            let baseX = context.canvas.width / 2 - (this.width / 2);
            let baseY = context.canvas.height / 2 - (this.height / 2) + 2.5;
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
                
                let vectorToBase = new NewVector(otherObject.x - baseX, otherObject.y - baseY);
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
        } else if (otherObject instanceof Powerup) {
            this.handlePowerupCollision(otherObject, objectManager);
        }
    }

    handlePowerupCollision(powerupObject) {
        if (powerupObject instanceof StoredDurationPowerup) {
            // Store the information needed when the powerup is activated
            this.storedPowerupsAvailable[powerupObject.getClassName()].available = true;
            this.storedPowerupsAvailable[powerupObject.getClassName()].duration = powerupObject.duration;
        } else if (powerupObject instanceof DurationPowerup) {
            // Powerup is activated instantly upon pickup, set duration.
            // Make sure to check this after checking for StoredDurationPowerup since StoredDurationPowerups are also DurationsPowerups
            this.powerupFrameRemaining[powerupObject.getClassName()] = powerupObject.duration;
        }

        // TODO: Have the powerups contain functions for handling this, where the player ship is passed in. That way logic is contained in the player ship. Also have powerup handle turning powerup off.
        // Apply effect from powerup
        if (powerupObject instanceof DoublePointsPowerup) {
            this.scoreMultiplier = 2;
            document.getElementById('doublePointsActive').style.visibility = "visible";
        } else if (powerupObject instanceof ExtraFuelPowerup) {
            //Gain back half of the max fuel
            this.updateFuel(this.MAXIMUM_FUEL/2);
        } else if (powerupObject instanceof ShipRepairsPowerup) {
            //Give back 1/3 of max health
            this.updateHealth(this.MAXIMUM_HEALTH/3);
        } else if (powerupObject instanceof SpreadShotPowerup) {
            this.bulletState = this.BULLETS.SPREADSHOT;
            this.bulletShootingSpeed = powerupObject.shootingSpeed;
            document.getElementById('spreadShotActive').style.visibility = "visible";
            // Overrides photon large powerup so make sure that is hidden
            document.getElementById('photonLargeActive').style.visibility = "hidden";
        } else if (powerupObject instanceof PhotonLargePowerup) {
            this.bulletState = this.BULLETS.LARGE;
            this.bulletShootingSpeed = powerupObject.shootingSpeed;
            document.getElementById('photonLargeActive').style.visibility = "visible";
            // Overrides spreadshot powerup so make sure that is hidden
            document.getElementById('spreadShotActive').style.visibility = "hidden";				
        } else if (powerupObject instanceof InvulnerabilityPowerup) {
            document.getElementById('invulnerabilityAvailable').style.visibility = "visible";
        } else if (powerupObject instanceof TurboThrustPowerup) {
            document.getElementById('turboThrustAvailable').style.visibility = "visible";
        } else if (powerupObject instanceof SparePartsPowerup) {
            this.updateSpareParts(25);
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
            objectManager.endGame();
        } else {
            if (this.lives === 1) {
                objectManager.displayMessage("1 life left", 60 * 5)
            } else {
                objectManager.displayMessage(this.lives + " lives left", 60 * 5)
            }
            // TODO: Fixes this. Probably just make it a function objectManager deals with.
            objectManager.movePlayerShipTo(Math.random() * (objectManager.GameBounds.Right - objectManager.GameBounds.Left + 1) + objectManager.GameBounds.Left, Math.random() * (objectManager.GameBounds.Bottom - objectManager.GameBounds.Top + 1) + objectManager.GameBounds.Top);

            // reset health and fuel and spare parts to full
            this.log("Setting ship back to max health/fuel/spare parts");
            this.updateHealth(this.MAXIMUM_HEALTH);
            this.updateFuel(this.MAXIMUM_HEALTH);
            this.updateSpareParts(this.MAXIMUM_SPARE_PARTS);

            // reset ship back to default powerup state
            this.updatePowerupState(true);

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

        if (objectManager.enemiesRemaining() == 0) {
            objectManager.displayMessage("You conquered the fringe with a score of " + score, 99999999);
            this.velocityX = 0;
            this.velocityY = 0;
            objectManager.removeObject(this);
        }

        // update the power up state
        this.updatePowerupState();

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
            numFramesSince.healFromSparePart = 0;
            this.updateSpareParts(-1);
            this.updateHealth(1);

            // TODO: I don't remember if there was a sound played here. I'll leave it out for now until I know for sure there was one
        }
    }

    updatePowerupState(reset = false) {
        // Handle bullet powerups
        // TODO: Handle this better. Base on class name maybe? And reset can just wipe out everything.
        if (this.bulletState == this.BULLETS.SPREADSHOT) {
            if (this.powerupFramesRemaining['SpreadShotPowerup'] <= 0 || (this.powerupFramesRemaining['SpreadShotPowerup'] > 0 && reset)) {
                log("reverting spreadshot bullet powerup");
                this.bulletState = this.BULLETS.SMALL;
                this.bulletShootingSpeed = this.DEFAULT_SHOOTING_SPEED;
                document.getElementById('spreadShotActive').style.visibility = "hidden";
            }
        } else if (this.bulletState == this.BULLETS.LARGE) {
            if (this.powerupFramesRemaining['PhotonLargePowerup'] <= 0 || (this.powerupFramesRemaining['PhotonLargePowerup'] > 0 && reset)) {
                log("reverting large bullet powerup");
                this.bulletState = this.BULLETS.SMALL;
                this.bulletShootingSpeed = this.DEFAULT_SHOOTING_SPEED;
                document.getElementById('photonLargeActive').style.visibility = "hidden";
            }
        }

        // Handle other powerups
        if ((this.powerupFramesRemaining['DoublePointsPowerup'] <= 0 && this.scoreMultiplier != 1) || (this.powerupFramesRemaining['DoublePointsPowerup'] > 0 && reset)) {
            // Revert double points
            log("reverting double points powerup");
            document.getElementById('doublePointsActive').style.visibility = "hidden";
            this.scoreMultiplier = 1;
        }
        if ((this.powerupFramesRemaining['InvulnerabilityPowerup'] <= 0 && this.storedPowerupsActivated['InvulnerabilityPowerup'] == true) || (this.powerupFramesRemaining['InvulnerabilityPowerup'] > 0 && reset)) {
            // Revert invulnerability
            log("reverting invulnerability powerup");
            this.storedPowerupsActivated['InvulnerabilityPowerup'] = false;
            this.sprite = NewMediaManager.Sprites.PlayerShip;
        }
        if ((this.powerupFramesRemaining['TurboThrustPowerup'] <= 0 && this.storedPowerupsActivated['TurboThrustPowerup'] == true) || (this.powerupFramesRemaining['TurboThrustPowerup'] > 0 && reset)) {
            // Revert turbo thrust
            log("reverting turbo thrust powerup");
            this.storedPowerupsActivated['TurboThrustPowerup'] = false;
            this.velocityX = this.velocityX * SPEED_AFTER_TURBO_THRUST / SPEED_OF_TURBO_THRUST;
            this.velocityY = this.velocityY * SPEED_AFTER_TURBO_THRUST / SPEED_OF_TURBO_THRUST;
        }
    }

    activateInvulnerability() {
        document.getElementById('invulnerabilityAvailable').style.visibility = "hidden";
        this.storedPowerupsActivated['InvulnerabilityPowerup'] = true;
        this.storedPowerupsAvailable['InvulnerabilityPowerup'].available = false;
        this.powerupFramesRemaining['InvulnerabilityPowerup'] = this.storedPowerupsAvailable['InvulnerabilityPowerup'].duration;
        NewMediaManager.Audio.InvincibleOrBoost.play();
        this.sprite = NewMediaManager.Sprites.PlayerShipInvulnerable;
    }
    
    activateTurboThrust() {
        document.getElementById('turboThrustAvailable').style.visibility = "hidden";
        this.storedPowerupsActivated['TurboThrustPowerup'] = true;
        this.storedPowerupsAvailable['TurboThrustPowerup'].available = false;
        this.powerupFramesRemaining['TurboThrustPowerup'] = this.storedPowerupsAvailable['TurboThrustPowerup'].duration;
        NewMediaManager.Audio.InvincibleOrBoost.play();
        this.velocityX = -Math.cos(this.angle) * SPEED_OF_TURBO_THRUST;
        this.velocityY = Math.sin(-this.angle) * SPEED_OF_TURBO_THRUST;
    }
}