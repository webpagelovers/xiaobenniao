import {Companylist} from './pages/page';
import * as company from './models/company';

const routes = [{
    path: '/company/list',
    component: Companylist
}];

export default {
    routes,
    models: [company]
};