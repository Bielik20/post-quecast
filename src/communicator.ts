import { fromEvent, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { INTERNAL } from './actions/internal';
import { Action, libId, PostMessageData } from './models';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';

export class Communicator {
  private coordinator: Window;
  actions: Observable<Action> = new Subject();

  constructor(private channelId: string, private instanceName: string) {
    this.listen();
    this.connect();
  }

  private connect(): void {
    window.top.postMessage(this.createMessage({ type: INTERNAL.connect }), '*');
  }

  private listen(): void {
    const messages = fromEvent(window, 'message').pipe(
      onlyValidMessages(),
      onlyOfChannel(this.channelId),
    );

    messages
      .pipe(
        onlyPrivate(),
        ofType(INTERNAL.connected),
        take(1),
      )
      .subscribe(event => {
        this.coordinator = event.source;
        return console.log(this.instanceName, event.data.action);
      });

    messages
      .pipe(
        onlyPublic(),
        mapAction(),
      )
      .subscribe((action: Action) => {
        (this.actions as Subject<Action>).next(action);
      });
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
