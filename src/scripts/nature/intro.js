/* eslint-disable */

import p5 from 'p5';

const frameId = 'e-iframe';

const iframe = parent.document.getElementById(frameId);

const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 400);
const height = Math.min(side, 400);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#FFFFFF';
const stroke = '#333333';

// Frame rate
const fr = 20;

// Do nothing if true
const noFrame = false;

// Time
let t = 0;

const createWalker = (x, y) => ({ x, y });

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, -1 * d / 2, d / 2);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v, height);

    // Walker
    const walker = createWalker(0, 0);

    const monteCarlo = stepsize => {
        while (true) {
            const r1 = p.random(-1 * stepsize, stepsize);
            const probability = r1;
            const r2 = p.random(-1 * stepsize, stepsize);

            if (r2 < probability) {
                return r1;
            }
        }
    };

    // Take a step
    const step = (walker, t) => {
        const nx = p.noise(t);
        const ny = p.noise(t + 10000);
        return createWalker(nx, ny);
    };

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(stroke);
        p.strokeWeight(1);
        p.noFill();
        p.smooth();
    };

    const setPixelColor = (x, y, c) => {
        const d = p.pixelDensity();
        for (let i = 0; i < d; i = i + 1) {
            for (let j = 0; j < d; j = j + 1) {
                // loop over
                const idx = 4 * ((y * d + j) * width * d + (x * d + i));
                p.pixels[idx] = p.red(c);
                p.pixels[idx + 1] = p.green(c);
                p.pixels[idx + 2] = p.blue(c);
                p.pixels[idx + 3] = 100;
            }
        }
    };

    // Each frame draw
    p.draw = () => {
        // How should we be framed?
        // p.translate(0, height);

        // Do nothing
        if (noFrame) {
            return;
        }

        p.stroke(stroke);

        p.loadPixels();

        let xoff = 0.0;
        for (let x = 0; x < width; x = x + 1) {
            let yoff = 0.0;
            for (let y = 0; y < height; y = y + 1) {
                const bright = p.map(p.noise(xoff, yoff), 0, 1, 0, 255);
                const c = p.color(bright);
                setPixelColor(x, y, c);

                yoff += 0.01;
            }
            xoff += 0.5;
        }
        p.updatePixels();

        // p.stroke('red');
        // p.ellipse(0, 0, 10, 10);

        // Time goes on...
        t = t + 0.01;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
