import { Action, libId, PostMessageData } from './models';

export interface TransmitterOptions {
  channelId: string;
}

export const defaultTransmitterOptions: TransmitterOptions = {
  channelId: 'default',
};

export class Transmitter {
  protected coordinator: Window = window.top;
  protected options: TransmitterOptions;

  constructor(options: Partial<TransmitterOptions> = {}) {
    this.options = {
      ...defaultTransmitterOptions,
      ...options,
    };
  }

  emit<T>(action: Action<T>): void {
    this.coordinator.postMessage(this.createMessage(action), '*');
  }

  protected createMessage<T>(action: Action<T>): PostMessageData<T> {
    return {
      action: {
        ...action,
        timestamp: new Date().getTime(),
      },
      channelId: this.options.channelId,
      private: true,
      libId,
    };
  }
}
