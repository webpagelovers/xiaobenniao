import {PlanList} from './pages/page';
import * as plans from './models/plans';

const routes = [{
    path: '/plan/list',
    component: PlanList
}];

export default {
    routes,
    models: [plans]
};