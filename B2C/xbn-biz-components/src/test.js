import * as account from './model/account';
import * as modelcache from './model/cache';
import * as github from './model/github';

import errorStatus from './model/account-errors';

import {HeaderTest, ListPageTest, AvatarTest, ErrorTest, BatchImportTest, ModelCacheTest, GitSearch, ComboPage} from './pages/page';

const routes = [{
    path: '/header',
    component: HeaderTest
}, {
    path: '/pagelist',
    component: ListPageTest
}, {
    path: '/avatar',
    component: AvatarTest
}, {
    path: '/error',
    component: ErrorTest
}, {
    path: '/batchImport',
    component: BatchImportTest
}, {
    path: '/cache',
    component: ModelCacheTest
}, {
    path: '/git/',
    component: GitSearch
}, {
    path: '/git/:user',
    menu_ignored: true,
    component: GitSearch
}, {
    path: '/combo',
    component: ComboPage
}];

export default {
    routes,
    models: [account, modelcache, github],
    errors: errorStatus
};