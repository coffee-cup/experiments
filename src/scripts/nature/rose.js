import p5 from 'p5';

const size = [1000, 600];

const background = '#F4F4F4';
const stroke = '#333333';

const TWO_PI = 2 * Math.PI;

const sketch = p => {
    // Setup
    p.setup = () => {
        p.createCanvas(size[0], size[1]);
        p.background(background);
        p.stroke(stroke);
        p.strokeWeight(1);
        p.noFill();
        p.smooth();
    };

    // Each frame draw
    p.draw = () => {
        p.translate(p.width / 2, p.height / 2);

        const n = 7;
        const d = 5;
        const k = n / d;

        p.beginShape();
        for (let a = 0; a < TWO_PI * d; a = a + 0.01) {
            const r = 200 * Math.cos(k * a);
            const x = r * Math.cos(a);
            const y = r * Math.sin(a);
            p.vertex(x, y);
        }
        p.endShape();
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
