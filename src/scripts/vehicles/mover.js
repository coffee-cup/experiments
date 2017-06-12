import Vector from '../utils/vector.js';
import { hexToRGB, map } from '../utils/utils.js';

class Mover {
    constructor(options) {
        const defaultOptions = {
            // Movement
            pos: new Vector(0, 0),
            vel: new Vector(0, 0),
            acc: new Vector(0, 0),
            forces: [], // These forces constantly act on object
            maxSpeed: false, // Bind velocity to this
            maxForce: false, // Bind forces applied to this
            mass: 1,

            // Life
            count: 0,
            lifespan: null, // Does this particle die after a while
            fadeAway: true, // If we have a lifespan, should the colour fade away

            // Bounds
            screenWidth: 100,
            screenHeight: 100,
            bindToScreen: false, // Do not allow position outside of screenWidth/screenHeight
            loopAround: false, // When the object has moved off the screen, place it at other end
            bounceOffScreen: false, // Reverse velocity when hitting sides of screen
            bindInside: false, // Whether we are checking if the object is inside the other

            // Drawing
            circle: false, // Show as a circle (otherwise a rectangle)
            point: false, // Circle also needs to be true to draw a point
            connectWithPrev: false, // If drawing as point, should I connect line with previous pos
            showAngle: true,
            radius: 10,
            width: 20,
            height: 20,
            showTrail: false,
            trail: [],
            trailLimit: 400,
            trailColour: 'rgba(255, 255, 0, 0.1)',
            fadeTrail: false,
            showStroke: true,
            stroke: '#5E2CA5',
            strokeWeight: 1,
            showFill: true,
            fill: '#3685B5',
            type: 'mover'
        };

        options = Object.assign({}, defaultOptions, options);
        options.prevPos = options.pos.clone();
        Object.assign(this, options);
    }

    // Update position, velocity, and acc
    update() {
        // Don't update when dead
        if (this.isDead()) {
            return;
        }

        this._applyConstantForces();

        this.vel = this.vel.add(this.acc);
        if (this.maxSpeed) {
            this.vel = this.vel.limit(this.maxSpeed);
        }

        this.prevPos = this.pos.clone();
        this.pos = this.pos.add(this.vel);

        // Reset acc for each cycle
        this.acc = this.acc.multiply(0);

        if (this.bindToScreen) {
            this._bindToScreen();
        }

        if (this.showTrail) {
            this.trail.push(this.pos.clone());
            this.trail = this.trail.splice(this.trail.length - this.trailLimit);
        }

        this.count += 1;
    }

    isDead() {
        if (!this.lifespan) {
            return false;
        }
        return this.count >= this.lifespan;
    }

    // Free this mover from darth vadar
    clearForces() {
        this.forces = [];
    }

    // Add a new constant force
    addForce(f) {
        this.forces.push(f);
    }

    // Apply the forces that are always acting on this mover
    _applyConstantForces() {
        this.forces.forEach(f => {
            let force = f;
            if (typeof f === 'function') {
                force = f(this);
            }
            if (force) this.applyForce(force);
        });
    }

    applyForce(force) {
        let f = force.divide(this.mass);
        if (this.maxForce) f = f.limit(this.maxForce);
        this.acc = this.acc.add(f);
    }

    // Check if this is colliding with another mover
    isCollidingWith(m, bindInside) {
        const bI = bindInside || this.bindInside;
        if (this.circle && m.circle) {
            return this.pos.distance(m.pos) <= this.radius + m.radius;
        }

        let selfXOff = this.circle ? this.radius * 2 : this.width / 2;
        let selfYOff = this.circle ? this.radius * 2 : this.height / 2;

        selfXOff *= bI ? -1 : 1;
        selfYOff *= bI ? -1 : 1;

        const mXOff = m.circle ? m.radius * 2 : m.width / 2;
        const mYOff = m.circle ? m.radius * 2 : m.height / 2;

        // TODO: I think this is wrong
        return this.pos.x + selfXOff > m.pos.x - mXOff &&
            this.pos.x - selfXOff < m.pos.x + mXOff &&
            this.pos.y + selfYOff > m.pos.y - mYOff &&
            this.pos.y - selfYOff < m.pos.y + mYOff;
    }

    // Some sort of detection with screen edges
    _bindToScreen() {
        let edge = 0;
        if (this.point && this.circle) {
            edge = 0;
        } else if (this.circle) {
            edge = this.radius;
        } else {
            edge = Math.sqrt(this.width + this.height);
        }

        let touchHor = false;
        let touchVer = false;

        // Bind to screen
        if (this.pos.x < edge) {
            this.pos.x = this.loopAround ? this.screenWidth - edge : edge;
            touchHor = true;
        } else if (this.pos.x > this.screenWidth - edge) {
            this.pos.x = this.loopAround ? edge : this.screenWidth - edge;
            touchHor = true;
        }
        if (this.pos.y > this.screenHeight - edge) {
            this.pos.y = this.loopAround ? edge : this.screenHeight - edge;
            touchVer = true;
        } else if (this.pos.y < edge) {
            this.pos.y = this.loopAround ? this.screenHeight - edge : edge;
            touchVer = true;
        }

        // Reset prev point if we move to other side of screen
        if (touchHor || touchVer) {
            this.prevPos = this.pos.clone();
        }

        // Reverse velocity to bounce off screen
        if (this.bounceOffScreen) {
            if (touchHor) {
                this.vel = this.vel.multiply(new Vector(-1, 1));
            }
            if (touchVer) {
                this.vel = this.vel.multiply(new Vector(1, -1));
            }
        }
    }

    /*
     * Drawing :: All p5 stuff down here
     */

    drawPoint(p) {
        if (this.connectWithPrev) {
            p.line(
                0,
                0,
                this.prevPos.x - this.pos.x,
                this.prevPos.y - this.pos.y
            );
        } else {
            p.point(0, 0);
        }
    }

    drawCircle(p) {
        p.ellipseMode(p.RADIUS);
        p.ellipse(0, 0, this.radius, this.radius);

        if (this.showAngle) {
            const angle = this.vel.angle();
            p.line(
                0,
                0,
                this.radius * Math.cos(angle),
                this.radius * Math.sin(angle)
            );
        }
    }

    drawRect(p) {
        p.rotate(this.vel.horizontalAngle());
        p.rectMode(p.CENTER);
        p.rect(0, 0, this.width, this.height);
    }

    setStrokeWithAlpha(p, c, a) {
        if (typeof c === 'string' && c.charAt(0) === '#') {
            const rgb = hexToRGB(c);
            p.stroke(rgb.r, rgb.g, rgb.b, a);
        } else {
            p.stroke(c);
        }
    }

    setFillWithAlpha(p, c, a) {
        if (typeof c === 'string' && c.charAt(0) === '#') {
            const rgb = hexToRGB(c);
            p.fill(rgb.r, rgb.g, rgb.b, a);
        } else {
            p.fill(c);
        }
    }

    getFadeAlpha() {
        return this.fadeAway && this.lifespan
            ? map(this.count, 0, this.lifespan, 255, 0)
            : 255;
    }

    draw(p) {
        p.push();
        p.translate(this.pos.x, this.pos.y);

        // Show trail first so mover is on top
        if (this.showTrail) {
            // p.fill(this.trailColour);
            // p.stroke(this.trailColour);
            this.trail.forEach((t, index) => {
                this.setFillWithAlpha(
                    p,
                    this.trailColour,
                    map(index, 0, this.trail.length, 0, 255)
                );
                this.setStrokeWithAlpha(
                    p,
                    this.trailColour,
                    map(index, 0, this.trail.length, 0, 255)
                );
                p.ellipse(t.x - this.pos.x, t.y - this.pos.y, 1, 1);
            });
        }

        // Set stroke colour
        if (this.showStroke) {
            this.setStrokeWithAlpha(p, this.stroke, this.getFadeAlpha());
            p.strokeWeight(this.strokeWeight);
        } else {
            p.noStroke();
        }

        // Set fill colour
        if (this.showFill) {
            this.setFillWithAlpha(p, this.fill, this.getFadeAlpha());
        } else {
            p.noFill();
        }

        p.angleMode(p.RADIANS);
        if (this.circle) {
            if (this.point) {
                this.drawPoint(p);
            } else {
                this.drawCircle(p);
            }
        } else {
            this.drawRect(p);
        }
        p.pop();
    }
}

export default Mover;
