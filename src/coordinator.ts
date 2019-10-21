import { fromEvent } from 'rxjs';
import { INTERNAL } from './actions/internal';
import { Action, libId, PostMessageData } from './models';
import { ofType } from './rxjs/of-type';
import { onlyExternal } from './rxjs/only-external';
import { onlyPrivate } from './rxjs/only-private';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Coordinator {
  private connections = new Set<Window>();
  private history: Action[] = [];

  constructor() {
    this.connections.add(window);
    this.listen();
  }

  private listen(): void {
    const messages = fromEvent(window, 'message').pipe(
      onlyValidMessages(),
      onlyPrivate(),
    );

    messages.pipe(ofType(INTERNAL.connect)).subscribe(event => {
      const connection = event.source as Window;

      this.connections.add(connection);

      console.log('coordinator', event.data.action);

      connection.postMessage(
        this.createMessage(
          { type: INTERNAL.connected, history: this.history },
          event.data.channelId,
          true,
        ),
        '*',
      );
    });

    messages.pipe(onlyExternal()).subscribe(event => {
      this.history.push(event.data.action);
      this.broadcast(event.data.action, event.data.channelId);
    });
  }

  private broadcast<T>(action: Action<T>, channelId: string): void {
    this.connections.forEach(connection => {
      connection.postMessage({ action, channelId, libId }, '*');
    });
  }

  private createMessage<T>(
    action: Action<T>,
    channelId: string,
    isPrivate: boolean,
  ): PostMessageData<T> {
    return {
      action: {
        ...action,
        timestamp: new Date().getTime(),
      },
      private: isPrivate,
      channelId,
      libId,
    };
  }
}
