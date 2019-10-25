import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { INTERNAL_TYPES, LIB_ID } from './models/constants';
import { createHostMock } from './models/host.mock';
import { Receiver } from './receiver';

describe('Receiver', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(10);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should setup connection on create', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });

    expect(receiver).toBeDefined();
    expect(host.postMessage).toHaveBeenCalledTimes(1);
    expect(host.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connect,
        timestamp: 10,
      },
      channelId: '1',
      private: true,
      libId: LIB_ID,
    });
  });

  it('should expose actions', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });
    const action = {
      type: 'message',
      timestamp: 10,
    };

    assertStream(receiver.actions$, '()', {});

    host.postMessage(
      {
        action,
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );

    assertStream(receiver.actions$, '(a)', { a: action });
  });

  it('should expose only public actions', () => {
    const host = createHostMock();
    const receiver = new Receiver({ host, coordinatorHost: host, channelId: '1' });
    const action = {
      type: 'message',
      timestamp: 10,
    };

    assertStream(receiver.actions$, '()', {});

    host.postMessage(
      {
        action,
        channelId: '1',
        libId: LIB_ID,
        private: true,
      },
      '*',
    );

    assertStream(receiver.actions$, '()', {});
  });

  it('should keep actions history');

  it('should keep actions history if no subscriber');

  it('should work for coordinator and child');

  it('should work for multiple channels');

  function assertStream(stream$: Observable<any>, marbles: string, values: any): void {
    scheduler.run(({ expectObservable }) => {
      expectObservable(stream$).toBe(marbles, values);
    });
  }
});
