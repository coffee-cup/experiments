import p5 from 'p5';

import Matter from 'matter-js';
import Box from '../vehicles/box.js';

// Aliases
const Engine = Matter.Engine;

// Size stuff
const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const side = Math.min(iframe.offsetWidth, iframe.offsetHeight) - 10;
const width = Math.min(side, 800);
const height = Math.min(side, 800);
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

    const engine = Engine.create();
    const world = engine.world;

    const createGround = (x, y, w, h) => {
        const ground = new Box(x, y, w, h, { isStatic: true });
        ground.setStyles({
            fill: 'cyan',
            stroke: background
        });
        ground.addToWorld(world);
        return ground;
    };
    const statics = [
        createGround(width / 2 - 2, height, width + 2, 20),
        createGround(0, height / 2, 20, height),
        createGround(width, height / 2, 20, height)
    ];

    const boxes = [];

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
        // How should we be framed?
        // p.translate(0, height);

        Engine.update(engine, 1000 / fr);

        p.background(background);

        // Do nothing
        if (noFrame) {
            return;
        }

        boxes.forEach(box => {
            box.show(p);
        });

        statics.forEach(g => {
            g.show(p);
        });

        // Time goes on...
        t = t + 1;
    };

    p.mousePressed = () => {
        const box = new Box(
            p.mouseX,
            p.mouseY,
            p.random(10, 32),
            p.random(10, 20),
            {
                friction: 1,
                restitution: 0
            }
        );
        box.addToWorld(world);
        boxes.push(box);
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
