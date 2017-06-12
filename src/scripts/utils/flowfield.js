import math from 'mathjs';
import { fromPolar } from './vector.js';
import { constrain, map, pnoise } from './utils.js';

class FlowField {
    constructor(width, height, resolution, styles = {}) {
        this.cols = Math.floor(width / resolution);
        this.rows = Math.floor(height / resolution);
        this.resolution = resolution;
        this.styles = Object.assign(
            {},
            {
                stroke: 'rgba(255, 255, 255, 0.2)',
                strokeWeight: 1
            },
            styles
        );

        this.field = new Array(this.cols * this.rows);
    }

    generateField() {
        for (let y = 0; y <= this.rows; y += 1) {
            for (let x = 0; x <= this.cols; x += 1) {
                const index = x + y * this.rows;
                this.field[index] = fromPolar(Math.PI / 4, 1);
            }
        }
    }

    lookup(l) {
        const x = Math.floor(
            constrain(l.x / this.resolution, 0, this.cols - 1)
        );
        const y = Math.floor(
            constrain(l.y / this.resolution, 0, this.rows - 1)
        );
        return this.field[x + y * this.rows];
    }

    draw(p) {
        const styles = this.styles;
        for (let y = 0; y <= this.rows; y += 1) {
            for (let x = 0; x <= this.cols; x += 1) {
                const index = x + y * this.rows;
                const v = this.field[index];

                p.push();
                p.stroke(styles.stroke);
                p.strokeWeight(styles.strokeWeight);
                p.translate(x * this.resolution, y * this.resolution);
                p.rotate(v.angle());
                p.line(0, 0, this.resolution, 0);
                p.pop();
            }
        }
    }
}

export default FlowField;

export const angleField = (width, height, resolution, angle, styles = {}) => {
    const ff = new FlowField(width, height, resolution, styles);

    for (let y = 0; y <= ff.rows; y += 1) {
        for (let x = 0; x <= ff.cols; x += 1) {
            const index = x + y * ff.rows;
            ff.field[index] = fromPolar(angle, 1);
        }
    }
    return ff;
};

export const randomField = (width, height, resolution, styles = {}) => {
    const ff = new FlowField(width, height, resolution, styles);

    for (let y = 0; y <= ff.rows; y += 1) {
        for (let x = 0; x <= ff.cols; x += 1) {
            const index = x + y * ff.rows;
            ff.field[index] = fromPolar(math.random(2 * Math.PI), 1);
        }
    }
    return ff;
};

export const perlinField = (
    width,
    height,
    resolution,
    xinc = 0.008,
    yinc = 0.009,
    styles = {}
) => {
    const ff = new FlowField(width, height, resolution, styles);

    let yoff = 0.0;
    for (let y = 0; y <= ff.rows; y += 1) {
        let xoff = 0.0;
        for (let x = 0; x <= ff.cols; x += 1) {
            const index = x + y * ff.rows;
            const angle = map(pnoise(xoff, yoff), 0, 1, 0, 2 * Math.PI);
            ff.field[index] = fromPolar(angle, 1);

            xoff += xinc;
        }
        yoff += yinc;
    }
    return ff;
};
