<template>
  <div class="bg">
    <div class="blobs">
      <div class="blob-1-fallback"></div>
      <div class="blob-2-fallback"></div>
      <Blob
        id="blob-1"
        class="blob-1"
        :image-scale-y="-1"
        :scale-x="0.6"
        :scale-y="-0.8"
        :translate-y="screenHeight"
        @fill="bottomLeftWaveFill"
      />
      <Blob
        id="blob-2"
        class="blob-2"
        :scale-x="-0.6"
        :scale-y="0.8"
        :translate-x="screenWidth"
        @fill="topRightWaveFill"
      />
    </div>
  </div>
</template>

<script>
import Blob from '../components/Blob.vue';
import topRightWaveImageUrl from '../assets/top_right_wave_bg.png';
import bottomLeftWaveImgUrl from '../assets/bottom_left_wave.png';

export default {
  components: {
    Blob
  },
  created() {
    window.addEventListener('resize', this.setWidths);
  },
  unmounted() {
    window.removeEventListener('resize', this.setWidths);
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    }
  },
  methods: {
    setWidths() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    },
    bottomLeftWaveFill(bgCanvas, bgCtx, ctx) {
      const fillImg = new Image();
      fillImg.src = bottomLeftWaveImgUrl;
      fillImg.onload = () => {
        bgCanvas.width = fillImg.width; 
        bgCanvas.height = fillImg.height;
        bgCtx.save();
        bgCtx.scale(1, -1);
        bgCtx.drawImage(fillImg, 0, -fillImg.height, fillImg.width * 1.25, fillImg.height * 1);
        bgCtx.restore();

        const pattern = ctx.createPattern(bgCanvas, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fill();
      }
    },
    topRightWaveFill(bgCanvas, bgCtx, ctx) {
      const fillImg = new Image();
      fillImg.src = topRightWaveImageUrl;
      fillImg.onload = () => {
        bgCanvas.width = fillImg.width; 
        bgCanvas.height = fillImg.height;
        bgCtx.save();
        bgCtx.scale(-1, 1);
        bgCtx.drawImage(fillImg, -fillImg.width, 0, fillImg.width * 1.25, fillImg.height * 1);
        bgCtx.restore();

        const pattern = ctx.createPattern(bgCanvas, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fill();
      }
    }
  }
}
</script>

<style scoped>
.bg {
  z-index: -1;
  top: 0; 
  left:0; 
  height: 100vh; 
  width: 100vw;
}

.blobs {
  position: relative;
  height: 100%;
}

.blob-1,
.blob-2,
.blob-1-fallback,
.blob-2-fallback {
  position: absolute;
}

.blob-1,
.blob-2 {
  top: 0;
  display: none;
}

.blob-1,
.blob-1-fallback {
  left: 0;
}

.blob-2,
.blob-2-fallback {
  right: 0;
}

.blob-1-fallback,
.blob-2-fallback {
  height: 100vh;
  width: 100vw;
}

.blob-1-fallback {
  bottom: 0;
  background: url(../assets/bottom_left_wave_fallback.png) no-repeat;
  background-position: bottom left;

}

.blob-2-fallback {
  top: 0;
  background: url(../assets/top_right_wave_fallback.png) no-repeat;
  background-position: top right;
}

@media screen and (min-width: 1280px) {
  .blob-1-fallback,
  .blob-2-fallback {
    display: none;
  }

  .blob-1,
  .blob-2 {
    display: block;
  }
}
</style>