import randomColor from 'randomcolor';
import math from 'mathjs';

import Vector, { fromPolar } from '../utils/vector.js';
import Mover from './mover.js';
import { gravity } from '../utils/forces.js';

class Firework {
    constructor(options) {
        this.colour = randomColor({
            luminosity: 'bright',
            shouldPlay: false
        });

        options = Object.assign(
            {},
            {
                origin: new Vector(100, 100),
                halfSweep: Math.PI / 8,
                distanceRange: new Vector(200, 600)
            },
            options
        );
        const origin = options.origin;
        const halfSweep = options.halfSweep;
        const distanceRange = options.distanceRange;

        this.launchSound = options.launchSound;
        this.explosionSound = options.explosionSound;
        this.played = false;

        // vf^2 = vi^2 + 2ad
        const initialVel = d => Math.sqrt(-2 * -0.1 * d) * -1;

        const angle = math.random(
            Math.PI / 2 - halfSweep,
            Math.PI / 2 + halfSweep
        );
        const mag = math.random(
            initialVel(distanceRange.x),
            initialVel(distanceRange.y)
        );

        this.gravity = gravity(0.1);

        this.shot = new Mover({
            pos: origin,
            vel: fromPolar(angle, mag),
            forces: [this.gravity],
            circle: true,
            radius: 2,
            showStroke: false,
            showTrail: true,
            trailLimit: 40,
            fill: this.colour,
            trailColour: this.colour
        });

        this.explosionCount = math.randomInt(50, 100);
        this.exploded = false;
        this.explosion = [];
    }

    playSound(sound, volume = 0.2) {
        if (!this.shouldPlay) return;
        sound.setVolume(volume);
        sound.play();
    }

    explode() {
        this.exploded = true;
        if (this.explosionSound) {
            this.playSound(this.explosionSound, 0.2);
        }
        for (let i = 0; i < this.explosionCount; i += 1) {
            const angle = math.random(0, 2 * Math.PI);
            const mag = math.random(1, 6);
            this.explosion.push(
                new Mover({
                    pos: this.shot.pos.clone(),
                    vel: fromPolar(angle, mag),
                    forces: [this.gravity],
                    mass: math.random(0.2, 1.5),
                    lifespan: 100,
                    fadeAway: true,
                    circle: true,
                    point: false,
                    connectWithPrev: true,
                    radius: 1,
                    showStroke: true,
                    showTrail: false,
                    stroke: this.colour
                })
            );
        }
    }

    isDead() {
        return this.exploded && this.explosion.length === 0;
    }

    update() {
        if (!this.exploded) {
            this.shot.update();
            if (Math.abs(this.shot.vel.y) <= 0.1) {
                this.explode();
            }
        } else {
            // Update the count without updating the positions
            // This is so the alpha colour will continue to fade
            this.shot.count += 1;
        }
    }

    run(p, playSound = false) {
        this.shouldPlay = playSound;
        this.update();

        if (!this.played && this.launchSound) {
            this.playSound(this.launchSound, 0.6);
            this.played = true;
        }

        if (!this.exploded) this.shot.draw(p);

        this.explosion.forEach((m, index, object) => {
            m.update();
            m.draw(p);
            if (m.isDead()) {
                object.splice(index, 1);
            }
        });
    }
}

export default Firework;
