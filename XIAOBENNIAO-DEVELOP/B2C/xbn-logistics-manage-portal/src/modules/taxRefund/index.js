import {list, details} from './pages/page';
import * as taxrefund from './models/models';
import errors from './models/error-code';
// import './models/product.less';

const routes = [
    {
        path: '/taxrefund/list',
        component: list
    },
    {
        path: '/taxrefund/details/:id/:type?',
        // type -> confirm   确认，审核页面
        component: details
    },
];

export default {
    routes,
    errors,
    models: [taxrefund]
}
