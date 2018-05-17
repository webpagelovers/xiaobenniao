import { 
    PageList,
    PageDetail,
    PageEdit,
    PageAudit
} from './pages/page';
import * as product from './models/product';
import './models/style.less';
const routes = [
    {
        path: '/commodity/list/',
        component: PageList
    },
    {
        path: '/commodity/detail/:id',
        component: PageDetail
    },
    {
        path: '/commodity/edit/:id',
        component: PageEdit
    },
    {
        path: '/commodity/audit/:id',
        component: PageAudit
    }
];

export default {
    routes,
    models: [product]
}
