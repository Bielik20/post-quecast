import { Action, libId } from './models';
import { defaultOptions, PostQuecastOptions } from './options';

export class Transmitter {
  protected coordinator: Window = window.top;
  protected options: PostQuecastOptions;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  emit<T>(action: Action<T>): void {
    this.coordinator.postMessage(
      {
        action: {
          ...action,
          timestamp: new Date().getTime(),
        },
        channelId: this.options.channelId,
        private: true,
        libId,
      },
      '*',
    );
  }
}
