module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/e2e'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
    },
  },
  moduleNameMapper: {
    '^@wikia/post-quecast': '<rootDir>/src/index.ts',
  },
};
