import { Dome } from './Dome';
import { createApp } from 'vue';
import VueOverlay from './vue-overlay/App.vue';
import { AppController } from './AppController';

(async () => {
  createApp(VueOverlay).mount('#vue-overlay');

  const start = performance.now();

  const app = new Dome(document.body);
  await app.setup();

  AppController.on('generate', () => app.regenerateWorld());

  const end = performance.now();
  console.log(`setup done in ${end - start} ms`);

  app.isPlaying = true;
})();
