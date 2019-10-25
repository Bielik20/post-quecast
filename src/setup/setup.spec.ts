import { LIB_ID } from '../models/constants';
import { createHostStub } from '../models/host.stub';
import { Coordinator } from './coordinator';
import { setupPostQuecast } from './setup';

jest.mock('./coordinator');

describe('setupPostQuecast', () => {
  const coordinatorMock: jest.Mock = Coordinator as any;

  beforeEach(() => {
    coordinatorMock.mockClear();
  });

  it('should work on default host', () => {
    setupPostQuecast();
    expect(Coordinator).toHaveBeenCalledTimes(1);
    expect((window as any)[LIB_ID] instanceof Coordinator);
  });

  it('should work on custom host', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);
    expect(Coordinator).toHaveBeenCalledTimes(1);
    expect((hostStub as any)[LIB_ID] instanceof Coordinator);
  });

  it('should work for two different hosts', () => {
    const host1 = createHostStub();
    const host2 = createHostStub();

    setupPostQuecast(host1);
    setupPostQuecast(host2);
    expect(Coordinator).toHaveBeenCalledTimes(2);
    expect((host1 as any)[LIB_ID] instanceof Coordinator);
    expect((host2 as any)[LIB_ID] instanceof Coordinator);
  });

  it('should work only once for one host', () => {
    const hostStub = createHostStub();

    setupPostQuecast(hostStub);

    try {
      setupPostQuecast(hostStub);
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toMatch('You can only setup Post Quecast once on given host.');
    }
  });
});
