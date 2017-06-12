import { hri } from 'human-readable-ids';
import Mover from './mover.js';

class Agent {
    constructor(options, moverOptions) {
        const defaultOptions = {
            behaviours: [],
            type: 'agent',
            id: hri.random()
        };

        const defaultMoverOptions = {
            circle: true,
            maxForce: 0.2,
            maxSpeed: 4
        };

        options = Object.assign({}, defaultOptions, options);
        Object.assign(this, options);

        moverOptions = Object.assign({}, defaultMoverOptions, moverOptions);
        this.mover = new Mover(moverOptions);
    }

    applyBehaviours() {
        this.behaviours.forEach(b => {
            // The behaviours can be functions or objects
            //  with a weight and fn
            const isObj = typeof b === 'object';
            const weight = isObj ? b.weight : 1;
            const force = isObj ? b.fn(this) : b(this);
            this.mover.applyForce(force.multiply(weight));
        });
    }

    update() {
        this.applyBehaviours();
        this.mover.update();
    }

    draw(p) {
        this.mover.draw(p);
    }
}

export default Agent;
