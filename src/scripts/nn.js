import p5 from 'p5';
import Perceptron, { Trainer } from './network/perceptron.js';

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
let count = 0;

const ptron = new Perceptron(3);
const training = new Array(2000);

const f = x => 2 * x + 1;

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

        for (let i = 0; i < training.length; i += 1) {
            const x = p.random(-width / 2, width / 2);
            const y = p.random(-height / 2, height / 2);
            const answer = y < f(x) ? -1 : 1;
            training[i] = new Trainer(x, y, answer);
        }
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);
        p.translate(width / 2, height / 2);

        ptron.train(training[count].inputs, training[count].answer);
        count = (count + 1) % training.length;

        for (let i = 0; i < count; i += 1) {
            const trainer = training[i];
            const guess = ptron.feedForward(trainer.inputs);
            if (guess > 0) {
                p.noFill();
            } else {
                p.fill('red');
            }
            p.ellipse(trainer.inputs[0], trainer.inputs[1], 8, 8);
        }

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
