import math from 'mathjs';
import randomColor from 'randomcolor';

import Mover from './mover.js';
import Vector from '../utils/vector.js';
import { gravity } from '../utils/forces.js';

class ParticleSystem {
    constructor(options, moverOptions) {
        const defaultOptions = {
            origin: new Vector(0, 0),
            lifespan: 100
        };

        const defaultMoverOptions = {
            circle: true,
            radius: 4,
            showAngle: false,
            showStroke: true
        };

        options = Object.assign({}, defaultOptions, options);
        Object.assign(this, options);

        moverOptions = Object.assign({}, defaultMoverOptions, moverOptions);
        this.moverOptions = moverOptions;

        this.count = 0;
        this.particles = [];
    }

    addParticle(pos) {
        const moverOptions = Object.assign(
            {},
            {
                pos: pos.clone(),
                vel: new Vector(math.random(-2, 2), math.random(-4, 0)),
                forces: [gravity(0.2)],
                lifespan: this.lifespan
            },
            this.moverOptions
        );

        if (typeof this.colour === 'function') {
            moverOptions.fill = this.colour(this);
        }
        if (typeof this.vel === 'function') {
            moverOptions.vel = this.vel();
        }

        this.particles.push(new Mover(moverOptions));
    }

    run(p) {
        this.addParticle(this.origin);
        this.particles.forEach((particle, index, object) => {
            particle.update();
            particle.draw(p);
            if (particle.isDead()) {
                object.splice(index, 1);
            }
        });
        this.count += 1;
    }
}

export const confettiSystem = (x, y, screenWidth, screenHeight) => {
    return new ParticleSystem(
        {
            origin: new Vector(x, y),
            lifespan: 100,
            colour() {
                return randomColor();
            }
        },
        {
            circle: false,
            width: 4,
            height: 4,
            bindToScreen: true,
            loopAround: true,
            screenWidth,
            screenHeight
        }
    );
};

export default ParticleSystem;
