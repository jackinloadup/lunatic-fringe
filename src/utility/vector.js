// Vector helper class
export class Vector {
    constructor(x, y) {
        this.x = x || 0;
	    this.y = y || 0;
    }

    copy() { return new Vector(this.x, this.y); }
	add(other) { return this.copy()._add(other); }
	_add(other) { this.x += other.x; this.y += other.y; return this; }
	subtract(other) { return this.copy()._subtract(other); }
	_subtract(other) { this.x -= other.x; this.y -= other.y; return this; }
	scale(scalar) { return this.copy()._scale(scalar); }
	_scale(scalar) { this.x *= scalar; this.y *= scalar; return this; }
	dotProduct(other) { return this.x * other.x + this.y * other.y; }
	selfDotProduct() { return this.dotProduct(this); }
	normalize(other) { return this.copy().scale(1 / this.magnitude()); }
	magnitude() { return Math.sqrt(this.selfDotProduct()); }
}
