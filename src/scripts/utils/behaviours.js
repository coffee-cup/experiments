import math from 'mathjs';
import Vector, { fromPolar } from './vector.js';
import { extractPos, extractVel, map, getNormalPoint } from './utils.js';

// Returns a function that accepts an agent object
// Will return a force to apply to agent to reach target location
export const seek = target =>
    a => {
        const tPos = extractPos(target);
        const tVel = extractVel(target);
        const tRadius = target.radius || 10;
        const maxSpeed = a.mover.maxSpeed;

        // Predict where they will be
        const predictedLoc = tPos.add(tVel);

        let desired = predictedLoc.subtract(a.mover.pos);
        const d = desired.magnitude();
        desired = desired.normalize();

        // When within certain radius of target (arriving)
        //  slow down so you don't overshoot
        if (d < tRadius) {
            const m = map(d, 0, tRadius, 0, maxSpeed);
            desired = desired.setMag(m);
        } else {
            desired = desired.setMag(maxSpeed);
        }

        const steer = desired.subtract(a.mover.vel);

        return steer;
    };

const getFleeForce = (yourPos, targetPos) => {
    const d = yourPos.distance(targetPos);
    if (d === 0) {
        return fromPolar(math.random(0, Math.PI * 2));
    }
    return yourPos.subtract(targetPos);
};

// Returns a function that returns a force away from a target
//  only if the agent is within the targets radius
//  otherwise the force is 0
export const flee = (target, tRadius) =>
    a => {
        const m = a.mover;
        const tPos = extractPos(target);
        tRadius = tRadius || target.radius || false;
        const maxSpeed = a.mover.maxSpeed;

        const d = m.pos.distance(tPos);
        if (tRadius && d > tRadius) {
            return new Vector(0, 0);
        }

        const desired = getFleeForce(m.pos, tPos).setMag(maxSpeed);
        const steer = desired.subtract(a.mover.vel);
        return steer;
    };

// Avoid the walls with a force
export const stayWithinWalls = (width, height, padding) =>
    a => {
        const maxSpeed = a.mover.maxSpeed;
        const pos = a.mover.pos;
        const desired = a.mover.vel.clone();

        if (pos.x < padding) {
            desired.x = maxSpeed;
        } else if (pos.x > width - padding) {
            desired.x = -1 * maxSpeed;
        }

        if (pos.y < padding) {
            desired.y = maxSpeed;
        } else if (pos.y > height - padding) {
            desired.y = -1 * maxSpeed;
        }

        const steer = desired.subtract(a.mover.vel);
        return steer;
    };

// Follow path (at least path.radius away)
export const followPath = path =>
    agent => {
        const m = agent.mover;
        const predictedLoc = m.pos.add(m.vel);

        const a = path.start;
        const b = path.end;
        const normalPoint = getNormalPoint(predictedLoc, path.start, path.end);

        let dir = b.subtract(a);
        dir = dir.setMag(50); // Move a bit along path
        const target = normalPoint.add(dir);

        const distance = normalPoint.distance(predictedLoc);
        if (distance > path.radius) {
            return seek(target)(agent);
        }
        return new Vector();
    };

// Wander by looking forward crazziness magnitude along velocity vector
//  then and a unit vector with random theta.
export const wander = (crazziness = 5) =>
    agent => {
        const m = agent.mover;
        const predictedLoc = m.pos.add(m.vel.setMag(crazziness));

        const angle = math.random(2 * Math.PI);
        const target = predictedLoc.add(fromPolar(angle, 1));
        return seek(target)(agent);
    };

// Follow path of flow field
export const followFlowField = flowfield =>
    agent => {
        const m = agent.mover;
        const desired = flowfield.lookup(m.pos).setMag(m.maxSpeed);

        const steer = desired.subtract(m.vel);
        return steer;
    };

const otherVehicles = (vehicles, id) => vehicles.filter(v => v.id !== id);

// Keep separated from an array of agents (vehicles)
export const separate = (vehicles, desiredSeparation) =>
    agent => {
        const m = agent.mover;
        desiredSeparation = desiredSeparation || m.radius;

        let sum = new Vector();
        let count = 0;
        otherVehicles(vehicles, agent.id).forEach(v => {
            const d = m.pos.distance(v.mover.pos);
            if (d < desiredSeparation) {
                const fleeForce = getFleeForce(m.pos, v.mover.pos).setMag(
                    1 / (d === 0 ? 0.001 : d)
                );
                sum = sum.add(fleeForce);
                count += 1;
            }
        });

        if (count <= 0) return new Vector();
        sum = sum.divide(count).setMag(m.maxSpeed);
        return sum.subtract(m.vel);
    };

export const align = (vehicles, dist = 50) =>
    agent => {
        const m = agent.mover;

        let sum = new Vector();
        let count = 0;
        otherVehicles(vehicles, agent.id).forEach(v => {
            const d = m.pos.distance(v.mover.pos);
            if (d < dist) {
                sum = sum.add(v.mover.vel);
                count += 1;
            }
        });

        if (count <= 0) return new Vector();
        sum = sum.divide(count).setMag(m.maxSpeed);
        return sum.subtract(m.vel);
    };

export const cohesion = (vehicles, dist = 50) =>
    agent => {
        const m = agent.mover;

        let sum = new Vector();
        let count = 0;
        otherVehicles(vehicles, agent.id).forEach(v => {
            const d = m.pos.distance(v.mover.pos);
            if (d < dist) {
                sum = sum.add(v.mover.pos);
                count += 1;
            }
        });

        if (count <= 0) return new Vector();
        return seek(sum.divide(count))(agent);
    };
