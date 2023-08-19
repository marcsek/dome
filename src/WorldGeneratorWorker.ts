export class WorldGeneratorWorker {
  worker: Worker;

  constructor() {
    this.worker = new Worker('/src/workerScripts/worldLoader.ts', { type: 'module' });
  }

  generate(callback: (data: any) => void) {
    this.worker.postMessage('cau');

    this.worker.onmessage = e => {
      callback(e.data);
    };
  }
}
