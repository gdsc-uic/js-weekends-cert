<template>
  <div v-if="$store.state.isPageLoading" class="page-loading-bg">
    <LoadingSpinner />
  </div>
  <div class="page-content">
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in" :name="route.meta.transition || ''" :duration="{ leave: 300, enter: 1000 }">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <Background style="position: absolute;" />
</template>

<script>
import { RouterView } from 'vue-router';
import Background from './components/Background.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';

export default {
  components: {
    RouterView,
    LoadingSpinner,
    Background
  },
  beforeCreate() {
    if (this.$route.path != '/confirm') {
      this.$store.dispatch('getCurrentUser')
        .then(() => {});
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400&Quicksand:wght@400;600;700&display=swap');
@import "normalize.css";

html, 
body, #app {
  height: 100%;
  overflow-x: hidden;
}

body {
  color: #f8f8f2;
  background: #282a36;
}

#app {
  font-family: "Quicksand", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

.page-loading-bg {
  z-index: 999;
  background: rgba(40, 42, 54, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.page-content {
  position: relative;
}

/* Buttons */

.button {
  cursor: pointer;
  padding: 0.8rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  border: 0;
}

a.button {
  text-decoration: none;
  text-align: center;
}

.button.is-primary {
  background-color: #ec64b1;
  background-image: linear-gradient(#ec64b1, #ce4191);
  color: #fff;
  border: 1px solid #cc4692;
}

.button.is-secondary {
  color: #fff;
  background-color: #47ee71;
  background-image: linear-gradient(#40df67, #23bb49);
}

.button.is-secondary:hover,
.button.is-secondary:focus {
  background: #23bb49;
}

.button.is-primary:hover,
.button.is-primary:focus {
  background: #cc4692;
}

.button.is-danger {
  background-color: #ff5555;
  background-image: linear-gradient(#ff5555, #c72d2d);
  color: #fff;
  border: 1px solid #b41e1e;
}

.button.is-danger:hover,
.button.is-danger:focus {
  background: #b41e1e;
}

/* Fade Transition */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
