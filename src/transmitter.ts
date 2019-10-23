import { Action } from './utils/action';
import { LIB_ID } from './utils/constants';
import { DEFAULT_OPTIONS, PostQuecastOptions } from './utils/options';

export class Transmitter {
  private options: PostQuecastOptions;

  constructor(options: Partial<PostQuecastOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
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
        libId: LIB_ID,
      },
      '*',
    );
  }
}
