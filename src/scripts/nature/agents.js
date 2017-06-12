import p5 from 'p5';

import Mover from '../vehicles/mover.js';
import Agent from '../vehicles/agent.js';
import Vector from '../utils/vector.js';
import {
    wander,
    seek,
    followPath,
    followFlowField,
    stayWithinWalls
} from '../utils/behaviours.js';
import Path from '../utils/path.js';
import { perlinField } from '../utils/flowfield.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);

const width = Math.min(iframe.offsetWidth - 4, 10000);
const height = Math.min(iframe.offsetHeight - 4, 1000);

console.log(`width: ${width} | height: ${height}`);

const background = '#333333';
const foreground = '#FFFFFF';

// Frame rate
const fr = 30;

// Time
let t = 0;

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, 0, d);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v * -1, height);

    const createAgent = (agentOptions = {}, moverOptions = {}) => {
        agentOptions = Object.assign(
            {},
            {
                behaviours: []
            },
            agentOptions
        );
        moverOptions = Object.assign(
            {},
            {
                pos: new Vector(p.random(width), p.random(height)),
                maxForce: 1,
                maxSpeed: 10,
                bindToScreen: true,
                loopAround: true,
                screenWidth: width,
                screenHeight: height
            },
            moverOptions
        );
        return new Agent(agentOptions, moverOptions);
    };

    const wallPadding = 40;

    const car = new Mover({
        pos: new Vector(width / 2, height / 2),
        vel: new Vector(p.random(6, 10), p.random(6, 10)),
        width: 40,
        height: 20,
        radius: 40,
        bindToScreen: true,
        bounceOffScreen: true,
        screenWidth: width,
        screenHeight: height,
        fill: '#E7040F',
        showStroke: false
    });

    const path = new Path(
        20,
        new Vector(0, height / 3),
        new Vector(width, 2 * height / 3)
    );

    const ff = perlinField(width, height, 40);

    const createCarFollowers = () => {
        const agents = [];
        for (let i = 0; i < 1; i += 1) {
            agents.push(
                createAgent(
                    {
                        behaviours: [seek(car)]
                    },
                    {
                        maxSpeed: 10,
                        fill: '#E7040F'
                    }
                )
            );
        }
        return agents;
    };

    const createPathFollowers = () => {
        const agents = [];

        for (let i = 0; i < 10; i += 1) {
            agents.push(
                createAgent(
                    {
                        behaviours: [followPath(path)]
                    },
                    {
                        maxSpeed: 10,
                        maxForce: 1,
                        vel: new Vector(p.random(10), p.random(1))
                    }
                )
            );
        }

        return agents;
    };

    const createWanders = () => {
        const agents = [];
        for (let i = 0; i < 4; i += 1) {
            agents.push(
                createAgent(
                    {
                        behaviours: [
                            {
                                weight: 1,
                                fn: wander(p.random(2, 8))
                            },
                            {
                                weight: 20,
                                fn: stayWithinWalls(width, height, wallPadding)
                            }
                        ]
                    },
                    {
                        maxForce: 1,
                        maxSpeed: 4,
                        showAngle: false,
                        fill: '#A463F2'
                    }
                )
            );
        }
        return agents;
    };

    const createFlowers = () => {
        const agents = [];
        for (let i = 0; i < 10; i += 1) {
            agents.push(
                createAgent(
                    {
                        behaviours: [followFlowField(ff)]
                    },
                    {
                        maxSpeed: 10,
                        maxForce: 4,
                        radius: 5,
                        showStroke: false,
                        fill: 'white'
                    }
                )
            );
        }
        return agents;
    };

    // Array of arrays of agents
    let agentSets = [];

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.smooth();

        agentSets = [
            createCarFollowers(),
            createPathFollowers(),
            createWanders(),
            createFlowers()
        ];
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);

        // flow field
        // ff.draw(p);

        // car
        car.update();
        car.draw(p);

        // edges
        p.noFill();
        p.stroke(255, 100);
        p.rect(
            wallPadding,
            wallPadding,
            width - wallPadding * 2,
            height - wallPadding * 2
        );

        // path
        path.draw(p);

        const runAgent = a => {
            a.update();
            a.draw(p);
        };
        agentSets.forEach(agents => agents.forEach(runAgent));

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
