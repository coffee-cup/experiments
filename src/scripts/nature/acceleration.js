import p5 from 'p5';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 800);
const height = Math.min(side, 400);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#333333';
const stroke = '#FFFFFF';

// Frame rate
const fr = 30;

// Do nothing if true
const noFrame = false;

// Time
let t = 0;

const copy = o => Object.assign({}, o);

const createMover = (position, velocity, acceleration) => ({
    position,
    velocity,
    acceleration
});

const update = mover => {
    const newMover = copy(mover);
    newMover.position.add(newMover.velocity);
    newMover.velocity.add(newMover.acceleration).limit(10);

    return newMover;
};

const accelerateTowards = (mover, object) => {
    const diff = object.copy().sub(mover.position);
    return Object.assign({}, mover, {
        acceleration: diff.setMag(1 / diff.mag() * 100)
    });
};

const edges = mover => {
    const newMover = copy(mover);
    const padding = 0;

    if (mover.position.x > width - padding || mover.position.x < padding) {
        newMover.velocity.x *= -1;
        newMover.acceleration.x *= -0.5;
    }
    if (mover.position.y > height - padding || mover.position.y < padding) {
        newMover.velocity.y *= -1;
        newMover.acceleration.y *= -0.2;
    }

    return newMover;
};

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

    let mover = createMover(
        p.createVector(width / 2, height / 2),
        p.createVector(0, 0),
        p.createVector(0.1, 0.1)
    );

    // Each frame draw
    p.draw = () => {
        // How should we be framed?
        p.translate(0, 0);
        p.background(background);

        // Do nothing
        if (noFrame) {
            return;
        }

        const mouse = p.createVector(p.mouseX, p.mouseY);
        // if (mouse.x > 0 && mouse.y > 0 && mouse.x < width && mouse.y < height) {
        //     mover = accelerateTowards(mover, mouse);
        // }

        mover = accelerateTowards(mover, mouse);
        mover = edges(update(mover));
        p.ellipse(mover.position.x, mover.position.y, 4, 4);

        // Time goes on...
        t = t + 1;
    };

    p.mouseClicked = () => {
        // noFrame = !noFrame;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
