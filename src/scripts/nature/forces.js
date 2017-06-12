import p5 from 'p5';

import Mover from '../vehicles/mover.js';
import Vector from '../utils/vector.js';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);

const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;

const width = Math.min(side, 800);
const height = Math.min(side, 600);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#333333';
const foreground = '#FFFFFF';

// Frame rate
const fr = 60;

// Do nothing if true
const noFrame = false;

// Time
let t = 0;

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, 0, d);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v * -1, height);

    const wind = new Vector(0.1, 0);
    const gravity = m => new Vector(0, m.mass * 0.5);
    const friction = m => {
        const c = 0.05;
        const friction = m.vel.clone();
        friction.negative();
        friction.normalize();
        friction.multiply(new Vector(c, c));
        return friction;
    };

    const liquid = new Mover({
        pos: new Vector(width / 2, height - 150),
        width,
        height: 300,
        fill: 'rgba(214, 40, 40, 0.5)',
        showStroke: false,
        coefficientOfDrag: 0.4,

        // Applies a drag force to m if colliding
        drag() {
            const c = this.coefficientOfDrag;
            const l = this;
            return m => {
                if (!m.isCollidingWith(l)) {
                    return new Vector(0, 0);
                }
                const speed = m.vel.magnitude();
                const dragMag = c * speed * speed;

                const drag = m.vel.negative().setMag(dragMag);
                return drag;
            };
        }
    });

    const movers = [];
    const createMover = (x, y) => {
        const mass = Math.floor(p.random(10, 50));
        return new Mover({
            pos: new Vector(x, y),
            forces: [wind, gravity, friction, liquid.drag()],
            circle: true,
            fill: 'rgba(38, 240, 241, 0.5)',
            radius: mass,
            mass,
            bindToScreen: true,
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

    // Each frame draw
    p.draw = () => {
        // How should we be framed?
        // p.translate(0, );
        p.background(background);

        // Do nothing
        if (noFrame) {
            return;
        }

        liquid.draw(p);
        movers.forEach(m => {
            m.update();
            m.draw(p);
        });

        // Time goes on...
        t = t + 1;
    };

    p.mousePressed = () => {
        movers.push(createMover(p.mouseX, p.mouseY));
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
