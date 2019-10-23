import { fromEvent, merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';
import { Action } from './utils/action';
import { INTERNAL_TYPES, LIB_ID } from './utils/constants';
import { PostQuecastOptions } from './utils/options';
import { PostMessageEvent } from './utils/post-message-event';

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
      ofType(INTERNAL_TYPES.connected),
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
        action: { type: INTERNAL_TYPES.connect, timestamp: new Date().getTime() },
        channelId: this.options.channelId,
        private: true,
        libId: LIB_ID,
      },
      '*',
    );
  }
}
