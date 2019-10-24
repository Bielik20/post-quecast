import { setupPostQuecast } from './setup';

describe('setupPostQuecast', () => {
  it('should fail if called twice', () => {
    try {
      setupPostQuecast();
      setupPostQuecast();
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toMatch('You can only setup Post Quecast once.');
    }
  });
});
