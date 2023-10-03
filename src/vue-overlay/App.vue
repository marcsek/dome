<script lang="ts" setup>
import { AppController } from '../AppController';

function publishEvent(name: string) {
  AppController.publish(name);
}
</script>

<template>
  <aside id="wrapper">
    <h1>Dome</h1>
    <button @click="() => publishEvent('generate')">Generate land</button>
  </aside>
</template>

<style>
@import './style.css';
</style>
