class Path {
    constructor(radius, start, end) {
        this.radius = radius;
        this.start = start;
        this.end = end;
    }

    draw(p) {
        const s = this.start;
        const e = this.end;

        p.push();

        // Draw radius
        p.strokeWeight(this.radius * 2);
        p.stroke(0, 100);
        p.line(s.x, s.y, e.x, e.y);

        // Draw main part
        p.strokeWeight(1);
        p.stroke(255);
        p.line(s.x, s.y, e.x, e.y);

        p.pop();
    }
}

export default Path;
