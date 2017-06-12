/*
 * A 3D vector class
 *
 * All methods return a new Vector and do not mutate the original
 */
class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.type = 'vector';
    }

    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v) {
        if (v instanceof Vector)
            return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        return new Vector(this.x + v, this.y + v, this.z + v);
    }

    subtract(v) {
        if (v instanceof Vector)
            return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        return new Vector(this.x - v, this.y - v, this.z - v);
    }

    multiply(v) {
        if (v instanceof Vector)
            return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        return new Vector(this.x * v, this.y * v, this.z * v);
    }

    divide(v) {
        if (v instanceof Vector)
            return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    distance(v) {
        return this.subtract(v).magnitude();
    }

    magnitude() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.magnitude());
    }

    setMag(v) {
        return this.normalize().multiply(v);
    }

    limit(v) {
        if (this.magnitude() > v) {
            return this.setMag(v);
        }
        return this.clone();
    }

    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    min2D() {
        return Math.min(this.x, this.y);
    }

    max2D() {
        return Math.max(this.x, this.y);
    }

    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.magnitude())
        };
    }

    angle() {
        return this.horizontalAngle();
    }

    horizontalAngle() {
        return Math.atan2(this.y, this.x);
    }

    verticalAngle() {
        return this.atan2(this.x, this.y);
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.magnitude() * a.magnitude()));
    }

    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }
}

export default Vector;

export const fromArray = arr =>
    new Vector(arr[0], arr[1], arr.length >= 3 ? arr[2] : 0);
export const fromAngle2D = theta =>
    new Vector(Math.cos(theta), Math.sin(theta), 0);
export const fromAngles = (theta, phi) =>
    new Vector(
        Math.cos(theta) * Math.cos(phi),
        Math.sin(phi),
        Math.sin(theta) * Math.cos(phi)
    );
export const fromPolar = (theta, r = 1) =>
    new Vector(r * Math.cos(theta), r * Math.sin(theta));
