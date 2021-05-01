<template>
  <section class="cert-page" v-show="!$store.state.isPageLoading">
    <h2 class="heading">Here's your certificate!</h2>
    <transition name="slide-card">
      <div
        v-show="imageHasLoaded"
        :style="certificateImgCss" class="cert"
      ></div>
    </transition>
    <div class="cert-padding"></div>
    <transition name="fade">
      <div class="actions">
        <button v-show="imageHasLoaded" class="button is-primary" @click="downloadCertImage">Download Image</button>
        <router-link to="/" class="button is-secondary">Go back</router-link>
      </div>
    </transition>
  </section>
</template>

<script>
import certImageUrl from '../assets/cert.png';
import namecase from 'namecase/namecase';

export default {
  mounted() {
    this.img.src = certImageUrl;
    this.img.addEventListener('load', this.onImgLoad, false);
    this.$store.dispatch('setAsClaimed')
      .then(() => {});
  },
  unmounted() {
    this.img.removeEventListener('load', this.onImgLoad);
  },
  data() {
    return {
      imageHasLoaded: false,
      img: new Image(),
      canvas: document.createElement('canvas'),
      certImageUrl: ''
    }
  },
  computed: {
    certificateImgSizeCss() {
      return `width: ${this.img.width * 0.25}px; height: ${(this.img.height) + 150}px;`;
    },
    certificateImgCss() {
      return `background-image: url(${this.certImageUrl});`;
    }
  },
  methods: {
    onImgLoad() {
      const ctx = this.canvas.getContext('2d');
      this.canvas.height = this.img.height; 
      this.canvas.width = this.img.width;

      ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
      const text = this.$store.state.participantInfo.name;

      // for recalculating the font size.
      const textDiff = text.length > 21 ? text.length - 21 + 5 : 0;
      const fontSize = 80 - textDiff;

      ctx.font = `700 ${fontSize}px "Quicksand"`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      // print name
      ctx.fillText(this.fixName(text), (this.canvas.width / 2) + 200, (this.canvas.height / 1.9) - 100);

      // generate download url
      this.certImageUrl = this.canvas.toDataURL('image/png');
      
      setTimeout(() => {
        this.imageHasLoaded = true;
      }, 200);
    },
    downloadCertImage() {
      const link = document.createElement('a');
      link.download = 'JSWeekends_Certificate.png';
      link.href = this.certImageUrl;
      link.click();
    },
    /**
     * @param {string} name
     */
    fixName(name) {
      // FIXME: better algo for this ;--;
      let finalName = name;
      try {
        // search for apostrophes
        let nameArr = finalName.split(',');
        const deleted = nameArr.splice(0, 1);
        if (deleted.length == 0) {
          throw new Error('Last name not found!');
        }
        nameArr = nameArr.concat(deleted[0]).map(n => n.trimLeft()).join(' ').split(' ');
        
        // fix suffixes
        const suffixRegex = /^[JSjs][rR]$/g;
        const initialsRegex = /^[A-Za-z]{1}.$/g;
        if (suffixRegex.test(nameArr[nameArr.length - 1])) {
          nameArr[nameArr.length - 1] += '.';
        } else if (initialsRegex.test(nameArr[nameArr.length - 1])) {
          const deleted2 = nameArr.splice(0, 1);
          if (deleted2.length == 0) {
            throw new Error('Last name not found!');
          }
          nameArr = nameArr.concat(deleted2[0]);
        } else {
          const initialsRegex2 = /^[A-Za-z]{1}$/g;
          for (let i = 0; i < nameArr.length; i++) {
            if (initialsRegex2.test(nameArr[i])) {
              nameArr[i] += '.';
            }
          }
        }
        finalName = nameArr.join(' ');
        return finalName.endsWith('De Vera') ? finalName : namecase(finalName);
      } catch(e) {
        // this catch block should not do anything
        // but print harmless messages
        console.error(e);  
        return namecase(finalName);
      }
    }
  }
}
</script>

<style scoped>
.heading {
  font-family: "Syncopate", Arial, Helvetica, sans-serif;
  font-weight: 400;
  margin-bottom: 2rem;
  text-align: center;
}

@keyframes slide-card {
  0% {
    transform: rotate(-180deg) translate(-100%, 150%);
  }
  100% {
    transform: rotate(3deg) translate(0%, 0%);
  }
}

/* Use fade transition for slide-card */

.slide-card-enter-active,
.slide-card-leave-active {
  transition: opacity 0.75s ease;
}

.slide-card-enter-from,
.slide-card-leave-to {
  opacity: 0;
}

.cert-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  padding: 0 1.5rem;
}

.cert-padding {
  /* display: none; */
  padding-top: calc(141.42% / 16);
}

.cert {
  /* aspect-ratio padding hack. the ratio of a4 is 1:1.4142 */
  padding-top: calc(141.42% / 2);
  transform-origin: top left;
  margin: 0;
  border: 4px solid #fff;
  background-size: cover; 
  background-repeat: no-repeat;
  box-shadow: 0 1.5px 10px rgba(0, 0, 0, 0.6), 0 1.5px 12px rgba(0, 0, 0, 0.6);
  position: relative;
}

.actions {
  display: flex;
}

.actions .button {
  flex: 1;
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.actions .button:not(:last-child) {
  margin-right: 0.5rem;
}

@media screen and (min-width: 1024px) {
  .heading {
    font-size: 2.5rem;
  }
}

@media screen and (min-width: 1280px) {
  .cert-page {
    max-width: 900px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 2rem;
  }

  .heading {
    font-size: 3.3rem;
  }

  .slide-card-enter-active {
    overflow: hidden;
    animation-name: slide-card;
    animation-duration: 800ms;
  }

  .slide-card-leave-active {
    overflow: hidden;
    animation-name: slide-card;
    animation-duration: 600ms;
    animation-direction: reverse;
  }

  .cert-padding {
    display: block;
    padding-top: calc(141.42% / 1.8);
  }

  .cert {
    padding-top: 0;
    height: 620px;
    width: 877px;
    top: 14%;
    left: 0;
    position: absolute;
    transform: rotate(3deg) translate(0%, 0%);
  }

  .slide-card-enter-from,
  .slide-card-leave-to {
    /* noop */
  }
}
</style>