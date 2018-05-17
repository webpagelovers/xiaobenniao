import { 
    PageList,
    PageDetail,
    PageEdit,
    PageAudit
} from './pages/page';
import * as encasement from './models/encasement';
import './models/style.less';
const routes = [
    {
        path: '/encasement/list/',
        component: PageList
    },
    {
        path: '/encasement/detail/:id',
        component: PageDetail
    },
    {
        path: '/encasement/edit/:id',
        component: PageEdit
    },
    {
        path: '/encasement/audit/:id',
        component: PageAudit
    }
];

export default {
    routes,
    models: [encasement]
}
