import { foo } from './index';

describe('foo', () => {
    it('should add 5 to a number', () => {
        expect(foo(1)).toBe(6);
    });
});
