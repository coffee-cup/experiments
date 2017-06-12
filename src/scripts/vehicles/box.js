import Matter from 'matter-js';

const Bodies = Matter.Bodies;

class Box {
    constructor(x, y, w, h, options = {}) {
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;

        this.styles = {
            fill: 200,
            stroke: 255
        };
    }

    setStyles(s) {
        this.styles = Object.assign({}, this.styles, s);
    }

    addToWorld(world) {
        Matter.World.add(world, this.body);
    }

    show(p) {
        const pos = this.body.position;
        // const angle = this.body.angle;

        p.push();
        p.translate(pos.x, pos.y);
        p.stroke(this.styles.stroke);
        p.fill(this.styles.fill);
        p.rectMode(p.CENTER);
        p.rect(0, 0, this.w, this.h);
        p.pop();
    }
}

export default Box;
