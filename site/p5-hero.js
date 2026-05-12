(() => {
  const mount = document.getElementById('p5-hero-canvas');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!mount || typeof window.p5 === 'undefined' || motionQuery.matches) return;
  window.p5.disableFriendlyErrors = true;

  const sketch = (p) => {
    const bubbles = [];
    const palette = [
      { h: 156, s: 76, b: 82 },
      { h: 188, s: 86, b: 95 },
      { h: 218, s: 82, b: 92 },
      { h: 172, s: 62, b: 88 },
    ];
    const pointer = { x: 0, y: 0, active: false };
    let w = 0;
    let h = 0;
    let seed = 904;

    p.setup = () => {
      const rect = mount.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(320, rect.height);
      const canvas = p.createCanvas(w, h);
      canvas.parent(mount);
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5));
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.randomSeed(seed);
      p.noiseSeed(seed);
      buildBubbles();
    };

    p.draw = () => {
      p.clear();
      drawAmbientGlow();

      p.blendMode(p.SCREEN);
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });
      drawConnections();
      p.blendMode(p.BLEND);
    };

    p.windowResized = () => {
      const rect = mount.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(320, rect.height);
      p.resizeCanvas(w, h);
      buildBubbles();
    };

    function buildBubbles() {
      bubbles.length = 0;
      const count = Math.floor(p.map(w, 320, 1600, 12, 26, true));

      for (let i = 0; i < count; i += 1) {
        bubbles.push(new Bubble({
          x: p.random(w),
          y: p.random(h),
          r: p.random(w < 560 ? 18 : 26, w < 560 ? 58 : 96),
          speed: p.random(0.06, 0.24),
          drift: p.random(0.12, 0.54),
          phase: p.random(1000),
          color: palette[Math.floor(p.random(palette.length))],
          nodes: p.random() > 0.45,
        }));
      }
    }

    function drawAmbientGlow() {
      p.noStroke();
      for (let i = 0; i < 4; i += 1) {
        const x = w * (0.18 + i * 0.22) + p.sin(p.frameCount * 0.0025 + i) * 18;
        const y = h * (0.25 + (i % 2) * 0.38) + p.cos(p.frameCount * 0.002 + i) * 14;
        const hue = i % 2 === 0 ? 156 : 210;
        p.fill(hue, 60, 64, 1.8);
        p.circle(x, y, Math.min(w, h) * 0.42);
      }
    }

    function drawConnections() {
      p.strokeWeight(0.55);
      for (let i = 0; i < bubbles.length; i += 1) {
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const a = bubbles[i];
          const b = bubbles[j];
          const d = p.dist(a.x, a.y, b.x, b.y);
          if (d > 130 || !a.nodes || !b.nodes) continue;
          const alpha = p.map(d, 30, 130, 5, 0, true);
          p.stroke(174, 70, 95, alpha);
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }

    class Bubble {
      constructor(config) {
        Object.assign(this, config);
        this.baseR = this.r;
        this.nodeCount = Math.floor(p.random(3, 7));
        this.nodeSeed = p.random(1000);
      }

      update() {
        const time = p.frameCount * 0.005;
        this.y -= this.speed;
        this.x += p.sin(time * this.drift + this.phase) * 0.14;
        this.r = this.baseR * (0.97 + p.noise(this.phase, time * 0.25) * 0.06);

        if (pointer.active) {
          const d = p.dist(this.x, this.y, pointer.x, pointer.y);
          if (d < 180) {
            const force = p.map(d, 0, 180, 0.75, 0, true);
            const angle = p.atan2(this.y - pointer.y, this.x - pointer.x);
            this.x += p.cos(angle) * force;
            this.y += p.sin(angle) * force;
            this.r += force * 1.2;
          }
        }

        if (this.y < -this.r - 40) {
          this.y = h + this.r + p.random(30, 120);
          this.x = p.random(w);
        }
      }

      draw() {
        const shine = p.map(this.r, 18, 118, 4, 10, true);

        p.noStroke();
        p.fill(this.color.h, this.color.s, this.color.b, 3);
        p.circle(this.x, this.y, this.r * 2.35);

        p.stroke(this.color.h, this.color.s * 0.72, 92, 11);
        p.strokeWeight(0.8);
        p.fill(this.color.h, this.color.s, this.color.b, 2.8);
        p.circle(this.x, this.y, this.r * 2);

        p.noStroke();
        p.fill(190, 28, 100, shine);
        p.circle(this.x - this.r * 0.32, this.y - this.r * 0.34, this.r * 0.42);

        if (this.nodes && this.r > 34) this.drawNodes();
      }

      drawNodes() {
        const points = [];
        const time = p.frameCount * 0.005;
        for (let i = 0; i < this.nodeCount; i += 1) {
          const angle = (p.TWO_PI / this.nodeCount) * i + p.noise(this.nodeSeed + i, time) * 0.9;
          const radius = this.r * p.map(p.noise(this.nodeSeed, i * 0.5), 0, 1, 0.18, 0.58);
          points.push({
            x: this.x + p.cos(angle) * radius,
            y: this.y + p.sin(angle) * radius,
          });
        }

        p.stroke(184, 58, 96, 13);
        p.strokeWeight(0.55);
        for (let i = 0; i < points.length - 1; i += 1) {
          p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        p.noStroke();
        p.fill(184, 64, 96, 18);
        points.forEach((point) => p.circle(point.x, point.y, Math.max(3, this.r * 0.08)));
      }
    }

    window.addEventListener('pointermove', (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      pointer.active = false;
    });
  };

  new window.p5(sketch);
})();
