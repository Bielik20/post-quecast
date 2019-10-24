import { onlyValidMessages } from '../rxjs/only-valid-messages';
import { INTERNAL_TYPES, LIB_ID } from '../utils/constants';
import { PostMessageData } from '../utils/post-message-data';
import { Channel } from './channel';
import { Coordinator } from './coordinator';

jest.mock('./channel');
jest.mock('../rxjs/only-valid-messages');

describe('Coordinator', () => {
  const channelMock: jest.Mock = Channel as any;
  const onlyValidMessagesMock: jest.Mock = onlyValidMessages as any;

  beforeAll(() => {
    new Coordinator().init();

    onlyValidMessagesMock.mockImplementation(() => (source: any) => source);
    window.addEventListener('message', event => console.log(event.data.action));
  });

  beforeEach(() => {
    channelMock.mockClear();
  });

  afterAll(() => {
    onlyValidMessagesMock.mockRestore();
  });

  describe('handleConnect', () => {
    it('should create separate channel for each channel id', async done => {
      window.postMessage(createConnectMessage('1'), '*');
      window.postMessage(createConnectMessage('1'), '*');
      window.postMessage(createConnectMessage('2'), '*');
      setTimeout(() => {
        expect(channelMock.mock.instances.length).toBe(2);
        done();
      });
    });
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

// function createMessage(channelId: string): PostMessageData {
//   return {
//     action: {
//       type: 'message',
//       timestamp: 0,
//     },
//     libId: LIB_ID,
//     channelId,
//   };
// }
