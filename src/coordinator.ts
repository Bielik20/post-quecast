import { fromEvent } from 'rxjs';
import { filterChannel } from './rxjs/filter-channel';

export class Coordinator {
  private connections = new Set<Window>();
  private history: any[] = [];

  constructor(private channelId: string) {
    this.connections.add(window);
    this.listen();
  }

  connect(): void {
    window.top.postMessage({ type: 'connect' }, '*');
  }

  listen(): void {
    const messages = fromEvent(window, 'message');

    messages.pipe(filterChannel(this.channelId)).subscribe((event: any) => {
      console.log('coordinator', event);
      if (event.data.type === 'connect') {
        const connection = event.source as Window;

        this.connections.add(connection);
        this.history.push(event.data);

        connection.postMessage(
          { type: 'connected', history: this.history, connections: this.connections },
          '*',
        );
      }
    });

    // window.addEventListener(
    //   'message',
    //   event => {
    //     console.log(this.instanceName, event);
    //     if (event.data.type === 'connect') {
    //       const connection = event.source as Window;
    //
    //       this.connections.add(connection);
    //       this.history.push(event.data);
    //
    //       connection.postMessage(
    //         { type: 'connected', history: this.history, connections: this.connections },
    //         '*',
    //       );
    //     }
    //   },
    //   false,
    // );
  }
}
