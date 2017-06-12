import p5 from 'p5';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 800);
const height = Math.min(side, 800);

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
        p.stroke(stroke);
        p.strokeWeight(1);
        p.noFill();
        p.smooth();
    };

    const center = p.createVector(0, 0);

    // Each frame draw
    p.draw = () => {
        p.stroke(stroke);
        p.background(background);

        // How should we be framed?
        p.translate(width / 2, height / 2);

        // Do nothing
        if (noFrame) {
            return;
        }

        const mouse = p.createVector(
            p.mouseX - width / 2,
            p.mouseY - height / 2
        );
        const subbed = mouse.sub(center);

        p.ellipse(center.x, center.y, subbed.mag(), subbed.mag());
        p.ellipse(mouse.x, mouse.y, 4, 4);
        p.line(center.x, center.y, mouse.x / 2, mouse.y / 2);

        // Time goes on...
        t = t + 1;
    };

    p.mouseClicked = () => {
        noFrame = !noFrame;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
