// Vector helper class
var Vector = function (x, y) {
	this.X = x || 0;
	this.Y = y || 0;
}
Vector.prototype.Copy = function () { return new Vector(this.X, this.Y); }
Vector.prototype.Add = function (other) { return this.Copy()._Add(other); }
Vector.prototype._Add = function (other) { this.X += other.X; this.Y += other.Y; return this; }
Vector.prototype.Subtract = function (other) { return this.Copy()._Subtract(other); }
Vector.prototype._Subtract = function (other) { this.X -= other.X; this.Y -= other.Y; return this; }
Vector.prototype.Scale = function (scalar) { return this.Copy()._Scale(scalar); }
Vector.prototype._Scale = function (scalar) { this.X *= scalar; this.Y *= scalar; return this; }
Vector.prototype.DotProduct = function (other) { return this.X * other.X + this.Y * other.Y; }
Vector.prototype.SelfDotProduct = function () { return this.DotProduct(this); }
Vector.prototype.Normalize = function (other) { return this.Copy().Scale(1 / this.Magnitude()); }
Vector.prototype.Magnitude = function () { return Math.sqrt(this.SelfDotProduct()); }
