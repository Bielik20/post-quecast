import { fromEvent, merge, Observable, of } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import { INTERNAL } from './actions/internal';
import { Action, PostMessageEvent } from './models';
import { mapAction } from './rxjs/map-action';
import { ofType } from './rxjs/of-type';
import { onlyOfChannel } from './rxjs/only-of-channel';
import { onlyPrivate } from './rxjs/only-private';
import { onlyPublic } from './rxjs/only-public';
import { onlyValidMessages } from './rxjs/only-valid-messages';
import { defaultTransmitterOptions, Transmitter, TransmitterOptions } from './transmitter';

// tslint:disable-next-line:no-empty-interface
export interface CommunicatorOptions extends TransmitterOptions {}

export const defaultCommunicatorOptions: CommunicatorOptions = {
  ...defaultTransmitterOptions,
};

export class Communicator extends Transmitter {
  actions$: Observable<Action>;
  protected options: CommunicatorOptions;

  constructor(options: Partial<CommunicatorOptions> = {}) {
    super(options);
    this.options = {
      ...defaultCommunicatorOptions,
      ...options,
    };
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
    this.coordinator.postMessage(this.createMessage({ type: INTERNAL.connect }), '*');
  }
}
