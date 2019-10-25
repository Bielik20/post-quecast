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

    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '()';
      const expectedIngredients = {};

      expectObservable(receiver.actions$).toBe(expectedMarble, expectedIngredients);
    });

    host.postMessage(
      {
        action,
        channelId: '1',
        libId: LIB_ID,
      },
      '*',
    );

    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a)';
      const expectedIngredients = {
        a: action,
      };

      expectObservable(receiver.actions$).toBe(expectedMarble, expectedIngredients);
    });
  });

  it('should expose only public actions');

  it('should keep actions history');

  it('should keep actions history if no subscriber');

  it('should work for coordinator and child');

  it('should work for multiple channels');
});
