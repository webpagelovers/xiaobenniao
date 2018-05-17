import {cache} from 'nt-framework/src/model/cache';

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

let time = 1;

async function original(param, ctx) {
    await wait(200);
    time ++;
    if (param) {
        return {
            statusCode: '2000000',
            data: {
                param,
                time
            }
        };
    } else {
        return {
            statusCode: '2000000',
            data: {
                time
            }
        };
    }
}

const cached = cache(original, {
    key: 'biz-method.all'
});

const cachedByParam = cache(original, {
    key: (param, ctx) => {
        return 'biz-method.cache.' + param.key;
    }
});

async function clearCache(param, ctx) {
    ctx.store.remove('biz-method.all');
    ctx.store.remove('biz-method.cache.1');
    time ++;
}

export const modelcache = {
    original,
    cached,
    cachedByParam,
    clearCache
};