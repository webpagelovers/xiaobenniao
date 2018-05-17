import {list, details} from './pages/page';
import * as cfOrderModels from './models/models';
import errors from './models/error-code';
// import './models/product.less';

const routes = [
    {
        path: '/cfOrder/list',
        component: list
    },
    {
        path: '/cfOrder/details/:id',
        // type -> confirm   确认，审核页面
        component: details
    },
];

export default {
    routes,
    errors,
    models: [cfOrderModels]
}
