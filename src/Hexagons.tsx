import { useEffect, useRef } from 'react';
import './Hexagons.css';

export const Hexagons = () => {

  const canvas = useRef(null);
  let opts = {
    len: 20,
    count: 50,
    baseTime: 10,
    addedTime: 10,
    dieChance: .05,
    spawnChance: 1,
    sparkChance: .1,
    sparkDist: 10,
    sparkSize: 2,

    color: 'hsl(hue,100%,light%)',
    baseLight: 50,
    addedLight: 10, // [50-10,50+10]
    shadowToTimePropMult: 6,
    baseLightInputMultiplier: .01,
    addedLightInputMultiplier: .02,

    cx: 0,
    cy: 0,
    repaintAlpha: .03,
    hueChange: .1
  };


  useEffect(() => {

    const c = canvas.current as unknown as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = c.getContext('2d')!;

    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;

    let tick = 0,
      lines: Line[] = [],
      dieX = w / 2 / opts.len,
      dieY = h / 2 / opts.len;

    opts.cx = w / 2;
    opts.cy = h / 2;

    window.addEventListener('resize', function () {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;

      opts.cx = w / 2;
      opts.cy = h / 2;

      dieX = w / 2 / opts.len;
      dieY = h / 2 / opts.len;

      // if (ctx) {
      //   ctx.fillStyle = 'black';
      //   ctx.fillRect(0, 0, w, h);
      // }
    });

    if (c || ctx) {
      opts.cx = w / 2;
      opts.cy = h / 2;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, w, h);

      function loop() {

        window.requestAnimationFrame(loop);

        ++tick;

        if (ctx) {

          ctx.save();
          ctx.restore();

          ctx.globalCompositeOperation = 'source-over';
          ctx.shadowBlur = .3;
          ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
          ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'lighter';
        }

        if (lines.length < opts.count && Math.random() < opts.spawnChance) {
          lines.push(new Line(ctx, dieX, dieY));
        }
        lines.forEach(line => line.step(tick));
      }

      window.requestAnimationFrame(loop);
    }
  }, []);

  class Line {
    ctx: CanvasRenderingContext2D;
    dieX: number;
    dieY: number;

    x: number = 0;
    y: number = 0;
    addedX: number = 0;
    addedY: number = 0;
    rad: number = 0;
    lightInputMultiplier: number = 0;
    color: string;
    cumulativeTime: number;
    time: number = 0;
    targetTime: number = 0;

    baseRad = Math.PI * 2 / 6;

    constructor(ctx: CanvasRenderingContext2D, dieX: number, dieY: number) {
      this.ctx = ctx;
      this.dieX = dieX;
      this.dieY = dieY;
      this.rad = 0;

      this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();

      this.color = opts.color;
      this.cumulativeTime = 0;

      this.time = 0;
      this.targetTime = 0;

      this.reset();
    }

    reset() {
      this.x = 0;
      this.y = 0;
      this.addedX = 0;
      this.addedY = 0;

      this.rad = 0;
      this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
      this.cumulativeTime = 0;

      this.beginPhase();
    }

    shouldReset() {
      return Math.random() < opts.dieChance
        || this.x > this.dieX
        || this.x < -this.dieX
        || this.y > this.dieY
        || this.y < -this.dieY;
    }

    beginPhase() {

      this.x += this.addedX;
      this.y += this.addedY;

      this.time = 0;
      this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;

      this.rad += this.baseRad * (Math.random() < .5 ? 1 : -1);
      this.addedX = Math.cos(this.rad);
      this.addedY = Math.sin(this.rad);

      if (this.shouldReset()) {
        this.reset();
      }
    }

    step(tick: number) {
      ++this.time;
      ++this.cumulativeTime;

      if (this.time >= this.targetTime)
        this.beginPhase();

      var prop = this.time / this.targetTime,
        wave = Math.sin(prop * Math.PI / 2),
        x = this.addedX * wave,
        y = this.addedY * wave;

      this.color = opts.color.replace('hue', (tick * opts.hueChange).toString());

      let ctx = this.ctx;
      if (ctx) {
        ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        ctx.fillStyle = ctx.shadowColor = this.color.replace('light', (opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier)).toString());
        ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2);

        if (Math.random() < opts.sparkChance)
          ctx.fillRect(opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, opts.sparkSize, opts.sparkSize)
      }
    }
  }

  return (
    <canvas ref={canvas}></canvas>
  );
}