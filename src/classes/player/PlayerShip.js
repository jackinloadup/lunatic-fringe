import { Vector } from "../../utility/Vector.js";
import { InteractableGameObject } from "../InteractableGameObject.js";
import { CollisionManager } from "../managers/CollisionManager.js";
import { DocumentManager } from "../managers/DocumentManager.js";
import { GameBound } from "../managers/GameBound.js";
import { GameServiceManager } from "../managers/GameServiceManager.js";
import { KeyStateManager } from "../managers/KeyManager.js";
import { Layer } from "../managers/Layer.js";
import { MediaManager } from "../managers/MediaManager.js";
import { ObjectManager } from "../managers/ObjectManager.js";
import { PhotonLarge } from "../projectiles/PhotonLarge.js";
import { PhotonMedium } from "../projectiles/PhotonMedium.js";
import { PhotonSmall } from "../projectiles/PhotonSmall.js";
import { PlayerSystemsManager } from "./PlayerSystemsManager.js";
import { PowerupStateManager } from "./PowerupStateManager.js";

export class PlayerShip extends InteractableGameObject {
    // Use static values here since the 'this' context is not the Player Ship object in the low fuel event listener, so just pull the values off of the player ship class statically.
    static LOW_FUEL_SOUND_PLAY_COUNT_MAX = 1;
    static lowFuelSoundPlayCount = 1;
    
    static MAX_SPEED = 12;

    constructor(xLocation, yLocation, velocityX, velocityY) {
        // Collision radius of 12 is a good balance between wings sticking out and body taking up the whole circle
        // Start at angle of Math.PI / 2 so angle matches sprite. Normally since the canvas is y flipped from a normal graph you would want
        //      -Math.PI / 2 to be pointing straight up, but the ships forces are opposites all other objects
        super(xLocation, yLocation, Layer.PLAYER, 42, 37, Math.PI / 2, MediaManager.Sprites.PlayerShip, velocityX, velocityY, 12, 10);
        // Offset the drawing of the sprite by 2 pixels in the y direction so it fits in the collision circle better
        this.imageYOffset = 2;

        this.ACCELERATION = 0.1;
        this.damageCausedByCollision = 40;

        this.MAXIMUM_FUEL = 1500;
        this.fuel = this.MAXIMUM_FUEL;
        this.HALF_FUEL_REMAINING = this.MAXIMUM_FUEL / 2;
        this.QUARTER_FUEL_REMAINING = this.MAXIMUM_FUEL / 4;
        this.updateDocumentFuel();
        this.MAXIMUM_SPARE_PARTS = 100;
        this.spareParts = this.MAXIMUM_SPARE_PARTS
        this.updateDocumentSpareParts();

        this.playerSystemsManager = new PlayerSystemsManager();
        // Used to save and restore fuel and spare parts during and after invulnerability powerup usage
        this.savedFuel = 0;
        this.savedSpareParts = 0;

        this.NUMBER_OF_ANIMATION_FRAMES = 32;
        this.ROTATION_AMOUNT = (2 * Math.PI) / this.NUMBER_OF_ANIMATION_FRAMES;
        this.spriteYOffset = 0; // Start with sprite not showing thrusters

        this.isAccelerating = false;
        this.BASE_DOCKING_OFFSET = 3; // The value offset to use so that the player ship is more centered with the base when docked.
        this.atBase = false;
        this.isLowFuelHalfLeft = false;
        this.isLowFuelQuarterLeft = false;
        // Setup the repeating of the low fuel sound
        MediaManager.Audio.LowFuel.addEventListener('ended', function() {
            if (PlayerShip.lowFuelSoundPlayCount < PlayerShip.LOW_FUEL_SOUND_PLAY_COUNT_MAX) {
                MediaManager.Audio.LowFuel.play();
                PlayerShip.lowFuelSoundPlayCount++;
            } else {
                PlayerShip.lowFuelSoundPlayCount = 1;
            }
        });

        this.FRAMES_BETWEEN_ENGINE_CHECK = 5; // 60 frames per second
        this.enginesFunctioning = true;
        this.FRAMES_BETWEEN_TURN_JETS_CHECK = 60; // 60 frames per second
        this.turnJetsFunctioning = true;
        this.TURN_JET_MALFUNCTIONING_DIRECTIONS = {
            LEFT: 0,
            RIGHT: 1
        }
        this.turnJetsMalfunctioningDirection = this.TURN_JET_MALFUNCTIONING_DIRECTIONS.LEFT;
        this.numFramesSince = {
            left: 0,
            right: 0,
            shooting: 0,
			repair: 0,
			death: 0,
            healFromSparePart: 0,
            takenDamage: 0,
            engineCheck: 0,
            turnJetsCheck: 0
		}

        this.score = 0;
        this.updateDocumentScore();
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
		this.SPEED_OF_TURBO_THRUST = 2 * PlayerShip.MAX_SPEED;
		// What to set the speed of the ship to after turbo thrusting so you get a little "drifting" after the boost
		this.SPEED_AFTER_TURBO_THRUST = 1;

        this.turboThrustActive = false;
        this.invulnerabilityActive = false;

        // Player starts with 3 lives
        this.lives = 3;
        this.updateLivesDocument();
    }

    // Need a function that is separate from other objects since the angles for the player are opposite the angles for everything else
    getNewProjectileVelocity(projectileSpeed, angleOffset = 0) {
        return new Vector(this.velocityX + (-Math.cos(this.angle + angleOffset) * projectileSpeed), this.velocityY + (-Math.sin(this.angle + angleOffset) * projectileSpeed));
    }

    processInput() {
        this.isAccelerating = false;

        // So we need to do this here since some of the input processing relies on the number of frames since (like turning or shooting). Could probably be in its own function but will just be left here for now.
        for (let i in this.numFramesSince) {
            if (this.numFramesSince.hasOwnProperty(i)) {
                this.numFramesSince[i] += 1;
            }
        }
        
        this.powerupStateManager.updateDurations();

        if (this.numFramesSince.engineCheck > this.FRAMES_BETWEEN_ENGINE_CHECK) {
            // Perform an engine functioning check
            let failedToUseEngines = Math.random() < .95 * (100 - this.playerSystemsManager.enginesCondition.operatingPercentage) / 100;
            this.enginesFunctioning = !failedToUseEngines;
            this.numFramesSince.engineCheck = 0;
        }
        if (KeyStateManager.isDown(KeyStateManager.UP) && this.fuel > 0 && !this.isTurboThrusting() && this.enginesFunctioning) {
            this.isAccelerating = true;
            if (!this.isInvulnerable()) {
                this.updateFuel(-1);
            }
            this.calculateAcceleration();
            this.spriteYOffset = this.height;
        } else {
            this.spriteYOffset = 0;
        }

        if (this.numFramesSince.turnJetsCheck > this.FRAMES_BETWEEN_TURN_JETS_CHECK) {
            // Perform a turn jets functioning check
            let failedToUseTurnJets = Math.random() < .9 * (100 - this.playerSystemsManager.turnJetsCondition.operatingPercentage) / 100;
            if (failedToUseTurnJets && Math.random() < .25) {
                // 25% chance to switch turning directions. Just switches between 0 and 1 as those are the only two directions in the enum
                this.turnJetsMalfunctioningDirection = (this.turnJetsMalfunctioningDirection + 1) % 2;
            }
            this.turnJetsFunctioning = !failedToUseTurnJets;
            this.numFramesSince.turnJetsCheck = 0;
        }
        let shouldTurnLeft = (this.turnJetsFunctioning && KeyStateManager.isDown(KeyStateManager.LEFT)) || (this.turnJetsMalfunctioningDirection === this.TURN_JET_MALFUNCTIONING_DIRECTIONS.LEFT && !this.turnJetsFunctioning)
        if (shouldTurnLeft && this.numFramesSince.left >= 3 && !this.isTurboThrusting() ) {
            this.numFramesSince.left = 0;
            this.spriteXOffset -= this.width;
            this.angle -= this.ROTATION_AMOUNT;
            if (this.spriteXOffset < 0) {
                this.spriteXOffset = this.width * this.NUMBER_OF_ANIMATION_FRAMES - this.width;
            }
        }

        let shouldTurnRight = (this.turnJetsFunctioning && KeyStateManager.isDown(KeyStateManager.RIGHT)) || (this.turnJetsMalfunctioningDirection === this.TURN_JET_MALFUNCTIONING_DIRECTIONS.RIGHT && !this.turnJetsFunctioning)
        if (shouldTurnRight && this.numFramesSince.right >= 3 && !this.isTurboThrusting()) {
            this.numFramesSince.right = 0;
            this.spriteXOffset += this.width;
            this.angle += this.ROTATION_AMOUNT;
            if (this.spriteXOffset >= this.width * this.NUMBER_OF_ANIMATION_FRAMES) {
                this.spriteXOffset = 0;
            }
        }

        if (KeyStateManager.isDown(KeyStateManager.SPACE) && !this.atBase && !this.isTurboThrusting()) {
            if (this.numFramesSince.shooting >= this.bulletShootingSpeed) { // 13 matches up best with the original game's rate of fire at 60fps
                // Check to see if ship is allowed to fire based on percentage the guns are operating at. Note that this is inside the frame checking logic since
                // even you are not allowed to fire a bullet due to inoperable guns it should still reset the numFramesSince count
                let failedToFireBullet = Math.random() < .9 * (100 - this.playerSystemsManager.gunsCondition.operatingPercentage) / 100;
                if (!failedToFireBullet) {
                    let photon;
                    let photonX = this.x + (-Math.cos(this.angle) * this.collisionRadius);
                    let photonY = this.y + (-Math.sin(this.angle) * this.collisionRadius);
                    let photonVelocity = this.getNewProjectileVelocity(this.PROJECTILE_SPEED);
                    if (this.bulletState == this.BULLETS.SMALL) {
                        photon = new PhotonSmall(photonX, photonY, photonVelocity.x, photonVelocity.y);
                        MediaManager.Audio.PhotonSmall.play();
                    } else if (this.bulletState == this.BULLETS.LARGE) {
                        photon = new PhotonLarge(photonX, photonY, photonVelocity.x, photonVelocity.y);
                        MediaManager.Audio.PhotonBig.play();
                    } else if (this.bulletState == this.BULLETS.SPREADSHOT) {
                        let photonVelocity2 = this.getNewProjectileVelocity(this.PROJECTILE_SPEED, (Math.PI / 16));
                        let photonVelocity3 = this.getNewProjectileVelocity(this.PROJECTILE_SPEED, -(Math.PI / 16));
                        photon = new PhotonMedium(photonX, photonY, photonVelocity.x, photonVelocity.y);
                        let photon2 = new PhotonMedium(photonX, photonY, photonVelocity2.x, photonVelocity2.y);
                        let photon3 = new PhotonMedium(photonX, photonY, photonVelocity3.x, photonVelocity3.y);
                        // FUTURE TODO: investigate why photon 2 falls behind the other photons when shooting sometimes. This appears to also be a problem with the old code.
                        ObjectManager.addObject(photon2, true);
                        ObjectManager.addObject(photon3, true);
                        MediaManager.Audio.PhotonSpread.play();
                    }
                    ObjectManager.addObject(photon, true);
                }
            
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

        this.updateDocumentScore();
    }

    updateDocumentScore() {
        DocumentManager.updateScore(this.score);
    }

    isInvulnerable() {
        return this.invulnerabilityActive;
    }

    isTurboThrusting() {
        return this.turboThrustActive;
    }

    updateLives(livesChange) {
        this.lives += livesChange;

        this.updateLivesDocument();
    }

    updateLivesDocument() {
        DocumentManager.updateLives(this.lives);
    }

    repairShip(repairAmount) {
        this.playerSystemsManager.repairSystems(repairAmount);
    }

    damageShip(damageAmount) {
        this.numFramesSince.takenDamage = 0;
        this.playerSystemsManager.damageSystems(damageAmount)

        if (this.playerSystemsManager.isShipDestroyed()) {
            this.die();
        }
    }

    saveFuelSparePartAndSystemsState() {
        this.savedFuel = this.fuel;
        this.savedSpareParts = this.spareParts;
        this.playerSystemsManager.saveSystemsOperatingLevels();
    }

    restoreFuelSparePartAndSystemsState() {
        this.setFuel(this.savedFuel);
        this.setSpareParts(this.savedSpareParts);
        this.playerSystemsManager.restoreSystemsOperatingLevels();

        // The original game has it so that if you are below half fuel and you come out of invulnerability
        // the low fuel message is shown and the sound is played. 
        if (this.fuel <= this.HALF_FUEL_REMAINING) {
            this.displayLowFuelMessageAndPlaySound();
        }
    }

    resetFuelSparePartAndSystemsState() {
        this.setFuel(this.MAXIMUM_FUEL);
        this.setSpareParts(this.MAXIMUM_SPARE_PARTS);
        this.playerSystemsManager.resetSystems();
    }

    setFuel(newFuelValue) {
        if (newFuelValue > this.MAXIMUM_FUEL) {
            this.fuel = this.MAXIMUM_FUEL;
        } else if (newFuelValue <= 0) {
            this.fuel = 0;
        } else {
            this.fuel = newFuelValue;
        }

        this.updateDocumentFuel();
    }

    updateFuel(fuelChange) {
        this.setFuel(this.fuel + fuelChange);
    }

    updateDocumentFuel() {
        // Update the document, sending percentage of fuel remaining
        DocumentManager.updateFuelBar(this.fuel / this.MAXIMUM_FUEL * 100);
    }

    displayLowFuelMessageAndPlaySound() {
        GameServiceManager.displayMessage("LOW FUEL", 60 * 4.5);
        MediaManager.Audio.LowFuel.play();
    }

    setSpareParts(newSparePartsValue) {
        if (this.newSparePartsValue > this.MAXIMUM_SPARE_PARTS) {
            this.spareParts = this.MAXIMUM_SPARE_PARTS;
        } else if (this.newSparePartsValue < 0) {
            this.spareParts = 0;
        } else {
            this.spareParts = newSparePartsValue;
        }

        this.updateDocumentSpareParts();
    }

    updateSpareParts(sparePartsChange) {
        this.setSpareParts(this.spareParts + sparePartsChange);
    }

    updateDocumentSpareParts() {
        // Update the document, sending percentage of spare parts remaining
        DocumentManager.updateSparePartsBar(this.spareParts / this.MAXIMUM_SPARE_PARTS * 100);
    }

    playCollisionSound(otherObject) {
        if (otherObject.layer === Layer.SLUDGER_MINE) {
            // Hitting sludger mines does not make any collision sound, the only sound comes from the sludger mine death
            return;
        } else if (this.isInvulnerable()) {
            MediaManager.Audio.InvincibleCollision.play();
        } else if (otherObject.layer === Layer.HAMMERHEAD_WEAPON) {
            MediaManager.Audio.HammerheadAttack.play();
        } else if (otherObject.layer === Layer.SLICER) {
            MediaManager.Audio.SlicerAttack.play();
        } else if (otherObject.layer === Layer.QUAD_BLASTER_PROJECTILE) {
            MediaManager.Audio.CollisionQuad.play();
        } else {
            MediaManager.Audio.CollisionGeneral.play();
        }
    }

    handleCollision(otherObject) {
        if (otherObject.layer === Layer.QUAD_BLASTER_PROJECTILE || otherObject.layer === Layer.PUFFER_PROJECTILE || otherObject.layer === Layer.HAMMERHEAD_WEAPON || otherObject.layer === Layer.ENEMY_BASE_PHOTON) {
            this.log("Player was hit by projectile: " + otherObject.getClassName());
            super.handleCollision(otherObject);
            this.playCollisionSound(otherObject);
            if (!this.isInvulnerable()) {
                this.damageShip(otherObject.damage);
            }
        } else if (otherObject.layer === Layer.ASTEROID || CollisionManager.isEnemyLayer(otherObject.layer)) {
            this.log("Player hit: " + otherObject.getClassName());
            if (!this.isTurboThrusting() || otherObject.layer === Layer.ASTEROID || otherObject.layer === Layer.ENEMY_BASE) {
                // Hitting other objects (besides asteroids and the enemy base) only changes your direction and speed if you are not turbo thrusting
                super.handleCollision(otherObject);
            }	
            this.playCollisionSound(otherObject);
            if (!this.isInvulnerable()) {
                this.damageShip(otherObject.damageCausedByCollision);
            }		
        } else if (otherObject.layer === Layer.PLAYER_BASE && !this.isTurboThrusting()) {
            // FUTURE TODO: Revisit ship being pulled into base, possible using gameplay footage to make it more accurate
            this.atBase = true;
            // Make it so that the ship will go towards the Player Base
            // These are the coordinates the Base should be at if the ship is centered on the base
            let baseX = otherObject.x;
            let baseY = otherObject.y - this.BASE_DOCKING_OFFSET; // Subtract the docking offset here so that the player ship is centered better on the player base when docked
            // There will be rounding error with the program, so don't check that the 
            // values are equal but rather that they are within this threshold
            let threshold = .5; 
            if (this.velocityX == 0 && this.velocityY == 0 && Math.abs(baseX - this.x) < threshold && Math.abs(baseY - this.y) < threshold) {
                //The player ship is stopped at the base
                
                if (this.numFramesSince.repair >= 60 && (!this.playerSystemsManager.isShipAtFullOpeartingCapacity() || this.fuel < this.MAXIMUM_FUEL || this.spareParts < this.MAXIMUM_SPARE_PARTS)) {
                    //Repair ship
                    this.numFramesSince.repair = 0;
                    MediaManager.Audio.BaseRepair.play();
                    if (!this.playerSystemsManager.isShipAtFullOpeartingCapacity()) {
                        this.repairShip(12);
                    }
                    if (this.fuel < this.MAXIMUM_FUEL) {
                        this.updateFuel(25);
                    }
                    if (this.spareParts < this.MAXIMUM_SPARE_PARTS) {
                        this.updateSpareParts(1);
                    }
                }
            } else if (!this.isAccelerating && (Math.abs(baseX - this.x) > threshold || Math.abs(baseY - this.y) > threshold)) {
                // Only pull the ship in if it is not accelerating
                
                let vectorToBase = new Vector(baseX - this.x, baseY - this.y);
                let playerShipVelocity = new Vector(this.velocityX, this.velocityY);
                let velocityChange = playerShipVelocity.add(vectorToBase).scale(0.001);
                let minimumVelocityChangeMagnitude = 0.08;
                if (velocityChange.magnitude() < minimumVelocityChangeMagnitude) {
                    // Change the magnitude to the minimum magnitude
                    velocityChange = velocityChange.scale(minimumVelocityChangeMagnitude / velocityChange.magnitude());
                }
                
                //let dampeningFactor = Math.sqrt(playerShipVelocity.Magnitude()/this.MaxSpeed)*0.09+.9;
                let dampeningFactor = playerShipVelocity.magnitude()/PlayerShip.MAX_SPEED*0.09+.9;
                
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
        MediaManager.Audio.PlayerDeath.play();

        this.velocityX = 0;
        this.velocityY = 0;
        this.angle = Math.PI / 2;
        this.spriteXOffset = 0;

        this.updateLives(-1);

        if (this.lives <= 0) {
            GameServiceManager.endGame();
        } else {
            if (this.lives === 1) {
                GameServiceManager.displayMessage("1 LIFE LEFT", 60 * 5)
            } else {
                GameServiceManager.displayMessage(this.lives + " LIVES LEFT", 60 * 5)
            }
            GameServiceManager.movePlayerShipTo(Math.random() * (GameBound.RIGHT - GameBound.LEFT + 1) + GameBound.LEFT, Math.random() * (GameBound.BOTTOM - GameBound.TOP + 1) + GameBound.TOP);

            // reset ship systems and fuel and spare parts to full
            this.log("Setting ship back to max system operating percentages/fuel/spare parts");
            this.resetFuelSparePartAndSystemsState();

            // deactivate all active powerups
            this.powerupStateManager.deactivateAllActivePowerups();

            // NOTE: You do not gain any stored powerups when you die (nor do you lose the ones you had)

            // reset all number of frames values
            for (let i in this.numFramesSince) {
                if (this.numFramesSince.hasOwnProperty(i)) {
                    this.numFramesSince[i] = 0;
                }
            }

            // reset system functioning booleans
            this.enginesFunctioning = true;
            this.turnJetsFunctioning = true;
        }
    }

    updateState() {
        // update the power up state
        this.powerupStateManager.updatePowerupState();

        // Handle fuel sounds
        if (this.fuel <= this.HALF_FUEL_REMAINING && !this.isLowFuelHalfLeft) {
            this.displayLowFuelMessageAndPlaySound();
            this.isLowFuelHalfLeft = true;
        } else if (this.fuel > this.HALF_FUEL_REMAINING && this.isLowFuelHalfLeft) {
            this.isLowFuelHalfLeft = false;
        }
        
        
        if (this.fuel < this.QUARTER_FUEL_REMAINING && !this.isLowFuelQuarterLeft) {
            this.displayLowFuelMessageAndPlaySound();
            this.isLowFuelQuarterLeft = true;
        } else if (this.fuel > this.QUARTER_FUEL_REMAINING && this.isLowFuelQuarterLeft) {
            this.isLowFuelQuarterLeft = false;
        }

        // Handle healing from spare parts if not at player base
        if (!this.atBase && !this.playerSystemsManager.isShipAtFullOpeartingCapacity() && this.spareParts > 0 && this.numFramesSince.healFromSparePart > 30 && this.numFramesSince.takenDamage > 120) {
            this.numFramesSince.healFromSparePart = 0;
            this.updateSpareParts(-1);
            this.repairShip(2);

            // NOTE: Based on gameplay footage no sound is played when spare parts are used to fix the ship
        }

        // Do this after the healing from spare parts so that if the player is at home base spare parts are not used
        if (this.atBase) {
            // remove the at base indicator so that if we have left the base it goes away
            // Used when determing is the Kill hotkey should work or if the player should be allowed to fire bullets and use spare parts (not allowed when at base)
            this.atBase = false;
        }
    }
}