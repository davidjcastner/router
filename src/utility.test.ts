// import indirectly from index to ensure that
//  the functions are exported correctly
import {
    getHash,
    getPath,
    getQuery,
    pathFor,
} from './index';


describe('getHash', () => {
    it('should remove the # symbol from a hash string', () => {
        expect(getHash('#home')).toBe('home');
        expect(getHash('#about')).toBe('about');
    });

    it('should return an empty string if hash is blank', () => {
        expect(getHash('')).toBe('');
    });
});


describe('getPath', () => {
    it('should split a path string by the slash delimiter', () => {
        expect(getPath('/home/page')).toStrictEqual(['home', 'page']);
        expect(getPath('/1/2/3')).toStrictEqual(['1', '2', '3']);
    });

    it('should ignore empty segments', () => {
        expect(getPath('///')).toStrictEqual([]);
        expect(getPath('///home///')).toStrictEqual(['home']);
    });
});


describe('getQuery', () => {
    it('should get key value pairs from the search string', () => {
        expect(getQuery('?fruit=apple&vegetable=carrot'))
            .toStrictEqual({
                fruit: 'apple',
                vegetable: 'carrot',
            });
    });

    it('should return empty object when search string is empty', () => {
        expect(getQuery('')).toStrictEqual({});
        expect(getQuery('?')).toStrictEqual({});
    });
});


describe('pathFor', () => {
    it('should construct a relative href', () => {
        expect(pathFor({
            path: ['abc', 'def'],
            query: {
                ghi: 'jkl',
                mno: 'pqr',
            },
            hash: 'stu',
        })).toBe('/abc/def?ghi=jkl&mno=pqr#stu');
    });

    it('should return / when no parameters', () => {
        expect(pathFor({})).toBe('/');
    });
});
