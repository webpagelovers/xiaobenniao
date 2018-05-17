import {CountryList, AddCountry} from './pages/page';
import * as country from './models/country';

const routes = [{
    path: '/country/list',
    component: CountryList
}, {
    path: '/country/add',
    component: AddCountry
}, {
    path: '/country/update',
    component: AddCountry
}];

export default {
    routes,
    models: [country]
};