import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { INTERNAL } from './actions/internal';
import { Action, libId, PostMessageData, PostMessageEvent } from './models';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Communicator {
  private coordinator: Window = window.top;
  private messages$: Observable<PostMessageEvent> = fromEvent(window, 'message').pipe(
    onlyValidMessages(),
    onlyOfChannel(this.channelId),
  );
  actions$: Observable<Action> = new Subject();
  history: Action[] = [];

  constructor(private channelId: string, private instanceName: string) {
    this.listen();
    this.connect();
  }

  private connect(): void {
    this.coordinator.postMessage(this.createMessage({ type: INTERNAL.connect }), '*');
  }

  private listen(): void {
    // this.messages$
    //   .pipe(
    //     onlyPrivate(),
    //     ofType(INTERNAL.connected),
    //     take(1),
    //   )
    //   .subscribe(event => {
    //     return console.log(this.instanceName, event.data.action);
    //   });
    //
    // this.messages$
    //   .pipe(
    //     onlyPublic(),
    //     mapAction(),
    //   )
    //   .subscribe((action: Action) => {
    //     (this.actions as Subject<Action>).next(action);
    //   });

    const a = this.messages$.pipe(
      onlyPrivate(),
      ofType(INTERNAL.connected),
      take(1),
      tap(event => (this.history = event.data.action.history)),
      tap(event => console.log(this.instanceName, event.data.action)),
      map(() => null),
    );

    const b = this.messages$.pipe(
      onlyPublic(),
      mapAction(),
    );

    const c = merge(a, b).pipe(
      filter(event => !!event),
      tap(console.log),
      tap(action => this.history.push(action)), // TODO: sorting
      mergeMap(() => of(this.history)),
    );

    this.actions$ = c;
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
