import Vector from '../utils/vector.js';
import Agent from '../vehicles/agent.js';
import { separate, align, cohesion } from '../utils/behaviours.js';
import { fnOrVal } from '../utils/utils.js';

class Flock {
    constructor(flockOptions, moverOptions) {
        flockOptions = Object.assign(
            {},
            {
                separateWeight: 1.5,
                separateRadius: 40,
                alignWeight: 1.0,
                cohesionWeight: 0.1,
                viewRadius: 150,
                startingCount: 10
            },
            flockOptions
        );

        this.agents = [];

        const behaviours = [
            {
                weight: flockOptions.separateWeight,
                fn: separate(this.agents, flockOptions.separateRadius)
            },
            {
                weight: flockOptions.alignWeight,
                fn: align(this.agents, flockOptions.viewRadius)
            },
            {
                weight: flockOptions.cohesionWeight,
                fn: cohesion(this.agents, flockOptions.viewRadius)
            }
        ];

        this.agentOptions = { behaviours };
        this.moverOptions = Object.assign(
            {
                circle: true,
                radius: 4,
                maxSpeed: 8,
                maxForce: 1.5,
                fill: 'rgba(164, 99, 242, 0.8)',
                showStroke: false
            },
            moverOptions
        );

        for (let i = 0; i < flockOptions.startingCount; i += 1) {
            this.addAgent(fnOrVal(this.moverOptions.pos));
        }
    }

    createFlocker(pos = new Vector()) {
        return new Agent(
            this.agentOptions,
            Object.assign({}, this.moverOptions, {
                pos: pos,
                fill: fnOrVal(this.moverOptions.fill)
            })
        );
    }

    addAgent(pos = new Vector()) {
        this.agents.push(this.createFlocker(pos));
    }

    run(p) {
        this.agents.forEach(a => {
            a.update();
            a.draw(p);
        });
    }
}

export default Flock;
