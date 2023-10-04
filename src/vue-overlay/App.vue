<script lang="ts" setup>
import { AppController } from '../AppController';

function publishEvent(name: string) {
  AppController.publish(name);
}
</script>

<template>
  <aside id="wrapper">
    <button @click="() => publishEvent('generate')">Generate land</button>
  </aside>
  <div id="credits">
    <h2>Dome</h2>
    <span>by <a href="https://marcek.dev" target="_blank">marcek</a></span>
  </div>
</template>

<style>
@import './style.css';
</style>
