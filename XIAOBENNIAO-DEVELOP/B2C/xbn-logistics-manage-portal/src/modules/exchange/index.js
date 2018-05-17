import { 
    PageIncomelist,
    Pagesettlementlist,
    PageDetail
} from './pages/page';
import * as exchange from './models/exchange';
import './models/style.less';
const routes = [
    {
        path: '/exchange/incomelist/',
        component: PageIncomelist
    },
    {
        path: '/exchange/settlelist/',
        component: Pagesettlementlist
    },
    {
        path: '/exchange/detail/:id',
        component: PageDetail
    }
];

export default {
    routes,
    models: [exchange]
}
