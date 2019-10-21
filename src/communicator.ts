import { Observable } from 'rxjs';
import { INTERNAL } from './actions/internal';
import { Action, libId } from './models';
import { defaultOptions, PostQuecastOptions } from './options';
import { Receiver } from './receiver';
import { Transmitter } from './transmitter';

export class Communicator {
  actions$: Observable<Action>;
  private readonly options: PostQuecastOptions;
  private transmitter: Transmitter;
  private receiver: Receiver;
  private coordinator: Window = window.top;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.transmitter = new Transmitter(this.options);
    this.receiver = new Receiver(this.options);
    this.actions$ = this.receiver.actions$;
    this.setupConnection();
  }

  emit<T>(action: Action<T>): void {
    this.transmitter.emit(action);
  }

  private setupConnection(): void {
    this.coordinator.postMessage(
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
