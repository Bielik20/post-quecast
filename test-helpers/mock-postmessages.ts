import { PostMessageData } from '../src/utils/post-message-data';
import { PostMessageEvent } from '../src/utils/post-message-event';

type Callback = (event: PostMessageEvent) => void;

export function mockPostMessages(): {
  addEventListenerSpy: jest.SpyInstance;
  postMessageSpy: jest.SpyInstance;
} {
  const listeners: Callback[] = [];

  const addEventListenerSpy = jest
    .spyOn(window, 'addEventListener')
    .mockImplementation((type: string, listener: any) => {
      listeners.push(listener);
    });

  const postMessageSpy = jest
    .spyOn(window, 'postMessage')
    .mockImplementation((data: PostMessageData, origin: string) => {
      listeners.forEach(listener => {
        listener({ source: window, data });
      });
    });

  return {
    addEventListenerSpy,
    postMessageSpy,
  };
}
