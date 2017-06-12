import p5 from 'p5';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);

const width = Math.min(iframe.offsetWidth - 2, 10000);
const height = Math.min(iframe.offsetHeight - 4, 800);
const padding = 5;

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#FFFFFF';
const stroke = '#333333';

const fr = 100;
let noFrame = false;

const startingPopulation = 0.5;

let t = 0;

const sketch = p => {
    let startingLambda = 0;
    let endLambda = 4;

    const pickLambdas = () => {
        startingLambda = Math.max(
            0,
            Math.min(3.999999, p.randomGaussian(3.5, 0.5))
        );
        endLambda = p.random(Math.max(startingLambda, 3.5), 4);

        console.log(`lambdas :: s: ${startingLambda}, e: ${endLambda}`);
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

        pickLambdas();
    };

    p.mouseClicked = () => {
        noFrame = !noFrame;

        return false;
    };

    // Each frame draw
    p.draw = () => {
        p.translate(0, height - padding);

        if (noFrame) {
            return;
        }

        if (t >= width) {
            noFrame = true;
            setTimeout(() => {
                p.background(background);
                noFrame = false;
            }, 1000);

            t = 0;
            pickLambdas();
            return;
        }

        const lambda = p.map(t, 0, width, startingLambda, endLambda);
        const a = 300;

        const points = [];
        for (let i = 0; i <= a; i = i + 1) {
            let prevPop = startingPopulation;
            if (i - 1 > 0) {
                prevPop = points[i - 1].y;
            }
            const v = lambda * prevPop * (1 - prevPop);
            points.push({ x: lambda, y: v });
        }

        const values = points.splice(a - 150);

        values.forEach(pt => {
            const mx = p.map(pt.x, startingLambda, endLambda, 0, width);
            const my = p.map(pt.y, 0, 1, 0, -1 * height);

            p.point(mx, my);
        });

        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
