import sizeof from 'object-sizeof';
import { createHash } from 'crypto';
import LRUCache from 'lru-cache';
import Generate from './utils/generate.js';

Object.assign(process.env, {
    BOT_TOKEN: process.env.BOT_TOKEN ? process.env.BOT_TOKEN : '6877321074:AAHFvu3EReuvG1_Py3qUSk_nmEJSJE01nuQ',
    EMOJI_DOMAIN: process.env.EMOJI_DOMAIN ? process.env.EMOJI_DOMAIN : 'https://emojipedia.org/'
});

const cache = new LRUCache({
    max: 1000 * 1000 * 1000,
    length: (n) => { return sizeof(n); },
    maxAge: 1000 * 60 * 45
});

export default async function(param = {}) {
    let result = {};

    const cacheString = createHash('md5').update(JSON.stringify(param)).digest('hex');
    const resultCache = cache.get(cacheString);

    console.log({ cacheString, resultCache });

    if (!resultCache) {
        result = await Generate(param);

        if (!result.error) cache.set(cacheString, result);
    } else {
        result = resultCache;
    };

    return result;
};
