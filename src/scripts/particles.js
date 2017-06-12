import p5 from 'p5';

import randomColor from 'randomcolor';
import Mover from './vehicles/mover.js';
import Vector from './utils/vector.js';
import ParticleSystem from './vehicles/particle-system.js';
import { repulsion, attraction } from './utils/forces.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 1000);
const height = Math.min(side, 800);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

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

    const systems = [];

    const target = new Mover({
        pos: new Vector(width / 2, height / 2),
        showFill: false,
        mass: 400,
        circle: true,
        radius: 200
    });

    const createSystem = (x, y) => {
        return new ParticleSystem(
            {
                origin: new Vector(x, y),
                lifespan: 100,
                vel: () =>
                    new Vector(
                        p.randomGaussian(0, 4) * 0.3,
                        p.randomGaussian() * 0.3 - 1
                    ),
                colour: () => randomColor()
            },
            {
                forces: [
                    attraction(target, 1),
                    repulsion(target, target.radius, 5)
                ],
                circle: false,
                width: 4,
                height: 4,
                bindToScreen: true,
                screenWidth: width,
                screenHeight: height,
                maxSpeed: 40
            }
        );
    };

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.smooth();

        systems.push(createSystem(width / 2, 60));
    };

    p.mouseClicked = () => {
        systems.push(createSystem(p.mouseX, p.mouseY));
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);

        // target.draw(p);
        systems.forEach(ps => {
            ps.run(p);
        });

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
