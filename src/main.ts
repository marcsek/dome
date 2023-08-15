import { Dome } from './Dome';

const generateButton: HTMLButtonElement = document.getElementById('generate') as HTMLButtonElement;

const start = performance.now();

const app = new Dome(document.body);
await app.setup();

generateButton.onclick = () => app.regenerateWorld();

const end = performance.now();
console.log(`setup done in ${end - start} ms`);

app.isPlaying = true;
