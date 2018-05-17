function searchGitUser(params, ctx) {
    return ctx.servers.github.get('/search/users', {
        q: params.user,
        sort: 'followers'
    });
}

async function getUserDetail(params, ctx) {
    return await ctx.servers.github.get(`/users/${params.user}`);
}

async function getUserStarred(params, ctx) {
    return await ctx.servers.github.get(`https://api.github.com/users/${params.user}/starred`);
}

async function pageUserDetail(params, ctx) {
    const [detail, starred] = await Promise.all([getUserDetail(params, ctx), getUserStarred(params, ctx)]);
    return {
        detail,
        starred
    };
}
//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const githuber = {
    searchGitUser,
    pageUserDetail,
    getUserStarred,
    getUserDetail
};

//export default githuber;
/*

export default {
    searchGitUser,
    pageUserDetail,
    getUserStarred,
    getUserDetail
}*/
