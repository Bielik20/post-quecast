import { fromEvent, merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take, tap } from 'rxjs/operators';
import { INTERNAL } from './actions/internal';
import { Action, libId, PostMessageData, PostMessageEvent } from './models';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Communicator {
  actions$: Observable<Action>;
  private coordinator: Window = window.top;

  constructor(private channelId: string, private instanceName: string) {
    this.setupActions();
    this.setupConnection();
  }

  private setupActions(): void {
    const messages$: Observable<PostMessageEvent> = fromEvent(window, 'message').pipe(
      onlyValidMessages(),
      onlyOfChannel(this.channelId),
    );

    const history$ = messages$.pipe(
      onlyPrivate(),
      ofType(INTERNAL.connected),
      take(1),
      mapAction(),
      tap(action => console.log(this.instanceName, action)),
      mergeMap(action => of(...action.history)),
    );

    const public$ = messages$.pipe(
      onlyPublic(),
      mapAction(),
    );

    this.actions$ = merge(history$, public$).pipe(shareReplay());
  }

  private setupConnection(): void {
    this.coordinator.postMessage(this.createMessage({ type: INTERNAL.connect }), '*');
  }

  emit<T>(action: Action<T>): void {
    this.coordinator.postMessage(this.createMessage(action), '*');
  }

  private createMessage<T>(action: Action<T>): PostMessageData<T> {
    return {
      action: {
        ...action,
        timestamp: new Date().getTime(),
      },
      channelId: this.channelId,
      private: true,
      libId,
    };
  }
}
