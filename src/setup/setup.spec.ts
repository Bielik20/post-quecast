import { Coordinator } from './coordinator';
import { setupPostQuecast } from './setup';

jest.mock('./coordinator');

describe('setupPostQuecast', () => {
  it('should be successful', () => {
    setupPostQuecast();
    expect(Coordinator).toHaveBeenCalledTimes(1);
  });
});
