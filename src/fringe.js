import { GameConfig } from './config/gameConfig.js';
import { NewMediaManager } from './classes/managers/NewMediaManager.js';
import { GameManager } from './classes/managers/GameManager.js';
import { KeyStateManager } from './classes/managers/KeyManager.js';

/*  Lunatic Fringe - http://code.google.com/p/lunatic-fringe/
    Copyright (C) 2011-2013 James Carnley, Lucas Riutzel, 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* JSLint validation options */
/*jslint devel: true, browser: true, maxerr: 50, indent: 4 */
/*global Audio: false */
export function LunaticFringe(canvas, hidden, visibilityChange) {
    "use strict";

    // var animationLoop, objectManager, mediaManager, Key, DEBUG = true, numEnemiesKilled = 0, score = 0;
    // var game = this;
	let version = "1.26";
	// var isCapsPaused = false;
	log("Game Version: " + version);

    if (typeof canvas !== 'object') {
        canvas = document.getElementById(canvas);
    }

    // Opera sort of blows and doesn't support Object.create at this time
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() { }
            F.prototype = o;
            return new F();
        };
    }

    // This is simpler than parsing the query string manually. The better regex solutions gave JSLint hell so I removed them.
    if (window.location.href.indexOf("debug=1") !== -1) {
        GameConfig.debug = true;
    }

    // Initialize the media (audio/sprites)
    NewMediaManager.init();

    // Initialize the game
    GameManager.initializeGame(canvas.getContext("2d"));

    // Add listeners
    function handleVisibilityChange() {
        if (document[hidden]) {
			// Only pause the game if the game is not paused by Caps Lock
			if(!GameManager.isPaused) {
				GameManager.pauseGame();
			}
        } else {
			// Only resume the game if the game is not paused by Caps Lock
			if(!GameManager.isPaused) {
				GameManager.resumeGame();
			}
        }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    window.addEventListener('resize', function (event) { GameManager.handleResize(event); }, false);
    window.addEventListener('keyup', function (event) { KeyStateManager.onKeyUp(event); }, false);
    window.addEventListener('keydown', function (event) { KeyStateManager.onKeyDown(event); }, false);

}
// TODO: Below is all of the code that used to be in the LunaticFringe class. Once we are sure we don't need any of it anymore remove it

    // function log(message) {
    //     if (DEBUG) {
    //         try {
    //             console.log(message);
    //         } catch (e) { }
    //     }
    // }
	
	// function error(message) {
	// 	if (DEBUG) {
	// 		try {
	// 			console.error(message);
	// 		} catch (e) { }
	// 	}
	// }

    // Key = {
    //     keysPressed: {},

    //     SPACE: 32,
    //     LEFT: 37,
    //     UP: 38,
    //     RIGHT: 39,
    //     DOWN: 40,
	// 	CAPSLOCK: 20,
	// 	V: 86,
	// 	B: 66,
	// 	K: 75,

    //     isDown: function (keyCode) {
    //         return this.keysPressed[keyCode];
    //     },

    //     onKeydown: function (event) {
	// 		// If caps locks was pressed (and is not already registered as being down before this), handle pausing/unpausing depending on the current state
	// 		if (event.keyCode == this.CAPSLOCK && this.keysPressed[event.keyCode] != true) {
	// 			isCapsPaused = !isCapsPaused;
	// 			if (isCapsPaused) {
	// 				objectManager.pauseGame();
	// 			} else {
	// 				objectManager.resumeGame();
	// 			}
	// 		}
			
    //         this.keysPressed[event.keyCode] = true;
    //     },

    //     onKeyup: function (event) {
    //         delete this.keysPressed[event.keyCode];
    //     }
    // };

    // This is primarily to make sure media is preloaded, otherwise projectiles only load when fire is pressed and looks funky
    // this.mediaManager = new MediaManager();

    // Game Objects
    // function GameObject() {

        // this.X = 0;
        // this.Y = 0;
        // this.Width = 0;
        // this.Height = 0;
        // this.VelocityX = 0;
        // this.VelocityY = 0;
        // this.Mass = 0;
        // this.CollisionRadius = 0;
        // this.Sprite = null;

        // GameObject.prototype.updateState = function () {
        //     // console.log("GameObject - updateState");
        // };

        // GameObject.prototype.draw = function (context) {
        //     if (DEBUG) {
        //         // Draw collision circle
        //         context.beginPath();
        //         context.strokeStyle = "blue";
        //         context.arc(this.X, this.Y, this.CollisionRadius, 0, Math.PI * 2);
        //         context.stroke();

        //         // Draw object angle
        //         context.beginPath();
        //         context.strokeStyle = "blue";
        //         context.moveTo(this.X, this.Y);
        //         if (this instanceof PlayerShip) {
        //             context.lineTo(this.X + -Math.cos(this.Angle) * this.CollisionRadius * 2, this.Y + -Math.sin(this.Angle) * this.CollisionRadius * 2);
        //         } else {
        //             context.lineTo(this.X + Math.cos(this.Angle) * this.CollisionRadius * 2, this.Y + Math.sin(this.Angle) * this.CollisionRadius * 2);
        //         }
        //         context.stroke();
        //     }
        // };

        // GameObject.prototype.handleCollision = function (otherObject) {
        //     var i, j, dx, dy, phi, magnitude_1, magnitude_2, direction_1, direction_2, new_xspeed_1, new_xspeed_2, new_yspeed_1, new_yspeed_2, final_xspeed_1, final_yspeed_1, final_xspeed_2, final_yspeed_2;
			
		// 	if (this.Mass == 0 && otherObject.Mass == 0) {
		// 		// This is bad because this means the new speed calculations will result in NaN
		// 		error("Both objects had a mass of 0! Objects were: " + this.constructor.name + " and " + otherObject.constructor.name);
		// 	}
			
        //     dx = this.X - otherObject.X;
        //     dy = this.Y - otherObject.Y;

        //     phi = Math.atan2(dy, dx);

        //     magnitude_1 = Math.sqrt(this.VelocityX * this.VelocityX + this.VelocityY * this.VelocityY);
        //     magnitude_2 = Math.sqrt(otherObject.VelocityX * otherObject.VelocityX + otherObject.VelocityY * otherObject.VelocityY);

        //     direction_1 = Math.atan2(this.VelocityY, this.VelocityX);
        //     direction_2 = Math.atan2(otherObject.VelocityY, otherObject.VelocityX);

        //     new_xspeed_1 = magnitude_1 * Math.cos(direction_1 - phi);
        //     new_yspeed_1 = magnitude_1 * Math.sin(direction_1 - phi);

        //     new_xspeed_2 = magnitude_2 * Math.cos(direction_2 - phi);

        //     final_xspeed_1 = ((this.Mass - otherObject.Mass) * new_xspeed_1 + (otherObject.Mass + otherObject.Mass) * new_xspeed_2) / (this.Mass + otherObject.Mass);

        //     final_yspeed_1 = new_yspeed_1;

        //     this.VelocityX = Math.cos(phi) * final_xspeed_1 + Math.cos(phi + Math.PI / 2) * final_yspeed_1;
        //     this.VelocityY = Math.sin(phi) * final_xspeed_1 + Math.sin(phi + Math.PI / 2) * final_yspeed_1;
        // };

        // GameObject.prototype.processInput = function (KeyState) {
        //     // console.log("GameObject - processInput");
        // };

        // GameObject.prototype.calculateAcceleration = function () {

        //     var currentVelocity = new Vector(this.VelocityX, this.VelocityY);

        //     var acceleration;

        //     // The ship forces are opposite everything else. It doesn't move, it shifts the universe around it.
        //     if (this instanceof PlayerShip) {
        //         acceleration = new Vector(-Math.cos(this.Angle) * this.Acceleration, Math.sin(-this.Angle) * this.Acceleration);
        //     } else {
        //         acceleration = new Vector(Math.cos(this.Angle) * this.Acceleration, Math.sin(this.Angle) * this.Acceleration);
        //     }

        //     var newVelocity = currentVelocity.Add(acceleration);

        //     // Only apply Lorentz factor if acceleration increases speed
        //     if (newVelocity.Magnitude() > currentVelocity.Magnitude()) {
        //         var b = 1 - ((currentVelocity.Magnitude() * currentVelocity.Magnitude()) / (this.MaxSpeed * this.MaxSpeed));

        //         // If b is negative then just make it very small to prevent errors in the square root
        //         if (b <= 0) { b = 0.0000000001; }

        //         var lorentz_factor = Math.sqrt(b);

        //         acceleration = acceleration.Scale(lorentz_factor);
        //     }

        //     currentVelocity = currentVelocity.Add(acceleration);

        //     /* Allow acceleration in the forward direction to change the direction
        //     of currentVelocity by using the direction of newVelocity (without the Lorentz factor)
        //     with the magnitude of currentVelocity (that applies the Lorentz factor). Without this
        //     the ship is almost impossible to turn when at max speed. */
        //     if (currentVelocity.Magnitude() > 0) {
        //         currentVelocity = newVelocity.Normalize().Scale(currentVelocity.Magnitude());
        //     }

        //     this.VelocityX = currentVelocity.X;
        //     this.VelocityY = currentVelocity.Y;
        // }
    // }
	
	// Powerup activation constants
	// const INSTANT = 'INSTANT';
	// const BUTTON_PRESS = 'BUTTON_PRESS';

	// All Powerups inherit from this
	// activation: How the powerup is activated. Options: INSTANT and BUTTON_PRESS
	// duration: How long the powerup lasts, in frames (60 frames per second) (0 for instantaneous)
	// function Powerup(bounds, options) {
		// GameObject.call(this);
		
		// this.Activation = options.activation;
		// this.Duration = options.duration;
		// this.Name = options.name;
		// this.Width = options.width;
		// this.Height = options.height;
		// this.CollisionRadius = options.collisionRadius;
		// this.Sprite = options.sprite;
		// this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
		// log(this.Name + " created at: (" + this.X + "," + this.Y + ")");
		
		// this.draw = function (context) {
        //     Powerup.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, this.X - this.Width / 2, this.Y - this.Height / 2);
        // };
		
		// this.handleCollision = function(otherObject) {
		// 	if(otherObject instanceof PlayerShip) {
		// 		log(this.Name + " gained by the player");
		// 		game.mediaManager.Audio.PowerupWow.play();
		// 		objectManager.removeObject(this);
		// 	}
		// }
	// }
	// Powerup.prototype = Object.create(GameObject.prototype);
	// Powerup.prototype.constructor = Powerup;
	
	// function PhotonLargePowerup(bounds) {
		// Powerup.call(
			// this, 
			// bounds, 
			// {
				// activation: INSTANT, 
				// duration: 60 * 30, 
				// name: "PhotonLargePowerup",
				// width: 15,
				// height: 16,
				// collisionRadius: 8,
				// sprite: game.mediaManager.Sprites.PhotonLarge
		// 	}
		// );
		// this.shootingSpeed = 60; // 1 bullet per second at 60 frames per second
	// }
	// PhotonLargePowerup.prototype = Object.create(Powerup.prototype);
	// PhotonLargePowerup.prototype.constructor = PhotonLargePowerup;
	
	// function SpreadShotPowerup(bounds) {
	// 	Powerup.call(
	// 		this, 
	// 		bounds, 
	// 		{
				// activation: INSTANT, 
				// duration: 60 * 60, 
				// name: "SpreadShotPowerup",
				// width: 19,
				// height: 16,
				// collisionRadius: 9,
				// sprite: game.mediaManager.Sprites.SpreadShot
		// 	}
		// );
		// this.shootingSpeed = 39; // 60/39 bullets per second at 60 frames per second
	// }
	// SpreadShotPowerup.prototype = Object.create(Powerup.prototype);
	// SpreadShotPowerup.prototype.constructor = SpreadShotPowerup;
	
	// function DoublePointsPowerup(bounds) {
	// 	Powerup.call(
	// 		this, 
	// 		bounds, 
	// 		{
				// activation: INSTANT, 
				// duration: 60 * 90, 
				// name: "DoublePointsPowerup",
				// width: 15,
				// height: 16,
				// collisionRadius: 8,
				// sprite: game.mediaManager.Sprites.DoublePoints
	// 		}
	// 	);
	// }
	// DoublePointsPowerup.prototype = Object.create(Powerup.prototype);
	// DoublePointsPowerup.prototype.constructor = DoublePointsPowerup;
	
	// function ExtraFuelPowerup(bounds) {
	// 	Powerup.call(
	// 		this, 
	// 		bounds, 
	// 		{
				// activation: INSTANT, 
				// duration: 0, 
				// name: "ExtraFuelPowerup",
				// width: 13,
				// height: 13,
				// collisionRadius: 7,
				// sprite: game.mediaManager.Sprites.ExtraFuel
	// 		}
	// 	);

	// }
	// ExtraFuelPowerup.prototype = Object.create(Powerup.prototype);
	// ExtraFuelPowerup.prototype.constructor = ExtraFuelPowerup;
	
	// function ShipRepairsPowerup(bounds) {
	// 	Powerup.call(
	// 		this, 
	// 		bounds, 
	// 		{
				// activation: INSTANT, 
				// duration: 0, 
				// name: "ShipRepairsPowerup",
				// width: 13,
				// height: 13,
				// collisionRadius: 7,
				// sprite: game.mediaManager.Sprites.ShipRepairs
	// 		}
	// 	);
	// }
	// ShipRepairsPowerup.prototype = Object.create(Powerup.prototype);
	// ShipRepairsPowerup.prototype.constructor = ShipRepairsPowerup;

    // function SparePartsPowerup(bounds) {
    //     Powerup.call(
    //         this,
    //         bounds,
    //         {
    //             activation: INSTANT, 
	// 			duration: 0, 
	// 			name: "SparePartsPowerup",
				// width: 13,
				// height: 13,
				// collisionRadius: 7,
				// sprite: game.mediaManager.Sprites.SpareParts
    //         }
    //     );
    // }
    // SparePartsPowerup.prototype = Object.create(Powerup.prototype);
    // SparePartsPowerup.prototype.constructor = SparePartsPowerup;
	
	// function InvulnerabilityPowerup(bounds) {
	// 	Powerup.call(
	// 		this, 
	// 		bounds, 
	// 		{
				// activation: BUTTON_PRESS, 
				// duration: 60 * 10, 
				// name: "InvulnerabilityPowerup",
				// width: 15,
				// height: 19,
				// collisionRadius: 9,
				// sprite: game.mediaManager.Sprites.Invulnerability
	// 		}
	// 	);
	// }
	// InvulnerabilityPowerup.prototype = Object.create(Powerup.prototype);
	// InvulnerabilityPowerup.prototype.constructor = InvulnerabilityPowerup;
	
	// function TurboThrustPowerup(bounds) {
	// 	Powerup.call(
	// 		this,
	// 		bounds,
	// 		{
				// activation: BUTTON_PRESS,
				// duration:60 * 2,
				// name: "TurboThrustPowerup",
				// width: 15,
				// height: 16,
				// collisionRadius: 8,
				// sprite: game.mediaManager.Sprites.TurboThrust
	// 		}
	// 	);
	// }
	// TurboThrustPowerup.prototype = Object.create(Powerup.prototype);
	// TurboThrustPowerup.prototype.constructor = TurboThrustPowerup;
	
    // All AI inherit from this
    // function AIGameObject(playerShip) {
        // GameObject.call(this);

        // this.relativePositionTo = function (object) {
        //   var X = object.X - this.X;
        //   var Y = object.Y - this.Y;
        //   return {x: X, y: Y};
        // };

        // this.angleTo = function (object) {
        //   var rel = this.relativePositionTo(object);
        //   return Math.atan2(rel.y, rel.x);
        // };

        // this.angleDiffTo = function (object) {
        //   var angleDiff, angleToObject;
        //   angleToObject = this.angleTo(object);
        //   angleDiff = angleToObject - this.Angle;

        //   // when calculating angle diff compensate when the angle swiches to the opposite side
        //   // of the angle spectrem. eg: a ship flys from 10deg->0deg->350deg
        //   // this is important when doing gradual shifts to angles and not cause
        //   // the shift to loop around the circle long ways
        //   if ( Math.abs(angleDiff) > Math.PI ) {
        //     if (angleDiff > 0) this.Angle += (Math.PI*2);
        //     else this.Angle -= (Math.PI*2);

        //     // recalculate diff now that we have adjusted the angle
        //     angleDiff = angleToObject - this.Angle;
        //   }

        //   return angleDiff;
        // };
		
		// AIGameObject.prototype.handleCollision = function(otherObject) {
			// var thisName = this.constructor.name;
			// var otherName = otherObject.constructor.name;
			// if (otherObject instanceof SludgerMine) {
			// 	// SludgerMines are weak, so if they collide with anything they should die and the other
			// 	// object should not get hurt, so return
			// 	return;
			// } else if (otherObject instanceof Projectile) {				
			// 	log(thisName + " hit by Projectile: " + otherName);
			// 	this.Health -= otherObject.Damage;
			// 	log(thisName + " health is now: " + this.Health);
			// 	if (this.Health <= 0) {
			// 		// this object dies
			// 		log(thisName + " died!");
			// 		if (this instanceof SludgerMine) {
			// 			game.mediaManager.Audio.SludgerMinePop.play();
			// 		} else {
			// 			game.mediaManager.Audio.SludgerDeath.play();
			// 		}
			// 		objectManager.removeObject(this);
			// 		numEnemiesKilled++;
			// 		if(otherObject instanceof PhotonSmall || otherObject instanceof PhotonMedium || otherObject instanceof PhotonLarge) {
			// 			//Only award points if the player was the one to kill the this				
			// 			playerShip.addToScore(this.PointWorth);
			// 		}
			// 	}
			// } else if (otherObject instanceof PlayerShip) {
			// 	GameObject.prototype.handleCollision.call(this, otherObject);
			// 	log(thisName + " hit by the player");
			// 	if(otherObject.isTurboThrusting()) {
			// 		// Turbo thrusting player instantly kills any enemy (with the exception of the asteroids and enemy base)
			// 		this.Health = 0;
			// 	} else {
			// 		this.Health -= otherObject.CollisionDamage;
			// 	}
			// 	log(thisName + " health is now: " + this.Health);
			// 	// If this dies from a player hitting it, points are still awarded
			// 	if (this.Health <= 0) {
			// 		// this dies
			// 		log(thisName + " died!");
			// 		if (this instanceof SludgerMine) {
			// 			game.mediaManager.Audio.SludgerMinePop.play();
			// 		} else {
			// 			game.mediaManager.Audio.SludgerDeath.play();
			// 		}
			// 		objectManager.removeObject(this);
			// 		numEnemiesKilled++;				
			// 		playerShip.addToScore(this.PointWorth);
			// 	}
            // } else if (otherObject instanceof AIGameObject || otherObject instanceof Asteroid) {
			// 	GameObject.prototype.handleCollision.call(this, otherObject);
			// 	log(thisName + " hit by Game Object: " + otherName);
			// 	this.Health -= otherObject.CollisionDamage;
			// 	log(thisName + " health is now: " + this.Health);
			// 	if (this.Health < 0) {
			// 		// this dies, no points awared as the player had nothing to do with it
			// 		log(thisName + " died!");
			// 		if (this instanceof SludgerMine) {
			// 			game.mediaManager.Audio.SludgerMinePop.play();
			// 		} else {
			// 			game.mediaManager.Audio.SludgerDeath.play();
			// 		}
			// 		objectManager.removeObject(this);
			// 		numEnemiesKilled++;
			// 	}
			// }
		// };
    // }
    // AIGameObject.prototype = Object.create(GameObject.prototype);
    // AIGameObject.prototype.constructor = AIGameObject;

    // function Projectile(ship) {
        // var tickCountSince;
        // GameObject.call(this);
        // if (ship === undefined) {
        //     return;
        // }

        // this.X = ship.X + (-Math.cos(ship.Angle) * ship.CollisionRadius);
        // this.Y = ship.Y + (-Math.sin(ship.Angle) * ship.CollisionRadius);
        // this.VelocityX = ship.VelocityX;
        // this.VelocityY = ship.VelocityY;
        // this.Lifetime = 0;
		// this.Damage = 0;

        // tickCountSince = {
        //     Creation: 0
        // };

        // this.draw = function (context) {
        //     Projectile.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, this.X - this.Width / 2, this.Y - this.Height / 2);
        // };

        // this.handleCollision = function (otherObject) {
        //     Projectile.prototype.handleCollision.call(this, otherObject);
        //     if (otherObject instanceof AIGameObject) {
        //         log("Projectile hit something!");
        //         objectManager.removeObject(this);
        //     }
        // };

        // this.updateState = function () {
        //     var i;

        //     for (i in tickCountSince) {
        //         if (tickCountSince.hasOwnProperty(i)) {
        //             tickCountSince[i] += 1;
        //         }
        //     }

        //     this.X += this.VelocityX;
        //     this.Y += this.VelocityY;

        //     if (tickCountSince.Creation >= this.Lifetime) {
        //         objectManager.removeObject(this);
        //     }
        // };
    // }
    // Projectile.prototype = Object.create(GameObject.prototype);
    // Projectile.prototype.constructor = Projectile;

    // function PhotonSmall(ship) {
        // Projectile.call(this, ship);
        // this.Width = 7;
        // this.Height = 7;
        // this.CollisionRadius = 4;
        // this.VelocityX += -Math.cos(ship.Angle) * 10;
        // this.VelocityY += -Math.sin(ship.Angle) * 10;
        // this.Sprite = game.mediaManager.Sprites.PhotonSmall;
        // this.Lifetime = 50;
		// this.Damage = 10;
		
		// this.handleCollision = function(otherObject) {
		// 	log("PhotonSmall hit: " + otherObject.constructor.name);
			
		// 	if (otherObject instanceof Base || otherObject instanceof PlayerShip || otherObject instanceof Powerup) {
		// 		// Don't want small photons to collide with player base or player
		// 		return;
		// 	}
			
		// 	game.mediaManager.Audio.CollisionDefaultWeapon.play();
		// 	objectManager.removeObject(this);
		// }
    // }
    // PhotonSmall.prototype = Object.create(Projectile.prototype);
    // PhotonSmall.prototype.constructor = PhotonSmall;
	
	// function PhotonMedium(ship, angle) {
		// Projectile.call(this, ship);
		// this.Width = 10;
		// this.Height = 10;
		// this.CollisionRadius = 5;
		// this.VelocityX += -Math.cos(ship.Angle + angle) * 10;
        // this.VelocityY += -Math.sin(ship.Angle + angle) * 10;
		// this.Sprite = game.mediaManager.Sprites.PhotonMedium;
		// this.Lifetime = 50;
		// this.Damage = 15;
		
		// this.handleCollision = function(otherObject) {
		// 	log("PhotonMedium hit: " + otherObject.constructor.name);
			
		// 	if (otherObject instanceof Base || otherObject instanceof PlayerShip || otherObject instanceof PhotonMedium || otherObject instanceof Powerup) {
		// 		// Don't want medium photons to collide with player base
		// 		return;
		// 	}
			
		// 	game.mediaManager.Audio.CollisionDefaultWeapon.play();
		// 	objectManager.removeObject(this);
		// }
	// }
	// PhotonMedium.prototype = Object.create(Projectile.prototype);
	// PhotonMedium.prototype.constructor = PhotonMedium;
	
	// function PhotonLarge(ship) {
		// Projectile.call(this, ship);
		// this.Width = 15;
		// this.Height = 16;
		// this.CollisionRadius = 8;
		// this.VelocityX += -Math.cos(ship.Angle) * 10;
        // this.VelocityY += -Math.sin(ship.Angle) * 10;
		// this.Sprite = game.mediaManager.Sprites.PhotonLarge;
		// this.Lifetime = 50;
		// this.Damage = 30;
		
		// this.handleCollision = function(otherObject) {
		// 	log("PhotonLarge hit: " + otherObject.constructor.name);
			
		// 	if (otherObject instanceof Base || otherObject instanceof PlayerShip || otherObject instanceof Projectile || otherObject instanceof SludgerMine || otherObject instanceof Powerup) {
		// 		// Don't want large photons to collide with player base or player
		// 		// Other projectiles and SludgerMines also do not stop the large photon
		// 		return;
		// 	}
			
		// 	game.mediaManager.Audio.CollisionDefaultWeapon.play();
		// 	objectManager.removeObject(this);
		// }
	// }
	// PhotonLarge.prototype = Object.create(Projectile.prototype);
	// PhotonLarge.prototype.constructor = PhotonLarge;

    // function PufferProjectile(ship) {
        // Projectile.call(this, ship);
        // this.Width = 17;
        // this.Height = 15;
        // this.CollisionRadius = 10;
        // this.VelocityX += Math.cos(ship.Angle) * 10;
        // this.VelocityY += Math.sin(ship.Angle) * 10;
        // this.Sprite = game.mediaManager.Sprites.PufferShot;
        // this.Lifetime = 50;
		// this.Damage = 20;

        // this.handleCollision = function (otherObject) {
        //     if (otherObject instanceof Puffer
        //      || otherObject instanceof PufferProjectile || otherObject instanceof Powerup) {
        //        return;
        //     } else if (otherObject instanceof PlayerShip) {
        //         log("PufferShot hit player!");
		// 		if (otherObject.isInvulnerable()) {
		// 			game.mediaManager.Audio.InvincibleCollision.play();
		// 		} else {
		// 			game.mediaManager.Audio.CollisionGeneral.play();
		// 		}
        //         objectManager.removeObject(this);
        //     } else if (otherObject instanceof Projectile) {
		// 		log("PufferProjectile hit another Projectile!");
        //         objectManager.removeObject(this);
		// 	}
        // };
    // }
    // PufferProjectile.prototype = Object.create(Projectile.prototype);
    // PufferProjectile.prototype.constructor = PufferProjectile;

    // function QuadBlasterProjectile(ship, angle) {
        // Projectile.call(this, ship);
        // this.Width = 13;
        // this.Height = 11;
        // this.CollisionRadius = 3;
        // this.VelocityX += Math.cos(angle) * 10;
        // this.VelocityY += Math.sin(angle) * 10;
        // this.Sprite = game.mediaManager.Sprites.PhotonQuad;
        // this.Lifetime = 50;
		// this.Damage = 5;

        // this.handleCollision = function (otherObject) {
		// 	if (otherObject instanceof Powerup) {
		// 		return;
		// 	} else if (otherObject instanceof PlayerShip) {
        //         log("QuadBlasterProjectile hit PlayerShip!");
		// 		if (otherObject.isInvulnerable()) {
		// 			game.mediaManager.Audio.InvincibleCollision.play();
		// 		} else {
		// 			game.mediaManager.Audio.CollisionQuad.play();
		// 		}
        //         objectManager.removeObject(this);
        //     } else if (otherObject instanceof Projectile) {
		// 		log("QuadBlasterProjectile hit another Projectile!");
        //         objectManager.removeObject(this);
		// 	}
        // };

    // }
    // QuadBlasterProjectile.prototype = Object.create(Projectile.prototype);
    // QuadBlasterProjectile.prototype.constructor = QuadBlasterProjectile;

    // function PlayerShip(context) {
    //     var animationFrames, spriteX, spriteY, rotationAmount, accel, numFramesSince, lives, health, maxSpeed, Bullets, BulletPowerups, OtherPowerups;
        // GameObject.call(this);
        // this.lives = 3;
        // this.health = 100;
        // this.maxHealth = 100;
        // this.Width = 42;
        // this.Height = 37;
        // this.Mass = 10;
        // this.CollisionRadius = 12; // Good balance between wings sticking out and body taking up the whole circle
        // this.X = context.canvas.width / 2 - (this.Width / 2);
        // this.Y = context.canvas.height / 2 - (this.Height / 2) - 1; // Start 1 pixel down to better line up with starting base.
        // this.VelocityX = 0;
        // this.VelocityY = 0;
        // this.Angle = Math.PI / 2; // Straight up
		// this.Fuel = 1500;
		// this.maxFuel = 1500;
        // this.SpareParts = 100; // Start with full spare parts
        // this.maxSpareParts = 100;
        // animationFrames = 32;
        // rotationAmount = (Math.PI * 2) / animationFrames; // 32 frames of animation in the sprite
        // this.Acceleration = 0.1;
        // numFramesSince = {
        //     Left: 0,
        //     Right: 0,
        //     Shooting: 0,
		// 	Repair: 0,
		// 	Death: 0,
        //     HealFromSparePart: 0,
        //     TakenDamage: 0
		// }
		// this.normalShipSprite = game.mediaManager.Sprites.PlayerShip;
		// this.invulnerableShipSprite = game.mediaManager.Sprites.PlayerShipInvulnerable;
		// this.Sprite = this.normalShipSprite;
        // spriteX = 0;
        // spriteY = 0;
        // this.MaxSpeed = 12;
		// this.CollisionDamage = 10;
		// this.isAccelerating = false;
		// this.atBase = false;
		
		// Setup for the low fuel sound
		// this.isLowFuel = false;
		// let lowFuelSoundCount = 1;
		// const lowFuelSoundCountMax = 3; // The number of times you want the low fuel sound to play
		// game.mediaManager.Audio.LowFuel.addEventListener('ended', function(){
		// 	if(lowFuelSoundCount < lowFuelSoundCountMax) {
		// 		game.mediaManager.Audio.LowFuel.play();
		// 		lowFuelSoundCount++;
		// 	} else {
		// 		lowFuelSoundCount = 1;
		// 	}
		// });

        // this.draw = function (context) {
        //     // TODO: Pass in true for second argument
        //     PlayerShip.prototype.draw.call(this, context);
        //     // Draw the ship 2 pixels higher to make it better fit inside of the collision circle
        //     context.drawImage(this.Sprite, spriteX, spriteY, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2 - 2, this.Width, this.Height);
        // };

        // this.handleCollision = function (otherObject) {
			
        //     // Don't die from asteroids yet. It looks cool to bounce off. Take this out when ship damage is implemented.
        //     if (otherObject instanceof Asteroid) {
		// 		PlayerShip.prototype.handleCollision.call(this, otherObject);     
        //         log("Player hit a Asteroid");
		// 		if (this.storedPowerupsActivated['InvulnerabilityPowerup'] != true) {
		// 			game.mediaManager.Audio.CollisionGeneral.play();
		// 			this.updateHealth(-1*otherObject.CollisionDamage);
		// 		} else {
		// 			game.mediaManager.Audio.InvincibleCollision.play();
		// 		}
        //         return;
        //     } else if (otherObject instanceof PufferProjectile || otherObject instanceof QuadBlasterProjectile) {
		// 		log("Player was hit by projectile: " + otherObject.constructor.name);
		// 		if (this.storedPowerupsActivated['InvulnerabilityPowerup'] != true) {
		// 			this.updateHealth(-1*otherObject.Damage);
		// 		}
		// 		return;
		// 	} else if (otherObject instanceof AIGameObject) {
		// 		if (this.storedPowerupsActivated['InvulnerabilityPowerup'] != true) {
		// 			this.updateHealth(-1*otherObject.CollisionDamage);
		// 			if (!(otherObject instanceof SludgerMine) && !(otherObject instanceof Slicer)) {
		// 				game.mediaManager.Audio.CollisionGeneral.play();
		// 			} else if (otherObject instanceof Slicer) {
		// 				game.mediaManager.Audio.SlicerAttack.play();
		// 			}
		// 		} else {
		// 			game.mediaManager.Audio.InvincibleCollision.play();
		// 		}
		// 		if (this.storedPowerupsActivated['TurboThrustPowerup'] != true || otherObject instanceof EnemyBase) {
		// 			// Hitting other objects (besides asteroids and the enemy base) only changes your direction and speed if you are not turbo thrusting
		// 			PlayerShip.prototype.handleCollision.call(this, otherObject);
		// 		}				
		// 	} else if (otherObject instanceof Base && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
		// 		this.atBase = true;
		// 		// Make it so that the ship will go towards the Player Base
		// 		// These are the coordinates the Base should be at if the ship is centered on the base
		// 		var baseX = context.canvas.width / 2 - (this.Width / 2);
		// 		var baseY = context.canvas.height / 2 - (this.Height / 2) + 2.5;
		// 		// There will be rounding error with the program, so don't check that the 
		// 		// values are equal but rather that they are within this threshold
		// 		var threshold = .5; 
		// 		if (this.VelocityX == 0 && this.VelocityY == 0 && Math.abs(otherObject.X - baseX) < threshold && Math.abs(otherObject.Y - baseY) < threshold) {
		// 			//The player ship is stopped at the base
					
		// 			if (numFramesSince.Repair >= 60 && (this.health < this.maxHealth || this.Fuel < this.maxFuel)) {
		// 				//Repair ship
		// 				numFramesSince.Repair = 0;
		// 				game.mediaManager.Audio.BaseRepair.play();
		// 				if (this.health < this.maxHealth) {
		// 					this.updateHealth(3);
		// 				}
		// 				if (this.Fuel < this.maxFuel) {
		// 					this.updateFuel(25);
		// 				}
		// 			}
		// 		} else if (!this.isAccelerating && (Math.abs(otherObject.X - baseX) > threshold || Math.abs(otherObject.Y - baseY) > threshold)) {
		// 			// Only pull the ship in if it is not accelerating
					
		// 			var vectorToBase = new Vector(otherObject.X - baseX, otherObject.Y - baseY);
		// 			var playerShipVelocity = new Vector(this.VelocityX, this.VelocityY);
		// 			var velocityChange = playerShipVelocity.Add(vectorToBase).Scale(0.001);
		// 			var minimumVelocityChangeMagnitude = 0.08;
		// 			if (velocityChange.Magnitude() < minimumVelocityChangeMagnitude) {
		// 				// Change the magnitude to the minimum magnitude
		// 				velocityChange = velocityChange.Scale(minimumVelocityChangeMagnitude / velocityChange.Magnitude());
		// 			}
					
		// 			//var dampeningFactor = Math.sqrt(playerShipVelocity.Magnitude()/this.MaxSpeed)*0.09+.9;
		// 			var dampeningFactor = playerShipVelocity.Magnitude()/this.MaxSpeed*0.09+.9;
					
		// 			var mag = playerShipVelocity.Magnitude();
		// 			if (mag < .5) {
		// 				dampeningFactor = .90;
		// 			} else if (mag < .6) {
		// 				dampeningFactor = .92;
		// 			} else if (mag < .75) {
		// 				dampeningFactor = .94;
		// 			} else if (mag < 1) {
		// 				dampeningFactor = .96;
		// 			} else if (mag < 2) {
		// 				dampeningFactor = .98;
		// 			} else {
		// 				dampeningFactor = .99;
		// 			}
					
		// 			var minimumDampening = .9;
		// 			if (dampeningFactor < minimumDampening) {
		// 				dampeningFactor = minimumDampening;
		// 			}
		// 			this.VelocityX += velocityChange.X;
		// 			this.VelocityX *= dampeningFactor;
		// 			this.VelocityY += velocityChange.Y;
		// 			this.VelocityY *= dampeningFactor;
		// 		} else if (!this.isAccelerating && this.VelocityX != 0 && this.VelocityY != 0) {
					
		// 			var vectorToBase = new Vector(otherObject.X - baseX, otherObject.Y - baseY);
		// 			this.VelocityX = this.VelocityX/4;
		// 			this.VelocityY = this.VelocityY/4;
		// 			if (this.VelocityX < 0.000001 && this.VelocityY < 0.00001) {
		// 				this.VelocityX = 0;
		// 				this.VelocityY = 0;
		// 			}
		// 		}
		// 	} else if (otherObject instanceof Powerup) {
		// 		this.handlePowerupCollision(otherObject);
		// 	}
        // }

        // this.updateHealth = function (healthChange) {
        //     if (healthChange < 0) {
        //         // Ship has taken damage
        //         numFramesSince.TakenDamage = 0;
        //     }

		// 	log("ship Health: " + this.health + ", changing by: " + healthChange);
		// 	this.health = this.health + healthChange;

		// 	if(this.health > this.maxHealth) {
		// 		this.health = this.maxHealth;
		// 	} else if(this.health <= 0) {
        //         this.health = 0;
		// 		this.die();
		// 	}

		// 	document.getElementById('health').setAttribute('value', this.health);
        // }
		
		// this.updateFuel = function (fuelChange) {
		// 	this.Fuel += fuelChange;
			
		// 	if (this.Fuel > this.maxFuel) {
		// 		this.Fuel = this.maxFuel;
		// 	} else if (this.Fuel < 0) {
		// 		this.Fuel = 0;
		// 	}
			
		// 	document.getElementById('fuel').setAttribute('value', this.Fuel);
		// }

        // this.updateSpareParts = function (sparePartsChange) {
        //     log("ship Spare Parts: " + this.SpareParts + ", changing by: " + sparePartsChange);
        //     this.SpareParts += sparePartsChange;

        //     if (this.SpareParts > this.maxSpareParts) {
        //         this.SpareParts = this.maxSpareParts;
        //     } else if (this.SpareParts < 0) {
        //         this.SpareParts = 0;
        //     }

        //     document.getElementById('spareParts').setAttribute('value', this.SpareParts);
        // }

        // this.die = function () {
        //     game.mediaManager.Audio.PlayerDeath.play();

        //     this.VelocityX = 0;
        //     this.VelocityY = 0;
        //     this.Angle = Math.PI / 2;
        //     spriteX = 0;
        //     spriteY = 0;

        //     this.lives--;

        //     if (this.lives <= 0) {
        //         objectManager.endGame();
        //     } else {
        //         if (this.lives === 1) {
        //             objectManager.displayMessage("1 life left", 60 * 5)
        //         } else {
        //             objectManager.displayMessage(this.lives + " lives left", 60 * 5)
        //         }
        //         objectManager.movePlayerShipTo(Math.random() * (objectManager.GameBounds.Right - objectManager.GameBounds.Left + 1) + objectManager.GameBounds.Left, Math.random() * (objectManager.GameBounds.Bottom - objectManager.GameBounds.Top + 1) + objectManager.GameBounds.Top);

        //         // reset health and fuel to full
		// 		log("Setting ship back to max health/fuel/spare parts");
        //         this.updateHealth(this.maxHealth);
        //         this.updateFuel(this.maxFuel);
        //         this.updateSpareParts(this.maxSpareParts);
				
		// 		// reset ship back to default powerup state
		// 		this.updatePowerupState(true);
				
		// 		// reset number of frames since death
		// 		numFramesSince['Death'] = 0;
        //     }
        // }

        // this.updateState = function () {
		// 	if (this.atBase) {
		// 		this.atBase = false;
		// 	}
        //     if (objectManager.enemiesRemaining() == 0) {
        //         objectManager.displayMessage("You conquered the fringe with a score of " + score, 99999999);
        //         this.VelocityX = 0;
        //         this.VelocityY = 0;
        //         objectManager.removeObject(this);
        //     }
			
		// 	this.updatePowerupState();
			
		// 	// Handle playing the fuel sound
		// 	const fuelSoundThreshold = (this.maxFuel / 5);
		// 	if (this.Fuel < fuelSoundThreshold && !this.isLowFuel) {
		// 		game.mediaManager.Audio.LowFuel.play();
		// 		this.isLowFuel = true;
		// 	} else if (this.Fuel > fuelSoundThreshold && this.isLowFuel) {
		// 		this.isLowFuel = false;
		// 	}
	
        //     // Handle healing from spare parts
        //     if (this.health < this.maxHealth && this.SpareParts > 0 && numFramesSince.HealFromSparePart > 30 && numFramesSince.TakenDamage > 120) {
        //         numFramesSince.HealFromSparePart = 0;
        //         this.updateSpareParts(-1);
        //         this.updateHealth(1);

        //         // TODO: I don't remember if there was a sound played here. I'll leave it out for now until I know for sure there was one
        //     }
        // }
	
		// Subtracted from each cycle, if > 0 powerup is active
		// this.powerupFramesRemaining = {
		// 	SpreadShotPowerup: 0,
		// 	PhotonLargePowerup: 0,
		// 	DoublePointsPowerup: 0,
		// 	InvulnerabilityPowerup: 0,
		// 	TurboThrustPowerup: 0
        // };
		// Stored powerups indicated by true here
		// this.storedPowerupsAvailable = {
		// 	InvulnerabilityPowerup: {
		// 		available: true,
		// 		duration: 60 * 10 // TODO: Connect this to the invulnerability powerup
		// 	},
		// 	TurboThrustPowerup: {
		// 		available: true,
		// 		duration: 60 * 2 // TODO: Connect this to the turbo thrust powerup
		// 	}
		// };
		// // Stored powerups that are currently activated indicated by true here
		// this.storedPowerupsActivated = {
		// 	InvulnerabilityPowerup: false,
		// 	TurboThrustPowerup: false
		// };
		// // Possible bullet states
		// Bullets = {
		// 	SMALL: 1,
		// 	SPREADSHOT: 2,
		// 	LARGE: 3
		// };
		// this.bulletState = Bullets.SMALL;
		// this.defaultShootingSpeed = 13;
		// this.bulletShootingSpeed = this.defaultShootingSpeed;
		// this.scoreMultiplier = 1;
		// // The speed you got at when using the turbo thrust powerup
		// const SPEED_OF_TURBO_THRUST = 2 * this.MaxSpeed;
		// // What to set the speed of the ship to after turbo thrusting so you get a little "drifting" after the boost
		// const SPEED_AFTER_TURBO_THRUST = 1;
		
		// this.handlePowerupCollision = function(powerupObject) {
		// 	if (powerupObject.Activation === INSTANT) {
		// 		// Start the powerup for the duration
		// 		this.powerupFramesRemaining[powerupObject.Name] = powerupObject.Duration;
		// 	} else if (powerupObject.Activation === BUTTON_PRESS) {
		// 		// Store powerup as available (note: if already stored cannot be stored again)
		// 		this.storedPowerupsAvailable[powerupObject.Name].available = true;
		// 		// Set the duration for the powerup even though it won't be used right away
		// 		this.storedPowerupsAvailable[powerupObject.Name].duration = powerupObject.Duration;
		// 	}
			
		// 	// Apply effect from powerup
		// 	if (powerupObject instanceof DoublePointsPowerup) {
		// 		this.scoreMultiplier = 2;
		// 		document.getElementById('doublePointsActive').style.visibility = "visible";
		// 	} else if (powerupObject instanceof ExtraFuelPowerup) {
		// 		//Gain back half of the max fuel
		// 		this.updateFuel(this.maxFuel/2);
		// 	} else if (powerupObject instanceof ShipRepairsPowerup) {
		// 		//Give back 1/3 of max health
		// 		this.updateHealth(this.maxHealth/3);
		// 	} else if (powerupObject instanceof SpreadShotPowerup) {
		// 		this.bulletState = Bullets.SPREADSHOT;
		// 		this.bulletShootingSpeed = powerupObject.shootingSpeed;
		// 		document.getElementById('spreadShotActive').style.visibility = "visible";
		// 		// Overrides photon large powerup so make sure that is hidden
		// 		document.getElementById('photonLargeActive').style.visibility = "hidden";
		// 	} else if (powerupObject instanceof PhotonLargePowerup) {
		// 		this.bulletState = Bullets.LARGE;
		// 		this.bulletShootingSpeed = powerupObject.shootingSpeed;
		// 		document.getElementById('photonLargeActive').style.visibility = "visible";
		// 		// Overrides spreadshot powerup so make sure that is hidden
		// 		document.getElementById('spreadShotActive').style.visibility = "hidden";				
		// 	} else if (powerupObject instanceof InvulnerabilityPowerup) {
		// 		document.getElementById('invulnerabilityAvailable').style.visibility = "visible";
		// 	} else if (powerupObject instanceof TurboThrustPowerup) {
		// 		document.getElementById('turboThrustAvailable').style.visibility = "visible";
		// 	} else if (powerupObject instanceof SparePartsPowerup) {
        //         this.updateSpareParts(25);
        //     }
		// }
		
		// this.updatePowerupState = function(reset = false) {
		// 	// Handle bullet powerups
		// 	if (this.bulletState == Bullets.SPREADSHOT) {
		// 		if (this.powerupFramesRemaining['SpreadShotPowerup'] <= 0 || (this.powerupFramesRemaining['SpreadShotPowerup'] > 0 && reset)) {
		// 			log("reverting spreadshot bullet powerup");
		// 			this.bulletState = Bullets.SMALL;
		// 			this.bulletShootingSpeed = this.defaultShootingSpeed;
		// 			document.getElementById('spreadShotActive').style.visibility = "hidden";
		// 		}
		// 	} else if (this.bulletState == Bullets.LARGE) {
		// 		if (this.powerupFramesRemaining['PhotonLargePowerup'] <= 0 || (this.powerupFramesRemaining['PhotonLargePowerup'] > 0 && reset)) {
		// 			log("reverting large bullet powerup");
		// 			this.bulletState = Bullets.SMALL;
		// 			this.bulletShootingSpeed = this.defaultShootingSpeed;
		// 			document.getElementById('photonLargeActive').style.visibility = "hidden";
		// 		}
		// 	}

		// 	// Handle other powerups
		// 	if ((this.powerupFramesRemaining['DoublePointsPowerup'] <= 0 && this.scoreMultiplier != 1) || (this.powerupFramesRemaining['DoublePointsPowerup'] > 0 && reset)) {
		// 		// Revert double points
		// 		log("reverting double points powerup");
		// 		document.getElementById('doublePointsActive').style.visibility = "hidden";
		// 		this.scoreMultiplier = 1;
		// 	}
		// 	if ((this.powerupFramesRemaining['InvulnerabilityPowerup'] <= 0 && this.storedPowerupsActivated['InvulnerabilityPowerup'] == true) || (this.powerupFramesRemaining['InvulnerabilityPowerup'] > 0 && reset)) {
		// 		// Revert invulnerability
		// 		log("reverting invulnerability powerup");
		// 		this.storedPowerupsActivated['InvulnerabilityPowerup'] = false;
		// 		this.Sprite = this.normalShipSprite;
		// 	}
		// 	if ((this.powerupFramesRemaining['TurboThrustPowerup'] <= 0 && this.storedPowerupsActivated['TurboThrustPowerup'] == true) || (this.powerupFramesRemaining['TurboThrustPowerup'] > 0 && reset)) {
		// 		// Revert turbo thrust
		// 		log("reverting turbo thrust powerup");
		// 		this.storedPowerupsActivated['TurboThrustPowerup'] = false;
		// 		this.VelocityX = this.VelocityX * SPEED_AFTER_TURBO_THRUST / SPEED_OF_TURBO_THRUST;
		// 		this.VelocityY = this.VelocityY * SPEED_AFTER_TURBO_THRUST / SPEED_OF_TURBO_THRUST;
		// 	}
		// }
		
		// this.isInvulnerable = function() {
		// 	return this.storedPowerupsActivated['InvulnerabilityPowerup'];
		// }
		
		// this.isTurboThrusting = function() {
		// 	return this.storedPowerupsActivated['TurboThrustPowerup'];
		// }
		
		// this.addToScore = function(amount) {
		// 	score += amount * this.scoreMultiplier;
		// }

        // this.processInput = function (KeyState) {
        //     var i, newVelX, newVelY;
		// 	this.isAccelerating = false;

        //     for (i in numFramesSince) {
        //         if (numFramesSince.hasOwnProperty(i)) {
        //             numFramesSince[i] += 1;
        //         }
        //     }
			
		// 	for (i in this.powerupFramesRemaining) {
		// 		if (this.powerupFramesRemaining.hasOwnProperty(i) && this.powerupFramesRemaining[i] > 0) {
		// 			this.powerupFramesRemaining[i] -= 1;
		// 		}
		// 	}

        //     if (KeyState.isDown(KeyState.UP) && this.Fuel > 0 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
		// 		this.isAccelerating = true;
		// 		this.updateFuel(-1);
        //         this.calculateAcceleration();
        //         spriteY = this.Height;
        //     } else {
        //         spriteY = 0;
        //     }

        //     if (KeyState.isDown(KeyState.LEFT) && numFramesSince.Left >= 3 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
        //         numFramesSince.Left = 0;
        //         spriteX -= this.Width;
        //         this.Angle -= rotationAmount;
        //         if (spriteX < 0) {
        //             spriteX = this.Width * animationFrames - this.Width;
        //         }
        //     }

        //     if (KeyState.isDown(KeyState.RIGHT) && numFramesSince.Right >= 3 && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
        //         numFramesSince.Right = 0;
        //         spriteX += this.Width;
        //         this.Angle += rotationAmount;
        //         if (spriteX >= this.Width * animationFrames) {
        //             spriteX = 0;
        //         }
        //     }

        //     if (KeyState.isDown(KeyState.SPACE) && !this.atBase && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
        //         if (numFramesSince.Shooting >= this.bulletShootingSpeed) { // 13 matches up best with the original game's rate of fire at 60fps
		// 			var photon;
		// 			if (this.bulletState == Bullets.SMALL) {
		// 				photon = new PhotonSmall(this);
		// 				game.mediaManager.Audio.PhotonSmall.play();
		// 			} else if (this.bulletState == Bullets.LARGE) {
		// 				photon = new PhotonLarge(this);
		// 				game.mediaManager.Audio.PhotonBig.play();
		// 			} else if (this.bulletState == Bullets.SPREADSHOT) {
		// 				photon = new PhotonMedium(this, 0);
		// 				var photon2 = new PhotonMedium(this, -Math.PI/16);
		// 				var photon3 = new PhotonMedium(this, Math.PI/16);
		// 				objectManager.addObject(photon2, this);
		// 				objectManager.addObject(photon3, this);
		// 				game.mediaManager.Audio.PhotonSpread.play();
		// 			}
		// 			objectManager.addObject(photon, this);
        //             numFramesSince.Shooting = 0;
        //         }
        //     }
			
		// 	if (KeyState.isDown(KeyState.V) && this.storedPowerupsAvailable['InvulnerabilityPowerup'].available == true) {
		// 		this.activateInvulnerability();
		// 	}
			
		// 	if (KeyState.isDown(KeyState.B) && this.storedPowerupsAvailable['TurboThrustPowerup'].available == true && this.storedPowerupsActivated['TurboThrustPowerup'] != true) {
		// 		this.activateTurboThrust();
		// 	}
			
		// 	// Allow a keypress of K to autokill the player. Do not allow this event to be fired more than once per second (60 frames) or when the player is at the base.
		// 	if(KeyState.isDown(KeyState.K) && numFramesSince['Death'] > 60 && !this.atBase) {
		// 		this.die();
		// 	}
        // };
		
		// this.activateInvulnerability = function() {
		// 	document.getElementById('invulnerabilityAvailable').style.visibility = "hidden";
		// 	this.storedPowerupsActivated['InvulnerabilityPowerup'] = true;
		// 	this.storedPowerupsAvailable['InvulnerabilityPowerup'].available = false;
		// 	this.powerupFramesRemaining['InvulnerabilityPowerup'] = this.storedPowerupsAvailable['InvulnerabilityPowerup'].duration;
		// 	game.mediaManager.Audio.InvincibleOrBoost.play();
		// 	this.Sprite = this.invulnerableShipSprite;
		// }
		
		// this.activateTurboThrust = function() {
		// 	document.getElementById('turboThrustAvailable').style.visibility = "hidden";
		// 	this.storedPowerupsActivated['TurboThrustPowerup'] = true;
		// 	this.storedPowerupsAvailable['TurboThrustPowerup'].available = false;
		// 	this.powerupFramesRemaining['TurboThrustPowerup'] = this.storedPowerupsAvailable['TurboThrustPowerup'].duration;
		// 	game.mediaManager.Audio.InvincibleOrBoost.play();
		// 	this.VelocityX = -Math.cos(this.Angle) * SPEED_OF_TURBO_THRUST;
		// 	this.VelocityY = Math.sin(-this.Angle) * SPEED_OF_TURBO_THRUST;
		// }
    // }
    // PlayerShip.prototype = Object.create(GameObject.prototype);
    // PlayerShip.prototype.constructor = PlayerShip;

    // function SludgerMine(bounds, playerShip) {
        // var numTicks = 0, spriteX, turnAbility, player, maxSpeed;
        // AIGameObject.call(this, playerShip);
        // this.Width = 24;
        // this.Height = 21;
        // this.CollisionRadius = 11;
        // this.Mass = 4;
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = 0;
        // this.VelocityY = 0;
        // this.Angle = 0;
        // this.Sprite = game.mediaManager.Sprites.SludgerMine;
        // spriteX = (Math.floor(Math.random() * 7)) * this.Width;
        // player = playerShip;
        // turnAbility = 0.09;
        // this.MaxSpeed = 4;
        // this.Acceleration = 0.1;
		// this.Health = 5;
		// this.CollisionDamage = 5;
		// this.PointWorth = 2;

        // this.draw = function (context) {
        //     SludgerMine.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2, this.Width, this.Height);
        // };

        // this.handleCollision = function (otherObject) {

        //     if (otherObject instanceof Sludger || otherObject instanceof SludgerMine || otherObject instanceof EnemyBase) {
        //         return;
        //     } else {
		// 		SludgerMine.prototype.handleCollision.call(this, otherObject);
		// 	}
        // };

        // this.updateState = function () {
        //     var angleToPlayer, angleDiff;
        //     numTicks += 1;

        //     if (numTicks >= 18) {
        //         numTicks = 0;
        //         spriteX += this.Width;
        //         if (spriteX >= this.Width * 8) {
        //             spriteX = 0;
        //         }
        //     }

        //     angleToPlayer = this.angleTo(player);

        //     angleDiff = angleToPlayer - this.Angle;

        //     this.Angle += angleDiff;

        //     if (angleToPlayer <= this.Angle + 0.1 || angleToPlayer > this.Angle - 0.1) {
        //         this.calculateAcceleration();
        //     }

        //     this.X += this.VelocityX;
        //     this.Y += this.VelocityY;
        // };
    // }
    // SludgerMine.prototype = Object.create(AIGameObject.prototype);
    // SludgerMine.prototype.constructor = SludgerMine;

    // function Sludger(bounds, playerShip) {
        // var numTicks = 0, spriteX, player, ticksToSpawnMine = 0;
        // AIGameObject.call(this, playerShip);
        // this.Width = 34;
        // this.Height = 31;
        // this.CollisionRadius = 16;
        // this.Mass = 8;
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = (Math.random() - Math.random()) * 3;
        // this.VelocityY = (Math.random() - Math.random()) * 3;
        // this.Angle = 0;
        // this.Sprite = game.mediaManager.Sprites.Sludger;
        // spriteX = 0;
        // player = playerShip;
		// this.CollisionDamage = 10;
		// this.Health = 10;
		// this.PointWorth = 25;

        // this.draw = function (context) {
        //     Sludger.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2, this.Width, this.Height);
        // };

        // this.handleCollision = function (otherObject) {

        //     if (otherObject instanceof Sludger || otherObject instanceof SludgerMine || otherObject instanceof EnemyBase) {
        //         return;
        //     } else {
		// 		Sludger.prototype.handleCollision.call(this, otherObject);
		// 	}
        // };

        // this.updateState = function () {
            // var angleToPlayer, angleDiff;

            // this.X += this.VelocityX;
            // this.Y += this.VelocityY;

            // if (numTicks >= 7) {
            //     numTicks = 0;
            //     spriteX += this.Width;
            //     if (spriteX >= this.Width * 15) {
            //         spriteX = 0;
            //     }
            // } else {
            //     numTicks += 1;
            // }

            // if (ticksToSpawnMine > 5 * 60) {
            //     var newMine = new SludgerMine(bounds, playerShip);
            //     objectManager.addObject(newMine, true);
            //     newMine.X = this.X;
            //     newMine.Y = this.Y;
            //     ticksToSpawnMine = 0;
            // } else {
            //     ticksToSpawnMine++;
            // }
        // };
    // }
    // Sludger.prototype = Object.create(AIGameObject.prototype);
    // Sludger.prototype.constructor = Sludger;

    // function Puffer(bounds, playerShip) {
        // var animationFrames, player, rotationAmount, maxFireRate, minFireRate, numFramesSince, spriteX, turnAbility, ticksToSpawnPhotons = 0;

        // AIGameObject.call(this, playerShip);
        // this.Width = 42;
        // this.Height = 49;
        // this.Mass = 10;
        // this.CollisionRadius = 14; // Good balance between wings sticking out and body taking up the whole circle
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = (Math.random() - Math.random()) * 1;
        // this.VelocityY = (Math.random() - Math.random()) * 1;
        // this.Angle = 0; // Straight up
        // spriteX = 0;
        // animationFrames = 32;
        // rotationAmount = (Math.PI * 2) / animationFrames; // 32 frames of animation in the sprite
        // numFramesSince = {
        //     Shooting: 0
        // };
        // player = playerShip;
        // turnAbility = 0.015;
        // maxFireRate = 3 * 60; // in seconds
        // minFireRate = 0.3 * 60; // in seconds
        // this.MaxSpeed = 1;
        // this.Acceleration = 0.1;
		// this.CollisionDamage = 15;
		// this.Health = 50;
		// this.PointWorth = 40;

        // this.Sprite = game.mediaManager.Sprites.Puffer;

        // this.draw = function (context) {
        //     Puffer.prototype.draw.call(this, context);
        //     // Draw the ship 2 pixels higher to make it better fit inside of the collision circle
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2 - 2, this.Width, this.Height);
        // };

        // this.handleCollision = function (otherObject) {
        //     if (otherObject instanceof PufferProjectile || otherObject instanceof EnemyBase) {
        //       return;
        //     } else {
		// 		Puffer.prototype.handleCollision.call(this, otherObject);
		// 	}
        // };

        // this.updateState = function () {
        //   var angleToPlayer, angleDiff, frame, frameAngle, i;

        //   angleDiff = this.angleDiffTo(player);

        //   // only move the ship angle toward player as fast as the turn ability will allow.
        //   if ( angleDiff > 0 ) this.Angle += turnAbility;
        //   else this.Angle -= turnAbility;

        //   frameAngle = this.Angle-Math.PI/2;

        //   frame = Math.floor((frameAngle+Math.PI)/rotationAmount);
        //   if (frame < 0) frame += animationFrames;

        //   spriteX = this.Width * frame;

        //   if (angleDiff <= this.Angle + 0.1 || angleDiff > this.Angle - 0.1) {
        //       this.calculateAcceleration();
        //   }

        //   this.X += this.VelocityX;
        //   this.Y += this.VelocityY;

        //   for (i in numFramesSince) {
        //     if (numFramesSince.hasOwnProperty(i)) {
        //       numFramesSince[i] += 1;
        //     }
        //   }


        //   if (ticksToSpawnPhotons <= 0) {
        //     if (angleDiff < 0.85 && angleDiff > -0.85) {
        //       var pufferProjectile = new PufferProjectile(this);
        //       objectManager.addObject(pufferProjectile, true);
        //       ticksToSpawnPhotons = (Math.random() * maxFireRate) + minFireRate;
        //     }
        //   }

        //   ticksToSpawnPhotons--;
        // };
    // }
    // Puffer.prototype = Object.create(AIGameObject.prototype);
    // Puffer.prototype.constructor = Puffer;
	
	// Intial Slicer copied from Puffer
	// function Slicer(bounds, playerShip) {
    //     var animationFrames, player, rotationAmount, maxFireRate, minFireRate, numFramesSince, spriteX, turnAbility, ticksToSpawnPhotons = 0;

        // AIGameObject.call(this, playerShip);
        // this.Width = 50;
        // this.Height = 50;
        // this.Mass = 50;
        // this.CollisionRadius = 14; 
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = (Math.random() - Math.random()) * 1;
        // this.VelocityY = (Math.random() - Math.random()) * 1;
        // this.Angle = 0; // Straight up
        // spriteX = 0;
        // animationFrames = 26;
        // rotationAmount = (Math.PI * 2) / animationFrames; 
		// TODO: This can be removed?
        // numFramesSince = {
        //     Shooting: 0
        // };
        // player = playerShip;
        // turnAbility = 0.3;
        // this.MaxSpeed = 10;
        // this.Acceleration = 0.175;
		// this.CollisionDamage = 25;
		// this.Health = 100;
		// this.PointWorth = 100;

        // this.Sprite = game.mediaManager.Sprites.Slicer;

        // this.draw = function (context) {
        //     Slicer.prototype.draw.call(this, context);
        //     // Draw the ship 2 pixels higher to make it better fit inside of the collision circle
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2 - 2, this.Width, this.Height);
        // };

        // this.handleCollision = function (otherObject) {
        //     if (otherObject instanceof Slicer || otherObject instanceof EnemyBase) {
        //       return;
        //     } else {
		// 		Slicer.prototype.handleCollision.call(this, otherObject);
		// 	}
        // };

        // this.updateState = function () {
		// 	var angleToPlayer, angleDiff, frame, frameAngle, i, photon;

		// 	angleDiff = this.angleDiffTo(player);

		// 	// only move the ship angle toward player as fast as the turn ability will allow.
		// 	// If turn angle is greater than the actual angle to the player, only turn to the actual actual of the player
		// 	if ( angleDiff > 0 ) {
		// 		if (turnAbility > angleDiff) {
		// 			this.Angle += angleDiff;
		// 		} else { 
		// 			this.Angle += turnAbility;
		// 		}
		// 	}
		// 	else {
		// 		if (-1*turnAbility < angleDiff) {
		// 			this.Angle -= -1*angleDiff;
		// 		} else { 
		// 			this.Angle -= turnAbility;
		// 		}
		// 	}

		// 	// Calculate the Slicer animation frame to show
		// 	frameAngle = this.Angle-Math.PI/2;

		// 	frame = Math.floor((frameAngle+Math.PI)/rotationAmount);
		// 	if (frame < 0) frame += animationFrames;

		// 	spriteX = this.Width * frame;

		// 	if (angleDiff <= this.Angle + 0.1 || angleDiff > this.Angle - 0.1) {
		// 		this.calculateAcceleration();
		// 	}

		// 	//Update position of Slicer
		// 	this.X += this.VelocityX;
		// 	this.Y += this.VelocityY;

		// 	for (i in numFramesSince) {
		// 		if (numFramesSince.hasOwnProperty(i)) {
		// 			numFramesSince[i] += 1;
		// 		}
		// 	}

        // };
    // }
    // Slicer.prototype = Object.create(AIGameObject.prototype);
    // Slicer.prototype.constructor = Slicer;

    // function QuadBlaster(bounds, playerShip) {
    //     var animationFrames, maxFireRate, minFireRate, numTicks = 0, spriteX, player, rotationAmount, ticksToSpawnPhotons = 0;
        // AIGameObject.call(this, playerShip);
        // this.Width = 40;
        // this.Height = 50;
        // this.CollisionRadius = 16;
        // this.Mass = 8;
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = (Math.random() - Math.random()) * 1;
        // this.VelocityY = (Math.random() - Math.random()) * 1;
        // this.Angle = 0;
        // animationFrames = 8 ; // number of frames in the sprite, the sprite only has 1/4th of the whole rotation
        // rotationAmount = (Math.PI * 2) / (animationFrames * 4); // multiply by 4 to account for sprite being only a 1/4th
        // this.Sprite = game.mediaManager.Sprites.QuadBlaster;
        // maxFireRate = 3 * 60; // in seconds
        // minFireRate = 0.3 * 60; // in seconds
        // spriteX = 10; // sprite starts 10 px in for some 
        // player = playerShip;
        // this.inScene = false;
		// this.CollisionDamage = 15;
		// this.Health = 40;
		// this.PointWorth = 30;

        // this.getAngleOfBarrelToward = function (object) {
        //   var angle = this.angleTo(player);

        //   var quadrant = [
        //     0,
        //     1.55,
        //     -1.55,
        //     3.15
        //   ];
        //   var quadrantAdjusted = [];

        //   var i = 0;
        //   for (i = 0;i < 4; i++) {
        //     quadrantAdjusted[i] = quadrant[i] + this.Angle;
        //     if (quadrantAdjusted[i] > Math.PI) {
        //       quadrantAdjusted[i] -= Math.PI *2;
        //     }
        //   }

        //   var closest;
        //   for (i = 0;i < 4; i++) {
        //     if (closest == null || Math.abs(quadrantAdjusted[i] - angle) < Math.abs(closest - angle)) {
        //       closest = quadrantAdjusted[i];
        //     }
        //   }

        //   var quadrantNum = quadrantAdjusted.indexOf(closest);

        //   return quadrantAdjusted[quadrantNum];
        // }

        // this.draw = function (context) {
        //     QuadBlaster.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2, this.Width, this.Height);
        //     this.inScene = true;

        //     if (DEBUG) {
        //         var barrelAngle = this.getAngleOfBarrelToward(player);
        //         context.beginPath();
        //         context.strokeStyle = "green";
        //         context.moveTo(this.X, this.Y);
        //         context.lineTo(this.X + Math.cos(barrelAngle) * this.CollisionRadius * 2, this.Y + Math.sin(barrelAngle) * this.CollisionRadius * 2);
        //         context.stroke();

        //         context.beginPath();
        //         context.strokeStyle = "red";
        //         context.arc(this.X, this.Y, this.CollisionRadius + 2, barrelAngle-0.775, barrelAngle+0.775);
        //         context.lineWidth = 2;
        //         context.stroke();
        //     }
        // };

        // this.handleCollision = function (otherObject) {
		// 	if (otherObject instanceof QuadBlaster || otherObject instanceof QuadBlasterProjectile || otherObject instanceof EnemyBase) {
        //       return;
        //     } else {
		// 		QuadBlaster.prototype.handleCollision.call(this, otherObject);
		// 	}
        // };

        // this.updateState = function () {
        //     var barrelToPlayer, angleToPlayer, angleRatio;

        //     this.X += this.VelocityX;
        //     this.Y += this.VelocityY;

        //     if (!this.inScene) return;
        //     this.inScene = false;

        //     if (numTicks >= 10) { // rotate every 10 ticks / 1/6th second / 166ms
        //       numTicks = 0;
        //       spriteX += this.Width;
        //       this.Angle += rotationAmount;
        //       if (this.Angle > Math.PI) {
        //         this.Angle -= Math.PI *2;
        //       }

        //       if (spriteX >= this.Width * animationFrames) {
        //           spriteX = 10;
        //       }
        //     }
        //     numTicks++;

        //     if (ticksToSpawnPhotons <= 0) {
        //       barrelToPlayer = this.getAngleOfBarrelToward(player);
        //       angleToPlayer = this.angleTo(player);
        //       angleRatio = angleToPlayer/barrelToPlayer;

        //       if (angleRatio < 1.15 && angleRatio > 0.85) {

        //         var projectile = new QuadBlasterProjectile(this, barrelToPlayer);
        //         objectManager.addObject(projectile, true);
        //         projectile.X = this.X;
        //         projectile.Y = this.Y;
        //         ticksToSpawnPhotons = (Math.random() * maxFireRate) + minFireRate;
        //       }
        //     }

        //     ticksToSpawnPhotons--;
        // };

    // }
    // QuadBlaster.prototype = Object.create(AIGameObject.prototype);
    // QuadBlaster.prototype.constructor = QuadBlaster;

    // function Star(bounds) {
        // var color, currentColor, hasColor, numTicksForColor = 0, twinkleMax, twinkleMin;
        // GameObject.call(this);
        // twinkleMax = 1 * 60; // in seconds
        // twinkleMin = 0.2 * 60; // in seconds
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // color = currentColor = ("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");

        // this.draw = function (context) {
        //     context.fillStyle = currentColor;
        //     context.fillRect(this.X, this.Y, 1, 1);
        // };

        // this.updateState = function () {
        //   if (numTicksForColor <= 0) {
        //     if (hasColor) {
        //       currentColor = "rgb(0,0,0)";
        //     } else {
        //       currentColor = color;
        //     }
        //     hasColor = !hasColor; // toggle

        //     numTicksForColor = (Math.random() * twinkleMax) + twinkleMin;
        //   }

        //   numTicksForColor--;
        // };
    // }
    // Star.prototype = Object.create(GameObject.prototype);
    // Star.prototype.constructor = Star;

    // function Base(context) {
        // var numTicksForAnim = 0, spriteX;
        // GameObject.call(this);
        // this.Width = 42;
        // this.Height = 32;
        // this.CollisionRadius = 30;
        // this.X = context.canvas.width / 2 - (this.Width / 2);
        // this.Y = context.canvas.height / 2 - (this.Height / 2);
        // this.Sprite = game.mediaManager.Sprites.Base;
        // spriteX = 0;

        // this.draw = function (context) {
        //     Base.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, spriteX, 0, this.Width, this.Height, this.X - this.Width / 2, this.Y - this.Height / 2, this.Width, this.Height);
        // };
		
		// this.handleCollision = function(otherObject) {
		// 	//log(otherObject.constructor.name + " collided with the player's base!");
		// };

        // this.updateState = function () {
        //     numTicksForAnim += 1;
        //     if (numTicksForAnim >= 6) {
        //         numTicksForAnim = 0;
        //         spriteX += this.Width;
        //         if (spriteX >= this.Width * 4) {
        //             spriteX = 0;
        //         }
        //     }
        // };
    // }
    // Base.prototype = Object.create(GameObject.prototype);
    // Base.prototype.constructor = Base;

    // function EnemyBase(bounds, playerShip) {
    //     var numTicksForSpawn = 0;
        // AIGameObject.call(this, playerShip);
        // this.Width = 62;
        // this.Height = 60;
		// this.Mass = 100000000;
        // this.CollisionRadius = 28;
        // this.X = -1000; //context.canvas.width / 2 - (this.Width / 2);
        // this.Y = -1000; //context.canvas.height / 2 - (this.Height / 2);
        /*this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;*/
        // this.Sprite = game.mediaManager.Sprites.EnemyBase;
		// this.CollisionDamage = 50;

        // this.draw = function (context) {
        //     EnemyBase.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, this.X - this.Width / 2, this.Y - this.Height / 2);
        // };
		
		// this.handleCollision = function(otherObject) {
		// 	if (otherObject instanceof PlayerShip) {
		// 		log("PlayerShip hit the enemy base!");
		// 		if (otherObject.isInvulnerable()) {
		// 			game.mediaManager.Audio.InvincibleCollision.play();
		// 		} else {
		// 			game.mediaManager.Audio.CollisionGeneral.play();
		// 		}
		// 	}
		// };

        // this.updateState = function () {
        //     numTicksForSpawn += 1;
        //     if (numTicksForSpawn >= 10 * 60) {
        //         numTicksForSpawn = 0;
        //         //log("Enemy base spawning enemy");
        //     }
        // };
    // }
    // EnemyBase.prototype = Object.create(AIGameObject.prototype);
    // EnemyBase.prototype.constructor = EnemyBase;

    // function Asteroid(bounds) {
        // GameObject.call(this);
        // this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
        // this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
        // this.VelocityX = (Math.random() - Math.random()) * 2;
        // this.VelocityY = (Math.random() - Math.random()) * 2;

        // this.draw = function (context) {
        //     Asteroid.prototype.draw.call(this, context);
        //     context.drawImage(this.Sprite, this.X - this.Width / 2, this.Y - this.Height / 2);
        // };

        // this.updateState = function () {
        //     this.X += this.VelocityX;
        //     this.Y += this.VelocityY;
        // };
    // }
    // Asteroid.prototype = Object.create(GameObject.prototype);
    // Asteroid.prototype.constructor = Asteroid;

    // function Pebbles(bounds) {
        // Asteroid.call(this, bounds);
        // this.Width = 25;
        // this.Height = 26;
        // this.Mass = 100;
        // this.CollisionRadius = 13;
        // this.VelocityX *= 3;
        // this.VelocityY *= 3;
        // this.Sprite = game.mediaManager.Sprites.Pebbles;
		// this.CollisionDamage = 30;
    // }
    // Pebbles.prototype = Object.create(Asteroid.prototype);
    // Pebbles.prototype.constructor = Pebbles;

    // function Rocko(bounds) {
    //     Asteroid.call(this, bounds);
        // this.Width = 35;
        // this.Height = 36;
        // this.Mass = 500;
        // this.CollisionRadius = 18;
        // this.Sprite = game.mediaManager.Sprites.Rocko;
		// this.CollisionDamage = 60;
    // }
    // Rocko.prototype = Object.create(Asteroid.prototype);
    // Rocko.prototype.constructor = Rocko;

    // function ObjectManager(canvasContext) {
        // var objects, collidables, newObject, i, context, playerShip, moveObject, updateObjects, detectCollisions, drawObjects,
        //             GameBounds, checkBounds, handleCollision, setupPositions, numMessageTicks, numMessageTicksMax, message,
        //             isRunning, isPaused;

        // context = canvasContext;

        // this.GameBounds = GameBounds = {
        //     Left: -2000,
        //     Top: -2000,
        //     Right: 2000,
        //     Bottom: 2000
        // };

        // this.addObject = function (object, collidable) {
        //     collidable = typeof collidable !== 'undefined' ? collidable : true;
        //     objects.push(object);
        //     if (collidable) {
        //         collidables.push(object);
        //     }
        // };

        // this.removeObject = function (object) {
        //     var i;

        //     for (i = objects.length; i >= 0; i -= 1) {
        //         if (objects[i] === object) {
        //             objects.splice(i, 1);
        //             break;
        //         }
        //     }

        //     for (i = collidables.length; i >= 0; i -= 1) {
        //         if (collidables[i] === object) {
        //             collidables.splice(i, 1);
        //             break;
        //         }
        //     }
        // };

        // checkBounds = function (object) {
        //     if (object.X > GameBounds.Right) { 
		// 		object.X = GameBounds.Left + (object.X - GameBounds.Right); 
		// 	}
        //     else if (object.X < GameBounds.Left) { 
		// 		object.X = GameBounds.Right - (GameBounds.Left - object.X); 
		// 	}
        //     if (object.Y > GameBounds.Bottom) { 
		// 		object.Y = GameBounds.Top + (object.Y - GameBounds.Bottom); 
		// 	}
        //     else if (object.Y < GameBounds.Top) { 
		// 		object.Y = GameBounds.Bottom - (GameBounds.Top - object.Y); 
		// 	}
        // };

        // this.displayMessage = function (text, ticksToShow) {
        //     numMessageTicks = 0;
        //     numMessageTicksMax = ticksToShow;
        //     message = text;
        //     log("DisplayMessage called with " + text + " - " + ticksToShow);
        // };

        // this.handleResize = function (event) {
        //     var oldCenterX, oldCenterY, diffX, diffY;

        //     oldCenterX = context.canvas.width / 2;
        //     oldCenterY = context.canvas.height / 2;

        //     context.canvas.width = window.innerWidth;
        //     context.canvas.height = window.innerHeight;

        //     diffX = context.canvas.width / 2 - oldCenterX;
        //     diffY = context.canvas.height / 2 - oldCenterY;

        //     for (i = 0; i < objects.length; i += 1) {
        //         objects[i].X += diffX;
        //         objects[i].Y += diffY;
        //         checkBounds(objects[i]);
        //     }
        // };

        // moveObject = function (object) {
        //     if (object instanceof PlayerShip) { return; }

        //     object.X -= playerShip.VelocityX;
        //     object.Y -= playerShip.VelocityY;
        //     checkBounds(object);
        // };

        // updateObjects = function (objects) {
        //     var i;

        //     for (i = 0; i < objects.length; i += 1) {
        //         objects[i].processInput(Key);
        //         moveObject(objects[i]);
        //         objects[i].updateState();
        //     }
        // };

        // detectCollisions = function (collidables) {
        //     var i, j, collidablesSnapshot;

        //     collidablesSnapshot = collidables.slice(0);

        //     for (i = 0; i < collidablesSnapshot.length; i += 1) {
        //         for (j = i + 1; j < collidablesSnapshot.length; j += 1) {
        //             if (Math.pow((collidablesSnapshot[j].X - collidablesSnapshot[i].X), 2) + Math.pow((collidablesSnapshot[j].Y - collidablesSnapshot[i].Y), 2)
        //                     <=
        //                     (collidablesSnapshot[i].CollisionRadius + collidablesSnapshot[j].CollisionRadius) * (collidablesSnapshot[i].CollisionRadius + collidablesSnapshot[j].CollisionRadius)) {
        //                 var oldVelX = collidablesSnapshot[i].VelocityX;
		// 				var oldVelY = collidablesSnapshot[i].VelocityY;
		// 				collidablesSnapshot[i].handleCollision(collidablesSnapshot[j]);
		// 				var newVelX = collidablesSnapshot[i].VelocityX;
		// 				var newVelY = collidablesSnapshot[i].VelocityY;
		// 				collidablesSnapshot[i].VelocityX = oldVelX;
		// 				collidablesSnapshot[i].VelocityY = oldVelY;
        //                 collidablesSnapshot[j].handleCollision(collidablesSnapshot[i]);
		// 				collidablesSnapshot[i].VelocityX = newVelX;
		// 				collidablesSnapshot[i].VelocityY = newVelY;
        //             }
        //         }
        //     }
        // };

        // this.enemiesRemaining = function () {
        //     var i, numEnemies = 0;

        //     for (i = 0; i < objects.length; i += 1) {
        //         if (objects[i] instanceof AIGameObject && !(objects[i]   instanceof EnemyBase)) {
        //             numEnemies++;
        //         }
        //     }

        //     return numEnemies;
        // };

        // this.staticEffect = function (percentWorking) {
        //     var pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        //     var pixelData = pixels.data;
        //     for (var i = 0, n = pixelData.length; i < n; i += 4) {
        //         //var grayscale = pixelData[i  ] * .3 + pixelData[i+1] * .59 + pixelData[i+2] * .11;
        //         //pixelData[i  ] = grayscale;   // red
        //         //pixelData[i+1] = grayscale;   // green
        //         //pixelData[i+2] = grayscale;   // blue
        //         pixelData[i + 3] = Math.random() * (255 * (percentWorking / 100))// alpha
        //     }
        //     context.putImageData(pixels, 0, 0);
        // };

        // TODO: Delete this
        // var test;
        // var test2;

        // drawObjects = function (objects, context) {
        //     var i;
        //     context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			
		// 	if(DEBUG) {
		// 		context.save();
		// 		// Draw collision circle
		// 		var x = context.canvas.width - 100;
		// 		var y = context.canvas.height - 100;
				
		// 		// 0,90, and 180 degrees for frame of reference for drawing (in the order RGB)
		// 		context.beginPath();
        //         context.strokeStyle = "red";
		// 		context.moveTo(x, y);
		// 		context.lineTo(x + 80 * Math.cos(0), y + 80 * Math.sin(0));
		// 		context.stroke();
				
        //         context.beginPath();
        //         context.strokeStyle = "green";
		// 		context.moveTo(x, y);
		// 		context.lineTo(x + 80 * Math.cos(Math.PI/2), y + 80 * Math.sin(Math.PI/2));
		// 		context.stroke();
				
		// 		context.beginPath();
        //         context.strokeStyle = "blue";
		// 		context.moveTo(x, y);
		// 		context.lineTo(x + 80 * Math.cos(Math.PI), y + 80 * Math.sin(Math.PI));
		// 		context.stroke();
				
		// 		context.restore();
		// 	}
			
        //     //canvas.width = canvas.width; // This is only faster in some browsers and clearRect seems like the most logical way to clear the canvas. http://jsperf.com/canvasclear

        //     for (i = 0; i < objects.length; i += 1) {
        //         // Only draw the objects if they are within the viewing window
        //         if (objects[i].X + objects[i].Width > 0 &&
        //                 objects[i].X - objects[i].Width < context.canvas.width &&
        //                 objects[i].Y + objects[i].Height > 0 &&
        //                 objects[i].Y - objects[i].Height < context.canvas.height) {
        //             context.save();
        //             objects[i].draw(context);
        //             context.restore();
        //         }
        //     }

        //     // var test = new InteractableGameObjectWithMass(context.canvas.width / 2 - 100, context.canvas.height / 2 - 100, 42, 37, Math.PI / 2, game.mediaManager.Sprites.PlayerShip, 0, 0, 12, 30);
        //     // test.draw(context, 0, 2, true);
        //     // if (!test) {
        //         // NewMediaManager.init();
        //         // test = 2;
        //         // test = new PlayerShipTest(context.canvas.width / 2 - 50, context.canvas.height / 2 - 50, .5, .5);
        //         // test2 = new RockoTest(context.canvas.width / 2 - 100, context.canvas.height / 2 - 100, game.mediaManager.Sprites.Rocko, 2, 2);
        //         // test = new EnemyBaseTest(context.canvas.width / 2 - 100, context.canvas.height / 2 - 100, game.mediaManager.Sprites.EnemyBase, test2);
        //         // console.log(test);
        //         // console.log(test2);
        //         // console.log(test.relativePositionTo(test.playerShipReference));
        //         // console.log(test.angleTo(test.playerShipReference));
        //         // console.log(test.angleDiffTo(test.playerShipReference));
        //         // // console.log(test);
        //         // // console.log(test2);
        //     // }
        //     // test.updateState();
        //     // test.draw(context, 0, true);
        //     // test2.updateState();
        //     // test2.draw(context, 0, true);

        //     numMessageTicks++;
        //     if (numMessageTicks < numMessageTicksMax) {
        //         context.fillStyle = '#808080';
        //         context.font = 'bold 30px sans-serif';
        //         context.textBaseline = 'bottom';
        //         context.fillText(message, context.canvas.width / 2 - (((message.length / 2) * 30) / 2), context.canvas.height / 2 - 40);
        //     }
        // };

        // this.movePlayerShipTo = function (x, y) {
        //     var diffX, diffY;

        //     //diffX = playerShip.X - x;
        //     //diffY = playerShip.Y - y;

        //     for (i = 0; i < objects.length; i += 1) {
        //         if (objects[i] instanceof PlayerShip) continue;
        //         //objects[i].X += diffX;
        //         //objects[i].Y += diffY;
        //         objects[i].X -= x;
        //         objects[i].Y -= y;
        //         checkBounds(objects[i]);
        //     }
        // }

        // this.initializeGame = function () {
            // objects = [];
            // collidables = [];

            // game.PlayerShip = playerShip = new PlayerShip(context);

            // for (i = 0; i < 600; i += 1) {
            //     this.addObject(new Star(GameBounds), false);
            // }

            // this.addObject(new Base(context));

            // this.addObject(new EnemyBase(GameBounds, game.PlayerShip));

            // for (i = 0; i < 6; i += 1) {
            //     this.addObject(new Pebbles(GameBounds));
            // }

            // for (i = 0; i < 3; i += 1) {
            //     this.addObject(new Rocko(GameBounds));
            // }

            // for (i = 0; i < 4; i += 1) {
            //     this.addObject(new Sludger(GameBounds, game.PlayerShip));
            // }

            // for (i = 0; i < 5; i += 1) {
            //     this.addObject(new QuadBlaster(GameBounds, game.PlayerShip));
            // }

            // for (i = 0; i < 4; i += 1) {
            //     this.addObject(new Puffer(GameBounds, game.PlayerShip));
            // }
			
			// for (i = 0; i < 2; i += 1) {
			// 	this.addObject(new Slicer(GameBounds, game.PlayerShip));
			// }

			// for (i = 0; i < 3; i += 1) {
				// this.addObject(new SludgerMine(GameBounds, game.PlayerShip));
			// }
			
			// this.addObject(new PhotonLargePowerup(GameBounds));
			// this.addObject(new SpreadShotPowerup(GameBounds));
			// this.addObject(new DoublePointsPowerup(GameBounds));
			// this.addObject(new ExtraFuelPowerup(GameBounds));
			// this.addObject(new ShipRepairsPowerup(GameBounds));
			// this.addObject(new InvulnerabilityPowerup(GameBounds));
			// this.addObject(new TurboThrustPowerup(GameBounds));
            // this.addObject(new SparePartsPowerup(GameBounds));

            // Add ship last so it draws on top of most objects
            // this.addObject(game.PlayerShip, true);
            // game.mediaManager.Audio.StartUp.play();
        // };

        // this.endGame = function () {
        //     this.isPaused = true;
        //     isRunning = false;
        //     objectManager.displayMessage("You achieved a score of " + score + " before the fringe took you", 99999999999);
        //     objectManager.removeObject(playerShip)
        // };

        // this.pauseGame = function () {
		// 	if (!this.isPaused) {
		// 	    this.isPaused = true;
		// 	    console.log('paused')
		// 	}
        // }

        // this.resumeGame = function () {
		// 	if (this.isPaused) {
		// 		this.isPaused = false;
		// 		objectManager.gameLoop(true);
		// 		animationLoop();
		// 		console.log('resume')
		// 	}
        // }

        // this.gameLoop = (function () {
        //     var i = 0, loops = 0, skipTicks = 1000 / 60, maxFrameSkip = 10, nextGameTick = (new Date()).getTime();

        //     return function (resetGameTick) {
        //         loops = 0;

        //         if (resetGameTick === true) {
        //             nextGameTick = (new Date()).getTime();
        //         }

        //         while ((new Date()).getTime() > nextGameTick && loops < maxFrameSkip) {
        //             updateObjects(objects);
        //             detectCollisions(collidables);
        //             nextGameTick += skipTicks;
        //             loops += 1;
        //         }

        //         if (loops) {
        //             drawObjects(objects, context);
        //         }
        //     };
        // } ());

        // this.initializeGame();
    // }

    // objectManager = new ObjectManager(canvas.getContext("2d"));

    // animationLoop = function() {
    //   // stop loop if paused
    //   if (objectManager.isPaused == true) return;

    //   // Start the game loop
    //   objectManager.gameLoop();
    //   requestAnimationFrame(animationLoop);
    // };

    // animationLoop();

    // function handleVisibilityChange() {
    //     if (document[hidden]) {
	// 		// Only pause the game if the game is not paused by Caps Lock
	// 		if(!isCapsPaused) {
	// 			objectManager.pauseGame();
	// 		}
    //     } else {
	// 		// Only resume the game if the game is not paused by Caps Lock
	// 		if(!isCapsPaused) {
	// 			objectManager.resumeGame();
	// 		}
    //     }
    // }

    // document.addEventListener(visibilityChange, handleVisibilityChange, false);

    // window.addEventListener('resize', function (event) { objectManager.handleResize(event); }, false);
    // window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
    // window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);

// };


