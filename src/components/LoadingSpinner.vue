<template>
  <div class="loading-spinner"></div>
</template>

<script>
export default {

}
</script>

<style scoped>
@keyframes rotate-forever {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-name: rotate-forever;
  animation-timing-function: linear;
  height: 40px;
  width: 40px;
  border-width: 7px;
  border-style: solid;
  border-color: rgb(200, 200, 200);
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
}
</style>