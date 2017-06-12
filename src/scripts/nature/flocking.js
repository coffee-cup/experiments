import p5 from 'p5';
import math from 'mathjs';

import Flock from '../vehicles/flock.js';
import Vector from '../utils/vector.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const width = Math.min(iframe.offsetWidth - 4, 10000);
const height = Math.min(iframe.offsetHeight - 4, 10000);

console.log(`width: ${width} | height: ${height}`);

const background = '#FFFFFF';
const foreground = '#FFFFFF';

// Hacks to set fill of parent background
parent.document.body.style.backgroundColor = background;
parent.document.body.style.overflow = 'hidden';

// Frame rate
const fr = 30;

// Time
let t = 0;

const flock = new Flock(
    {
        separateWeight: 50,
        viewRadius: 100,
        startingCount: 80
    },
    {
        pos: () => new Vector(math.random(width), math.random(height)),
        fill: () => (math.random(100) < 90 ? '#20FC8F' : '#A463F2'),
        radius: 12,
        bindToScreen: true,
        loopAround: true,
        screenWidth: width,
        screenHeight: height
    }
);

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, 0, d);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v * -1, height);

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.smooth();
    };

    p.mouseClicked = () => {
        flock.addAgent(new Vector(p.mouseX, p.mouseY));
    };

    parent.document.body.addEventListener('click', e => {
        flock.addAgent(new Vector(e.clientX, e.clientY));
    });

    // Each frame draw
    p.draw = () => {
        p.background(background);

        // target.pos.x = p.mouseX;
        // target.pos.y = p.mouseY;
        // target.update();
        // target.draw(p);

        flock.run(p);

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
