import p5 from 'p5';

import Mover from './vehicles/mover.js';
import Vector from './utils/vector.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const width = Math.min(iframe.offsetWidth - 4, 10000);
const height = Math.min(iframe.offsetHeight - 4, 10000);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#FFFFFF';
const stroke = '#333333';

// Frame rate
const fr = 30;

// Do nothing if true
let noFrame = false;

// Time
let t = 0;
let zoff = 0;

// const createWalker = (x, y) => ({x, y});

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, -1 * d / 2, d / 2);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v, height);

    const xinc = 0.01;
    const yinc = 0.01;

    const scl = 20;
    const rows = Math.floor(height / scl);
    const cols = Math.floor(width / scl);

    console.log(`rows: ${rows}`);
    console.log(`cols: ${cols}`);

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(stroke);
        p.strokeWeight(2);
        p.smooth();
    };

    const createParticle = (x, y) => {
        return new Mover({
            pos: new Vector(x, y),
            maxSpeed: 25,
            circle: true,
            point: true,
            connectWithPrev: true,
            strokeWeight: 1,
            bindToScreen: true,
            loopAround: true,
            screenWidth: width,
            screenHeight: height,
            stroke: 'rgba(160, 155, 231, 0.1)',
            follow(ff) {
                const x = Math.floor(this.pos.x / scl);
                const y = Math.floor(this.pos.y / scl);
                // console.log(x, y, this.pos.x, this.pos.y);
                const index = x + y * rows;
                const v = ff[index];
                const force = new Vector(v.x, v.y);
                this.applyForce(force);
            }
        });
    };

    const numParticles = 800;
    const particles = [];
    for (let i = 0; i < numParticles; i += 1) {
        particles.push(createParticle(p.random(0, width), p.random(0, height)));
    }

    const flowField = [];

    const updateFlowField = () => {
        let yoff = 0.0;
        for (let y = 0; y <= rows; y += 1) {
            let xoff = 0.0;
            for (let x = 0; x <= cols; x += 1) {
                const angle = p.noise(xoff, yoff, zoff) * (Math.PI * 2);
                const v = p.createVector(1, 0).rotate(angle);
                v.setMag(2);

                const index = x + y * rows;
                flowField[index] = v;

                // Draw flow field vectors
                // p.push();
                // p.stroke('rgba(255, 255, 255, 0.2)');
                // p.translate(x * scl, y * scl);
                // p.rotate(v.heading());
                // p.line(0, 0, scl, 0);
                // p.pop();

                xoff += xinc;
            }
            yoff += yinc;
        }
    };

    p.mouseClicked = () => {
        noFrame = !noFrame;
    };

    // Each frame draw
    p.draw = () => {
        // How should we be framed?
        // p.translate(0, height);

        // p.background(background);

        // Do nothing
        if (noFrame) {
            return;
        }

        p.stroke(stroke);

        // p.stroke('red');
        // p.ellipse(width / 2, height / 2, 100, 200);

        if (t > 400) {
            p.background(background);
            zoff += 10000;
            t = 0;
        }

        updateFlowField();

        particles.forEach(particle => {
            particle.follow(flowField);
            particle.update();
            particle.draw(p);
        });

        // p.stroke('red');
        // p.textSize(32);
        // p.fill('red');
        // p.text(`${Math.floor(p.frameRate())}`, 10, height - 10);

        // Time goes on...
        t += 1;
        zoff = zoff + 0.01;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
