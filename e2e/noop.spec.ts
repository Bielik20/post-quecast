import { setupPostQuecast } from '@wikia/post-quecast';

describe('noop', () => {
  it('is always ok', () => {
    setupPostQuecast();
    expect(true).toBe(true);
  });
});
