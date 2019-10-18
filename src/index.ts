export function printHello(): void {
  console.log('hello from lib');
}

export class Communicator {
  private connections = new Set<Window>();
  private history: any[] = [];

  constructor(private instanceName: string) {
    this.connections.add(window);
    this.listen();
  }

  connect(): void {
    window.top.postMessage({ type: 'connect' }, '*');
  }

  listen(): void {
    window.addEventListener(
      'message',
      event => {
        console.log(this.instanceName, event);
        if (event.data.type === 'connect') {
          const connection = event.source as Window;

          this.connections.add(connection);
          this.history.push(event.data);

          connection.postMessage(
            { type: 'connected', history: this.history, connections: this.connections },
            '*',
          );
        }
      },
      false,
    );
  }
}
