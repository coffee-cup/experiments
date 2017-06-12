import math from 'mathjs';

export class Trainer {
    constructor(x, y, a) {
        this.inputs = [x, y, 1];
        this.answer = a;
    }
}

class Perceptron {
    constructor(n) {
        this.weights = new Array(n);
        for (let i = 0; i < n; i += 1) {
            this.weights[i] = math.random(-1, 1);
        }
    }

    feedForward(inputs) {
        const sum = inputs.reduce(
            (acc, val, idx) => acc + val * this.weights[idx],
            0
        );
        return this.activate(sum);
    }

    activate(sum) {
        return sum < 0 ? -1 : 1;
    }

    train(inputs, desired, lc = 0.1) {
        const guess = this.feedForward(inputs);
        const error = desired - guess;
        this.weights = this.weights.map((w, i) => w + lc * error * inputs[i]);
    }
}

export default Perceptron;
