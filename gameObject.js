// Game Objects
function GameObject() {

	this.X = 0;
	this.Y = 0;
	this.Width = 0;
	this.Height = 0;
	this.VelocityX = 0;
	this.VelocityY = 0;
	this.Mass = 0;
	this.CollisionRadius = 0;
	this.Sprite = null;

	GameObject.prototype.updateState = function () {
		//console.log("GameObject - updateState");
	};

	GameObject.prototype.draw = function (context) {
		if (DEBUG) {
			// Draw collision circle
			context.beginPath();
			context.strokeStyle = "blue";
			context.arc(this.X, this.Y, this.CollisionRadius, 0, Math.PI * 2);
			context.stroke();

			// Draw object angle
			context.beginPath();
			context.strokeStyle = "blue";
			context.moveTo(this.X, this.Y);
			if (this instanceof PlayerShip) {
				context.lineTo(this.X + -Math.cos(this.Angle) * this.CollisionRadius * 2, this.Y + -Math.sin(this.Angle) * this.CollisionRadius * 2);
			} else {
				context.lineTo(this.X + Math.cos(this.Angle) * this.CollisionRadius * 2, this.Y + Math.sin(this.Angle) * this.CollisionRadius * 2);
			}
			context.stroke();
		}
	};

	GameObject.prototype.handleCollision = function (otherObject) {
		var i, j, dx, dy, phi, magnitude_1, magnitude_2, direction_1, direction_2, new_xspeed_1, new_xspeed_2, new_yspeed_1, new_yspeed_2, final_xspeed_1, final_yspeed_1, final_xspeed_2, final_yspeed_2;
		
		if (this.Mass == 0 && otherObject.Mass == 0) {
			// This is bad because this means the new speed calculations will result in NaN
			error("Both objects had a mass of 0! Objects were: " + this.constructor.name + " and " + otherObject.constructor.name);
		}
		
		dx = this.X - otherObject.X;
		dy = this.Y - otherObject.Y;

		phi = Math.atan2(dy, dx);

		magnitude_1 = Math.sqrt(this.VelocityX * this.VelocityX + this.VelocityY * this.VelocityY);
		magnitude_2 = Math.sqrt(otherObject.VelocityX * otherObject.VelocityX + otherObject.VelocityY * otherObject.VelocityY);

		direction_1 = Math.atan2(this.VelocityY, this.VelocityX);
		direction_2 = Math.atan2(otherObject.VelocityY, otherObject.VelocityX);

		new_xspeed_1 = magnitude_1 * Math.cos(direction_1 - phi);
		new_yspeed_1 = magnitude_1 * Math.sin(direction_1 - phi);

		new_xspeed_2 = magnitude_2 * Math.cos(direction_2 - phi);
		//new_yspeed_2 = magnitude_2 * Math.sin(direction_2 - phi);

		final_xspeed_1 = ((this.Mass - otherObject.Mass) * new_xspeed_1 + (otherObject.Mass + otherObject.Mass) * new_xspeed_2) / (this.Mass + otherObject.Mass);
		//final_xspeed_2 = ((this.Mass + this.Mass) * new_xspeed_1 + (otherObject.Mass - this.Mass) * new_xspeed_2) / (this.Mass + otherObject.Mass);

		final_yspeed_1 = new_yspeed_1;
		//final_yspeed_2 = new_yspeed_2;

		this.VelocityX = Math.cos(phi) * final_xspeed_1 + Math.cos(phi + Math.PI / 2) * final_yspeed_1;
		this.VelocityY = Math.sin(phi) * final_xspeed_1 + Math.sin(phi + Math.PI / 2) * final_yspeed_1;
		//otherObject.VelocityX = Math.cos(phi) * final_xspeed_2 + Math.cos(phi + Math.PI / 2) * final_yspeed_2;
		//otherObject.VelocityY = Math.sin(phi) * final_xspeed_2 + Math.sin(phi + Math.PI / 2) * final_yspeed_2;
	};

	GameObject.prototype.processInput = function (KeyState) {
		//console.log("GameObject - processInput");
	};

	GameObject.prototype.calculateAcceleration = function () {

		var currentVelocity = new Vector(this.VelocityX, this.VelocityY);

		var acceleration;

		// The ship forces are opposite everything else. It doesn't move, it shifts the universe around it.
		if (this instanceof PlayerShip) {
			acceleration = new Vector(-Math.cos(this.Angle) * this.Acceleration, Math.sin(-this.Angle) * this.Acceleration);
		} else {
			acceleration = new Vector(Math.cos(this.Angle) * this.Acceleration, Math.sin(this.Angle) * this.Acceleration);
		}

		var newVelocity = currentVelocity.Add(acceleration);

		// Only apply Lorentz factor if acceleration increases speed
		if (newVelocity.Magnitude() > currentVelocity.Magnitude()) {
			var b = 1 - ((currentVelocity.Magnitude() * currentVelocity.Magnitude()) / (this.MaxSpeed * this.MaxSpeed));

			// If b is negative then just make it very small to prevent errors in the square root
			if (b <= 0) { b = 0.0000000001; }

			var lorentz_factor = Math.sqrt(b);

			acceleration = acceleration.Scale(lorentz_factor);
		}

		currentVelocity = currentVelocity.Add(acceleration);

		/* Allow acceleration in the forward direction to change the direction
		of currentVelocity by using the direction of newVelocity (without the Lorentz factor)
		with the magnitude of currentVelocity (that applies the Lorentz factor). Without this
		the ship is almost impossible to turn when at max speed. */
		if (currentVelocity.Magnitude() > 0) {
			currentVelocity = newVelocity.Normalize().Scale(currentVelocity.Magnitude());
		}

		this.VelocityX = currentVelocity.X;
		this.VelocityY = currentVelocity.Y;
	}
}