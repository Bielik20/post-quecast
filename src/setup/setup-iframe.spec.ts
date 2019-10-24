import { setupPostQuecast } from './setup';

describe('setupPostQuecast', () => {
  it('should fail if called on iframe', () => {
    Object.defineProperty(window, 'top', { value: null });
    try {
      setupPostQuecast();
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toMatch('You can only setup Post Quecast on top level window.');
    }
  });
});
