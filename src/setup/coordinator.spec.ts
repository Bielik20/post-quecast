import { mockPostMessages } from '../../test-helpers/mock-postmessages';
import { INTERNAL_TYPES, LIB_ID } from '../utils/constants';
import { PostMessageData } from '../utils/post-message-data';
import { Channel } from './channel';
import { Coordinator } from './coordinator';

jest.mock('./channel');

describe('Coordinator', () => {
  const channelMock: jest.Mock = Channel as any;

  beforeAll(() => {
    mockPostMessages();
    new Coordinator().init();
  });

  beforeEach(() => {
    channelMock.mockClear();
  });

  it('should create separate channel for each channel id', () => {
    window.postMessage(createConnectMessage('1'), '*');
    window.postMessage(createConnectMessage('1'), '*');
    window.postMessage(createConnectMessage('2'), '*');
    window.postMessage(createMessage('3'), '*');

    expect(channelMock.mock.instances.length).toBe(2);
    expect(channelMock.mock.instances[0].addConnection).toHaveBeenCalledTimes(2);
    expect(channelMock.mock.instances[1].addConnection).toHaveBeenCalledTimes(1);
  });

  it('', () => {
    console.log(channelMock.mock.instances.length);
  });
});

function createConnectMessage(channelId: string): PostMessageData {
  return {
    action: {
      type: INTERNAL_TYPES.connect,
      timestamp: 0,
    },
    libId: LIB_ID,
    private: true,
    channelId,
  };
}

function createMessage(channelId: string): PostMessageData {
  return {
    action: {
      type: 'message',
      timestamp: 0,
    },
    libId: LIB_ID,
    channelId,
  };
}
