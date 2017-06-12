import p5 from 'p5';

import Mover from './vehicles/mover.js';
import Vector from './utils/vector.js';
import math from 'mathjs';

const frameId = 'e-iframe';
const iframe = parent.document.getElementById(frameId);
const width = Math.min(iframe.offsetWidth - 4, 1200);
const height = Math.min(iframe.offsetHeight - 4, 600);

console.log(`width: ${width}`);
console.log(`height: ${height}`);

const background = '#333333';
const foreground = '#FFFFFF';

// Frame rate
const fr = 30;

// Do nothing if true
const noFrame = false;

// Time
let t = 0;

const target = new Mover({
    pos: new Vector(width / 2, 100),
    circle: true,
    showStroke: false,
    fill: '#FFBA08',
    radius: 20
});

const popSize = 50;

const walls = [];
const createWall = (x, y) => {
    return new Mover({
        pos: new Vector(x, y),
        showStroke: false,
        fill: 150,
        width: math.random(50, 500),
        height: math.random(10, 40)
    });
};

const accBounds = 0.5;
const randomAcceleration = () =>
    new Vector(
        math.random(-1 * accBounds, accBounds),
        math.random(-1 * accBounds, accBounds)
    );

class DNA {
    constructor(lifespan, genes) {
        this.lifespan = lifespan;
        this.mutationRate = 0.03;
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = [];
            for (let i = 0; i < lifespan; i += 1) {
                const a = randomAcceleration();
                this.genes[i] = a;
            }
        }
    }

    crossover(partner) {
        // Randomly combine genes from this dna and a partner
        const newgenes = [];
        const mid = math.randomInt(this.genes.length);
        for (let i = 0; i < this.genes.length; i += 1) {
            newgenes[i] = i > mid ? this.genes[i] : partner.genes[i];
        }
        return new DNA(this.lifespan, newgenes);
    }

    mutation() {
        for (let i = 0; i < this.genes.length; i += 1) {
            if (math.random(1) < this.mutationRate) {
                this.genes[i] = randomAcceleration();
            }
        }
    }
}

class Population {
    constructor(popsize, lifespan) {
        this.popsize = popsize;
        this.lifespan = lifespan;
        this.rockets = [];
        this.matingPool = [];
        this.generation = 1;
        this.count = 0;
        this.maxFit = 0;
        this.averageFit = 0;

        this.refreshPopulation();
    }

    refreshPopulation() {
        for (let i = 0; i < this.popsize; i += 1) {
            this.rockets[i] = this.createRocket();
        }
    }

    createRocket(dna) {
        const mover = new Mover({
            pos: new Vector(width / 2, height),
            circle: true,
            fill: 'rgba(127, 216, 190, 0.4)',
            radius: 5,
            finished: false,
            finishedCount: 0,
            hitWall: false,
            crashed: false,
            showTrail: true,
            trailLimit: 50,
            dna: dna || new DNA(this.lifespan),
            fitness: 0,
            calcFitness() {
                let fit = 1 / this.pos.distance(target.pos);
                if (this.finished) {
                    fit += 1 / this.finishedCount;
                }
                if (this.crashed) {
                    fit /= 100;
                }
                if (this.hitWall) {
                    fit /= 50;
                }
                this.fitness = fit;
                return this.fitness;
            },
            reachedTarget() {
                if (!this.finished) {
                    this.finished =
                        this.pos.distance(target.pos) <
                        this.radius + target.radius;
                    if (this.finished) {
                        this.finishedCount = this.count;
                    }
                }
                return this.finished;
            }
        });
        return mover;
    }

    evaluate() {
        // Calculate fitness for each rocket
        //  (how far rocket made it to target)
        let maxFit = 0;
        let sumFit = 0;
        this.rockets.forEach(f => {
            const fit = f.calcFitness();
            f.fitness = fit;
            sumFit += fit;
            if (fit > maxFit) {
                maxFit = fit;
            }
        });

        this.maxFit = maxFit;
        this.averageFit = sumFit / this.rockets.length;

        // Create mating pool with more fit rockets more in the pool
        this.matingPool = [];
        for (let i = 0; i < this.rockets.length; i += 1) {
            const n = this.rockets[i].fitness * 100 / maxFit;
            for (let j = 0; j < n; j += 1) {
                this.matingPool.push(this.rockets[i]);
            }
        }
    }

    selection() {
        // Create new rockets by crossing over dna from mating pool
        const newRockets = [];
        for (let i = 0; i < this.rockets.length; i += 1) {
            const parentA = this.matingPool[
                math.randomInt(this.matingPool.length - 1)
            ].dna;
            const parentB = this.matingPool[
                math.randomInt(this.matingPool.length - 1)
            ].dna;
            const child = parentA.crossover(parentB);
            child.mutation();
            newRockets[i] = this.createRocket(child);
        }
        this.generation += 1;
        this.count = 0;
        this.rockets = newRockets;
    }

    draw(p) {
        this.rockets.forEach(r => {
            // Don't hit walls
            walls.forEach(w => {
                const hWW = w.width / 2;
                const hWH = w.height / 2;

                // Check if rocket rashed into wall
                if (
                    r.pos.x + r.radius * 2 > w.pos.x - hWW &&
                    r.pos.x - r.radius * 2 < w.pos.x + hWW &&
                    r.pos.y + r.radius * 2 > w.pos.y - hWH &&
                    r.pos.y - r.radius * 2 < w.pos.y + hWH
                ) {
                    r.crashed = true;
                }
            });

            if (!r.reachedTarget() && !r.crashed) {
                r.applyForce(r.dna.genes[r.count]);
                r.update();

                // Bind to screen
                if (r.pos.x < r.radius) {
                    r.pos.x = r.radius;
                    r.hitWall = true;
                } else if (r.pos.x > width - r.radius) {
                    r.pos.x = width - r.radius;
                    r.hitWall = true;
                }
                if (r.pos.y > height - r.radius) {
                    r.pos.y = height - r.radius;
                    r.hitWall = true;
                } else if (r.pos.y < r.radius) {
                    r.pos.y = r.radius;
                    r.hitWall = true;
                }
            }
            r.draw(p);
        });
        this.count += 1;
    }
}

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
    };

    const population = new Population(popSize, 200);

    p.mouseClicked = () => {
        walls.push(createWall(p.mouseX, p.mouseY));
    };

    // Each frame draw
    p.draw = () => {
        p.background(background);

        // How should we be framed?
        p.translate(0, 0);

        // Do nothing
        if (noFrame) {
            return;
        }

        if (population.count >= population.lifespan) {
            population.evaluate();
            population.selection();
        }

        population.draw(p);
        target.draw(p);

        walls.forEach(w => {
            w.draw(p);
        });

        p.fill(255);
        p.textSize(22);
        p.noStroke();
        p.text(
            `gen ${population.generation} :: count ${population.count}`,
            10,
            height - 40
        );
        p.text(
            `max fit ${(population.maxFit * 100).toFixed(
                3
            )} :: avg fit ${(population.averageFit * 100).toFixed(3)}`,
            10,
            height - 10
        );

        // Time goes on...
        t = t + 1;
    };
};

// eslint-disable-next-line no-new, no-undef
new p5(sketch);
