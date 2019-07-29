module.exports = {
  roots: ['<rootDir>/lib', 'test'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '.*.(test|spec).ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
