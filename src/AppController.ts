export abstract class AppController {
  static events: Map<string, ((...args: any[]) => void)[]> = new Map();
  public static on(eventName: string, toCall: () => void) {
    const prev = this.events.get(eventName);
    if (prev != null) {
      this.events.set(eventName, [...prev, toCall]);
    } else {
      this.events.set(eventName, [toCall]);
    }
    console.log(this.events);
  }

  public static publish(eventName: string, ...args: any[]) {
    const events = this.events.get(eventName);
    if (events == null) return;

    for (const event of events) {
      event(...args);
    }
  }
}
