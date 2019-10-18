import { fromEvent } from 'rxjs';
import { filterChannel } from './rxjs/filter-channel';

export class Communicator {
  constructor(private channelId: string, private instanceName: string) {
    this.listen();
    this.connect();
  }

  connect(): void {
    window.top.postMessage(
      { action: { type: 'connect' }, channelId: this.channelId, timestamp: new Date().getTime() },
      '*',
    );
  }

  listen(): void {
    const messages = fromEvent(window, 'message');

    messages.pipe(filterChannel(this.channelId)).subscribe((event: any) => {
      console.log(this.instanceName, event);
    });
  }
}
