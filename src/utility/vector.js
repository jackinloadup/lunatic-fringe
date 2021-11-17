// Vector helper class
export function Vector(x, y) {
	this.X = x || 0;
	this.Y = y || 0;

	this.Copy = function () { return new Vector(this.X, this.Y); }
	this.Add = function (other) { return this.Copy()._Add(other); }
	this._Add = function (other) { this.X += other.X; this.Y += other.Y; return this; }
	this.Subtract = function (other) { return this.Copy()._Subtract(other); }
	this._Subtract = function (other) { this.X -= other.X; this.Y -= other.Y; return this; }
	this.Scale = function (scalar) { return this.Copy()._Scale(scalar); }
	this._Scale = function (scalar) { this.X *= scalar; this.Y *= scalar; return this; }
	this.DotProduct = function (other) { return this.X * other.X + this.Y * other.Y; }
	this.SelfDotProduct = function () { return this.DotProduct(this); }
	this.Normalize = function (other) { return this.Copy().Scale(1 / this.Magnitude()); }
	this.Magnitude = function () { return Math.sqrt(this.SelfDotProduct()); }
}
