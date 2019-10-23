import { Action } from '../utils/action';
import { INTERNAL_TYPES, LIB_ID } from '../utils/constants';

export class Channel {
  private connections = new Set<Window>([window.top]);
  private history: Action[] = [];

  constructor(private channelId: string) {}

  addConnection(connection: Window): void {
    this.connections.add(connection);

    connection.postMessage(
      {
        action: this.createConnectedAction(),
        private: true,
        channelId: this.channelId,
        libId: LIB_ID,
      },
      '*',
    );
  }

  private createConnectedAction(): Action {
    return {
      type: INTERNAL_TYPES.connected,
      history: this.history,
      timestamp: new Date().getTime(),
    };
  }

  broadcast<T>(action: Action<T>): void {
    this.history.push(action);
    this.connections.forEach(connection => {
      connection.postMessage({ action, channelId: this.channelId, libId: LIB_ID }, '*');
    });
  }
}
