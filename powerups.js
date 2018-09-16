// Powerup activation constants
const INSTANT = 'INSTANT';
const BUTTON_PRESS = 'BUTTON_PRESS';

// All Powerups inherit from this
// activation: How the powerup is activated. Options: INSTANT and BUTTON_PRESS
// duration: How long the powerup lasts, in frames (60 frames per second) (0 for instantaneous)
function Powerup(bounds, options) {
	LunaticFringe.GameObject.call(this);
	
	this.Activation = options.activation;
	this.Duration = options.duration;
	this.Name = options.name;
	this.Width = options.width;
	this.Height = options.height;
	this.CollisionRadius = options.collisionRadius;
	this.Sprite = options.sprite;
	this.X = Math.random() * (bounds.Right - bounds.Left + 1) + bounds.Left;
	this.Y = Math.random() * (bounds.Bottom - bounds.Top + 1) + bounds.Top;
	log(this.Name + " created at: (" + this.X + "," + this.Y + ")");
	
	this.draw = function (context) {
		Powerup.prototype.draw.call(this, context);
		context.drawImage(this.Sprite, this.X - this.Width / 2, this.Y - this.Height / 2);
	};
	
	this.handleCollision = function(otherObject) {
		if(otherObject instanceof PlayerShip) {
			log(this.Name + " gained by the player");
			game.mediaManager.Audio.PowerupWow.play();
			objectManager.removeObject(this);
		}
	}
}
Powerup.prototype = Object.create(LunaticFringe.GameObject.prototype);
Powerup.prototype.constructor = Powerup;

function PhotonLargePowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: INSTANT, 
			duration: 60 * 30, 
			name: "PhotonLargePowerup",
			width: 15,
			height: 16,
			collisionRadius: 8,
			sprite: game.mediaManager.Sprites.PhotonLarge
		}
	);
	this.shootingSpeed = 60; // 1 bullet per second at 60 frames per second
}
PhotonLargePowerup.prototype = Object.create(Powerup.prototype);
PhotonLargePowerup.prototype.constructor = PhotonLargePowerup;

function SpreadShotPowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: INSTANT, 
			duration: 60 * 60, 
			name: "SpreadShotPowerup",
			width: 19,
			height: 16,
			collisionRadius: 9,
			sprite: game.mediaManager.Sprites.SpreadShot
		}
	);
	this.shootingSpeed = 39; // 60/39 bullets per second at 60 frames per second
}
SpreadShotPowerup.prototype = Object.create(Powerup.prototype);
SpreadShotPowerup.prototype.constructor = SpreadShotPowerup;

function DoublePointsPowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: INSTANT, 
			duration: 60 * 90, 
			name: "DoublePointsPowerup",
			width: 15,
			height: 16,
			collisionRadius: 8,
			sprite: game.mediaManager.Sprites.DoublePoints
		}
	);
}
DoublePointsPowerup.prototype = Object.create(Powerup.prototype);
DoublePointsPowerup.prototype.constructor = DoublePointsPowerup;

function ExtraFuelPowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: INSTANT, 
			duration: 0, 
			name: "ExtraFuelPowerup",
			width: 13,
			height: 13,
			collisionRadius: 7,
			sprite: game.mediaManager.Sprites.ExtraFuel
		}
	);

}
ExtraFuelPowerup.prototype = Object.create(Powerup.prototype);
ExtraFuelPowerup.prototype.constructor = ExtraFuelPowerup;

function ShipRepairsPowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: INSTANT, 
			duration: 0, 
			name: "ShipRepairsPowerup",
			width: 13,
			height: 13,
			collisionRadius: 7,
			sprite: game.mediaManager.Sprites.ShipRepairs
		}
	);
}
ShipRepairsPowerup.prototype = Object.create(Powerup.prototype);
ShipRepairsPowerup.prototype.constructor = ShipRepairsPowerup;

function InvulnerabilityPowerup(bounds) {
	Powerup.call(
		this, 
		bounds, 
		{
			activation: BUTTON_PRESS, 
			duration: 60 * 10, 
			name: "InvulnerabilityPowerup",
			width: 15,
			height: 19,
			collisionRadius: 9,
			sprite: game.mediaManager.Sprites.Invulnerability
		}
	);
}
InvulnerabilityPowerup.prototype = Object.create(Powerup.prototype);
InvulnerabilityPowerup.prototype.constructor = InvulnerabilityPowerup;