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

const fr = 100;
const noFrame = false;

const addPerFrame = 250;

let t = 0;

const generatePolygon = n => {
    const cx = 0.5;
    const cy = 0.5;
    const radius = 0.5;

    const shape = [];
    for (let i = 0; i < n; i = i + 1) {
        const nx = cx + radius * Math.cos(2.0 * Math.PI * i / n);
        const ny = cy + radius * Math.sin(2.0 * Math.PI * i / n);
        shape.push({ x: nx, y: ny });
    }
    return shape;
};

let n = 3;
let r = 1 / 2;

const randomN = () => Math.floor(3 + Math.random() * 7);

// const randomR = () => 0.5 + Math.random() * 0.5;
const randomR = () => 1 / 2;

let shape = generatePolygon(n);

const randomPoint = shape => {
    const i = Math.floor(Math.random() * shape.length);
    return shape[i];
};

const inbetween = (pt1, pt2) => ({
    x: (pt1.x + pt2.x) * r,
    y: (pt1.y + pt2.y) * r
});

const sketch = p => {
    const mapToSpace = (v, d) => p.map(v, 0, 1, 0, d);
    const mTW = v => mapToSpace(v, width);
    const mTH = v => mapToSpace(v * -1, height);

    let currentPt = { x: 0.5, y: 0.5 };

    // Setup
    p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(fr);
        p.background(background);
        p.stroke(stroke);
        p.strokeWeight(1);
        p.noFill();
        p.smooth();

        // Initially run the algo to smooth out points
        for (let i = 0; i < 50; i = i + 1) {
            const randPt = randomPoint(shape);
            currentPt = inbetween(currentPt, randPt);
        }
    };

    // Each frame draw
    p.draw = () => {
        p.translate(0, height);

        if (noFrame) {
            return;
        }

        if (t * addPerFrame > width * n * 50) {
            t = 0;
            p.background(background);
            n = randomN();
            r = randomR();
            shape = generatePolygon(n);
            console.log(`n: ${n} | r: ${r}`);
        }

        p.stroke(stroke);
        for (let i = 0; i < addPerFrame; i = i + 1) {
            const randPt = randomPoint(shape);
            currentPt = inbetween(currentPt, randPt);
            p.point(mTW(currentPt.x), mTH(currentPt.y));
        }

        // p.stroke('#999999');
        // p.beginShape();
        // shape.forEach((pt) => {
        //     p.vertex(mTW(pt.x), mTH(pt.y));
        // });
        // p.endShape(p.CLOSE);

        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
