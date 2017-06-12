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
const red = '#E7040F';

// Frame rate
const fr = 100;

// Do nothing if true
const noFrame = false;

// Time
let t = 0;

const createWalker = (x, y) => ({ x, y });

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    const mapToSpace = (v, d) => p.map(v, 0, 1, -1 * d / 2, d / 2);
    const mTW = v => mapToSpace(v, width);
    const mTH = v => mapToSpace(v, height);

    // Walker
    let walker = createWalker(width / 2, height / 2);

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

    const points = [];

    // Each frame draw
    p.draw = () => {
        // How should we be framed?
        p.translate(width / 2, height / 2);
        p.background(background);

        // Do nothing
        if (noFrame) {
            return;
        }

        p.stroke(stroke);
        points.forEach(pt => {
            p.point(mTW(pt.x, 0, 1), mTH(pt.y, 0, 1));
        });

        p.stroke(red);
        p.ellipse(mTW(walker.x, 0, 1), mTH(walker.y, 0, 1), 4, 4);
        walker = step(walker, t);

        points.push(walker);

        // Time goes on...
        t = t + 0.01;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
