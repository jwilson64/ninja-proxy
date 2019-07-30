module.exports = {
  roots: ['<rootDir>/lib', 'test'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '.*.(test|spec).[tj]s?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
