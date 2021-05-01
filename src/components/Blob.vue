<template>
  <canvas :id="id"></canvas>
</template>

<script>
import { bezierSkin } from '../utils/blob';

const HALF_PI = Math.PI / 2;
const bumpRadius = 100;
const halfBumpRadius = bumpRadius / 2;

export default {
  emits: ['fill'],
  props: {
    id: {
      type: String,
      default: 'blob'
    },
    scaleX: {
      type: Number,
      default: 1
    },
    scaleY: {
      type: Number,
      default: 1
    },
    translateX: {
      type: Number,
      default: 0
    },
    translateY: {
      type: Number,
      default: 0
    },
    radius: {
      type: Number,
      default: 500
    },
    segments: {
      type: Number,
      default: 8
    }
  },
  created() {
    window.addEventListener('resize', this.paint);
  },
  unmounted() {
    window.removeEventListener('resize', this.paint);
  },
  mounted() {
    this.canvas = document.getElementById(this.id);
    this.c = this.canvas.getContext("2d");
    this.paint();
    this.loop();
  },
  data() {
    return {
      hasFill: false,

      wobbleIncrement: 0,
      anchors: [],
      radii: [],
      thetaOff: [],
      
      theta: 0,
      thetaRamp: 0,
      thetaRampDest: 12,
      rampDamp: 50,
    };
  },
  computed: {
    step() {
      return HALF_PI / this.segments;
    }
  },
  methods: {
    paint() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      

      for (let i = 0; i < this.segments + 2; i++) {
        this.anchors.push(0, 0);
        this.radii.push(Math.random() * bumpRadius - halfBumpRadius);
        this.thetaOff.push(Math.random() * 2 * Math.PI);
      }

      // make background fill
      const bgCanvas = document.createElement('canvas');
      const bgCtx = bgCanvas.getContext('2d');
      this.$emit('fill', bgCanvas, bgCtx, this.c);
      this.hasFill = true;
    },
    loop() {
      this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.update();
      window.requestAnimationFrame(this.loop);
    },
    update() {
      this.thetaRamp += (this.thetaRampDest - this.thetaRamp) / this.rampDamp;
      this.theta += 0.03;

      this.anchors = [0, this.radius];
      for (let i = 0; i <= this.segments + 2; i++) {
        const sine = Math.sin(this.thetaOff[i] + this.theta + this.thetaRamp);
        const rad = this.radius + this.radii[i] * sine;
        const x = rad * Math.sin(this.step * i);
        const y = rad * Math.cos(this.step * i);
        this.anchors.push(x, y);
      }

      this.c.save();
      this.c.translate(this.translateX, this.translateY);
      this.c.scale(this.scaleX, this.scaleY);
      // this.c.scale(1, 1);
      this.c.beginPath();
      this.c.moveTo(0, 0);
      bezierSkin(this.c, this.anchors, false);
      
      if (!this.hasFill) {
        this.c.fillStyle = '#282a36';
      }

      this.c.lineTo(0, 0);
      this.c.fill();
      this.c.restore();
    }
  }
}
</script>