import {PortList, AddPort} from './pages/page';
import * as port from './models/port';

const routes = [{
    path: '/port/list',
    component: PortList
}, {
    path: '/port/add',
    component: AddPort
}, {
    path: '/port/update',
    component: AddPort
}];

export default {
    routes,
    models: [port]
};