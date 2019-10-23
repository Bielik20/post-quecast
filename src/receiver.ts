import { fromEvent, merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import { INTERNAL } from './actions';
import { Action, libId, PostMessageEvent } from './models';
import { PostQuecastOptions } from './options';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Receiver {
  actions$: Observable<Action>;

  constructor(private options: PostQuecastOptions) {
    this.setupActions();
    this.setupConnection();
  }

  private setupActions(): void {
    const messages$: Observable<PostMessageEvent> = fromEvent(window, 'message').pipe(
      onlyValidMessages(),
      onlyOfChannel(this.options.channelId),
    );

    const history$ = messages$.pipe(
      onlyPrivate(),
      mapAction(),
      ofType(INTERNAL.connected),
      take(1),
      mergeMap(action => of(...action.history)),
    );

    const public$ = messages$.pipe(
      onlyPublic(),
      mapAction(),
    );

    this.actions$ = merge(history$, public$).pipe(shareReplay());
  }

  private setupConnection(): void {
    const coordinator = window.top;

    coordinator.postMessage(
      {
        action: { type: INTERNAL.connect, timestamp: new Date().getTime() },
        channelId: this.options.channelId,
        private: true,
        libId,
      },
      '*',
    );
  }
}
