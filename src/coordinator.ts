import { fromEvent } from 'rxjs';
import { INTERNAL } from './actions/internal';
import { Channel } from './channel';
import { ofType } from './rxjs/of-type';
import { onlyExternal } from './rxjs/only-external';
import { onlyPrivate } from './rxjs/only-private';
import { onlyValidMessages } from './rxjs/only-valid-messages';

// export function setupPostQuecast(): void {}

export class Coordinator {
  private channels = new Map<string, Channel>();

  constructor() {
    this.listen();
  }

  private listen(): void {
    const messages$ = fromEvent(window, 'message').pipe(
      onlyValidMessages(),
      onlyPrivate(),
    );

    messages$.pipe(ofType(INTERNAL.connect)).subscribe(event => {
      const channel: Channel = this.getChannel(event.data.channelId);

      channel.addConnection(event.source);
      console.log('coordinator', event.data);
    });

    messages$.pipe(onlyExternal()).subscribe(event => {
      const channel: Channel = this.getChannel(event.data.channelId);

      channel.broadcast(event.data.action);
    });
  }

  private getChannel(channelId: string): Channel {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Channel(channelId));
    }

    return this.channels.get(channelId);
  }
}
