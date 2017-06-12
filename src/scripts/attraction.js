import p5 from 'p5';

import Mover from './vehicles/mover.js';
import Vector from './utils/vector.js';
import { attraction, wind } from './utils/forces.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 2200);
const height = Math.min(side, 1200);

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

    const attractors = [];
    attractors.push(
        new Mover({
            pos: new Vector(width / 2 + 200, height / 2),
            circle: true,
            radius: 20,
            mass: 1000,
            showStroke: false,
            showAngle: false
        })
    );
    attractors.push(
        new Mover({
            pos: new Vector(width / 2 - 200, height / 2),
            circle: true,
            radius: 20,
            mass: 1000,
            showStroke: false,
            showAngle: false
        })
    );

    const mouseAttractor = new Vector(0, 0);

    const createMover = (x, y) => {
        return new Mover({
            pos: new Vector(x, y),
            forces: attractors
                .map(a => attraction(a, 0.3))
                .concat([wind(0.1, 0.05), attraction(mouseAttractor, 400)]),
            circle: true,
            mass: 1,
            radius: 2,
            showAngle: false,
            showTrail: true,
            showFill: false,
            stroke: 'magenta',
            bindToScreen: false,
            bounceOffScreen: true,
            screenWidth: width,
            screenHeight: height
        });
    };

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.noFill();
        p.smooth();
    };

    const movers = [];
    for (let i = 0; i < 2; i += 1) {
        movers.push(createMover(width / 2 + 20, height / 2 + 100));
    }

    // Each frame draw
    p.draw = () => {
        p.background(background);

        mouseAttractor.x = p.mouseX;
        mouseAttractor.y = p.mouseY;

        movers.forEach(m => {
            m.update();
            m.draw(p);
        });
        attractors.forEach(a => {
            a.draw(p);
        });

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
