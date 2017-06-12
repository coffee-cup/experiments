import Vector from './vector.js';
import { constrain } from './utils.js';

/*
 * Common forces we can apply to a mover
 */

export const gravity = (G = 0.2) => m => new Vector(0, m.mass * G);
export const wind = (wx, wy) => new Vector(wx, wy);

export const friction = (c = 0.01) =>
    m => {
        const friction = m.vel.negative().setMag(c);
        return friction;
    };

export const drag = (c = 0.01) =>
    m => {
        const speed = m.vel.magnitude();
        const dragMag = c * speed * speed;
        const drag = m.vel.negative().setMag(dragMag);
        return drag;
    };

export const attraction = (a, G = 1) =>
    m => {
        let aMass = 1;
        let aPos = a;
        if (a.type === 'mover') {
            aMass = a.mass;
            aPos = a.pos;
        }

        const force = aPos.subtract(m.pos);
        const distance = constrain(force.magnitude(), 5, 25);

        const strength = G * aMass * m.mass / (distance * distance);
        return force.setMag(strength);
    };

export const repulsion = (a, d, G = 1) =>
    m => {
        if (m.pos.distance(a.pos || a) > d) {
            return new Vector(0, 0);
        }

        const force = attraction(a, G)(m).negative();
        return force;
    };
