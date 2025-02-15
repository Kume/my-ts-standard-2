import {mapObject} from '../index';

describe('Unit tests for mapObject', () => {
  it('', () => {
    const actual = mapObject({a: 1, b: 3}, (value, key) => `${key} => ${value}`);
    expect(actual).toEqual(['a => 1', 'b => 3']);
  });
});
