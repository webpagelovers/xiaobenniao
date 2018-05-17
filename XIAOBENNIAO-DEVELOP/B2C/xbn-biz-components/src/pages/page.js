
// 这里指定每个页面组件的动态引入方式
// 可参考Vue-router官方标准写法
// https://router.vuejs.org/zh-cn/advanced/lazy-loading.html

// const Foo = () => import('./Foo.vue') 是懒加载引入
// 而  const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')  是webpack写法， 注意注释里面的内容不能删除
// 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。

const HeaderTest = () => import(/* webpackChunkName: "logistics-plan" */ './header/index.vue');
const ListPageTest = () => import(/* webpackChunkName: "logistics-plan" */ './searchlist/index.vue');
const AvatarTest = () => import(/* webpackChunkName: "logistics-plan" */ './avatar/index.vue');
const ErrorTest = () => import(/* webpackChunkName: "logistics-plan" */ './error/index.vue');
const BatchImportTest = () => import(/* webpackChunkName: "logistics-plan" */ './batch/index.vue');
const ModelCacheTest = () => import(/* webpackChunkName: "logistics-plan" */ './cache/index.vue');
const GitSearch = () => import(/* webpackChunkName: "logistics-plan" */ './gitsearch/index.vue');
const ComboPage = () => import(/* webpackChunkName: "logistics-plan" */ './combopage/index.vue');

export {
    HeaderTest,
    ListPageTest,
    AvatarTest,
    ErrorTest,
    BatchImportTest,
    ModelCacheTest,
    GitSearch,
    ComboPage
};
