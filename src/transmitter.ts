import { Action, libId } from './models';
import { defaultOptions, PostQuecastOptions } from './options';

export class Transmitter {
  private options: PostQuecastOptions;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  emit<T>(action: Action<T>): void {
    const coordinator = window.top;

    coordinator.postMessage(
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
