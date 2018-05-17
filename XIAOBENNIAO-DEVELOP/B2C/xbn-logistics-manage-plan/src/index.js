import {PlanList, AddPlan, PlanDetail} from './pages/page';
import * as plans from './models/plans';
import errors from './models/error-code';


const routes = [{
    path: '/plan/list',
    component: PlanList
},{
    path: '/plan/add',
    component: AddPlan
},{
    path: '/plan/update',
    component: AddPlan
},{
    path: '/plan/detail',
    component: PlanDetail
}];

export default {
    routes,
    errors,
    models: [plans]
};