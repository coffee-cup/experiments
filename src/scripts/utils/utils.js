import { perlin2 } from 'fantasy-map-noise';
import Vector from './vector.js';

export const extractPos = pom => {
    if (pom.type && pom.type === 'mover') {
        return pom.pos.clone();
    } else if (pom.type && pom.type === 'agent') {
        return pom.mover.pos.clone();
    }
    return pom.clone();
};

export const extractVel = pom => {
    if (pom.type && pom.type === 'mover') {
        return pom.vel.clone();
    } else if (pom.type && pom.type === 'agent') {
        return pom.mover.vel.clone();
    }
    return new Vector();
};

const cutHex = h => h.charAt(0) === '#' ? h.substring(1, 7) : h;
const hexToR = h => parseInt(cutHex(h).substring(0, 2), 16);
const hexToG = h => parseInt(cutHex(h).substring(2, 4), 16);
const hexToB = h => parseInt(cutHex(h).substring(4, 6), 16);

// Convert hex to rgb colour
export const hexToRGB = h => ({
    r: hexToR(h),
    g: hexToG(h),
    b: hexToB(h)
});

// Map value v in range [l1, h1] to [l2, h2]
export const map = (v, l1, h1, l2, h2) => (v - l1) / (h1 - l1) * (h2 - l2) + l2;

// Constrain value v between l and h
export const constrain = (v, l, h) => {
    if (v < l) {
        return l;
    } else if (v > h) {
        return h;
    }
    return v;
};

// Get normal point on line a-b to point p
export const getNormalPoint = (p, a, b) => {
    const ap = p.subtract(a);
    let ab = b.subtract(a);

    ab = ab.normalize();
    ab = ab.multiply(ap.dot(ab));
    const normalPoint = a.add(ab);
    return normalPoint;
};

// Get 2d perlin noise
export const pnoise = (x, y) => perlin2(x, y);

export const fnOrVal = (fv, ...args) => {
    if (typeof fv === 'function') {
        return fv(...args);
    } else if (
        typeof fv === 'object' && fv.type && fv.type === 'vector' && fv.clone
    ) {
        return fv.clone();
    }
    return fv;
};
