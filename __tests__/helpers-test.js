jest.unmock('../src/helpers');

import { omitProps, fontSizeConverter } from '../src/helpers';

describe('helpers', () => {

  describe('omitProps', () => {
    it('should omit object properties', () => {
      const obj = omitProps({ a: 1, b: 2, c: 3, d: 4 }, [ 'a', 'c' ]);
      expect(obj).toEqual({ b: 2, d: 4 });
    });
  });

  describe('fontSizeConverter', () => {
    it('should minimal tag size', () => {
      const size = fontSizeConverter(25, 10, 1000, 12, 25);
      expect(size).toEqual(12);
    });

    it('should maximal tag size', () => {
      const size = fontSizeConverter(980, 10, 1000, 12, 25);
      expect(size).toEqual(25);
    });

    it('should middle tag size', () => {
      const size = fontSizeConverter(450, 10, 1000, 12, 25);
      expect(size).toEqual(18);
    });
  });

});