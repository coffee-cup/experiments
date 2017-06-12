import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

import Firework from './vehicles/firework.js';
import Vector from './utils/vector.js';

// const frameId = 'e-iframe';
// const iframe = parent.document.getElementById(frameId);

const width = Math.min(parent.window.innerWidth - 10, 10000);
const height = Math.min(parent.window.innerHeight - 10, 10000);

console.log(`width: ${width} | height: ${height}`);

const background = '#333333';
const foreground = '#FFFFFF';

// Hacks to set fill of parent background
parent.document.body.style.backgroundColor = background;
parent.document.body.style.overflow = 'hidden';

// Frame rate
const fr = 60;

// Time
let t = 0;

let fireworkLaunchSound;
let fireworkExplosionSound;

let playSound = false;

const sketch = p => {
    // Map x y values to screen
    // Allows any width x height
    // const mapToSpace = (v, d) => p.map(v, 0, 1, 0, d);
    // const mTW = (v) => mapToSpace(v, width);
    // const mTH = (v) => mapToSpace(v * -1, height);

    const fireworks = [];

    const hwidth = width / 2;
    const createFirework = () => {
        return new Firework({
            origin: new Vector(
                p.random(hwidth - hwidth / 2, hwidth + hwidth / 2),
                height
            ),
            halfSweep: Math.PI / 10,
            distanceRange: new Vector(height / 2, height),
            launchSound: fireworkLaunchSound,
            explosionSound: fireworkExplosionSound,
            shouldPlay: playSound
        });
    };

    const fire = () => fireworks.push(createFirework());
    const timedFire = () => {
        fire();
        setTimeout(timedFire, p.random(200, 1000));
    };

    p.preload = () => {
        fireworkLaunchSound = p.loadSound('/firework_launch.mp3');
        fireworkExplosionSound = p.loadSound('/firework_explosion.mp3');
    };

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(foreground);
        p.strokeWeight(1);
        p.smooth();

        fire();
        fire();
        fire();
        fire();
        timedFire();
    };

    parent.document.body.addEventListener('click', () => {
        playSound = !playSound;
        fire();
    });

    p.mouseClicked = () => {
        playSound = !playSound;
        fire();
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);

        fireworks.forEach((f, index, object) => {
            f.run(p, playSound);
            if (f.isDead()) {
                object.splice(index, 1);
            }
        });

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
