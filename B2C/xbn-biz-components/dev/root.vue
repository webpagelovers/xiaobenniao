<template>
    <div id="xbn-app">
        <nt-row>
            <nt-col :span="4">
                <ul class="nt-menu">
                    <router-link :to="route.path" v-for="route in routes" v-if="!route.menu_ignored" :key="route.path">
                        <li class="nt-menu-item" >
                            {{route.path}}
                        </li>
                    </router-link>
                </ul>
            </nt-col>
            <nt-col :span="20">
                <div id="xbn-root">
                    <router-view></router-view>
                </div>
            </nt-col>
        </nt-row>
    </div>
</template>

<script>

    import config from '../src/test';

    export default {
        data: function() {
            return {
                routes: config.routes
            };
        },
        created: async function() {

        },
        components: {


        }
    };
</script>


