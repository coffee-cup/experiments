import p5 from 'p5';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const width = Math.min(iframe.offsetWidth - 4, 10000);
const height = Math.min(iframe.offsetHeight - 4, 10000);

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

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.smooth();
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
