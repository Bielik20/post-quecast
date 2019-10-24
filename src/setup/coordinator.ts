import { fromEvent } from 'rxjs';
import { ofEventType } from '../rxjs/of-event-type';
import { onlyExternal } from '../rxjs/only-external';
import { onlyPrivate } from '../rxjs/only-private';
import { onlyValidMessages } from '../rxjs/only-valid-messages';
import { INTERNAL_TYPES } from '../utils/constants';
import { Channel } from './channel';

export class Coordinator {
  private channels = new Map<string, Channel>();
  private messages$ = fromEvent(window, 'message').pipe(
    onlyValidMessages(),
    onlyPrivate(),
  );

  init(): void {
    this.handleConnect();
    this.handleBroadcast();
  }

  private handleConnect(): void {
    this.messages$.pipe(ofEventType(INTERNAL_TYPES.connect)).subscribe(event => {
      const channel: Channel = this.getChannel(event.data.channelId);

      channel.addConnection(event.source);
    });
  }

  private handleBroadcast(): void {
    this.messages$.pipe(onlyExternal()).subscribe(event => {
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
