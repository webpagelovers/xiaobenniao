<style lang='less' scoped>

</style>

<template>
    <div class='plan-list-container'>
        <template-search-list ref='pageTmpl' title='物流计划查询' :simple='simpleSearch' :combo='comboSearch'
                              :method='queryPlans'
                              :suggestion-method12="remoteFetch"
                              @reloaded="listReloaded"
                              :filter='quickFilter'>
            <template slot='page-table-operations'>
                <nt-button @click="getParam">获取查询</nt-button>
                <nt-button @click="refresh">刷新</nt-button>
                <nt-button @click="once">刷新后提示</nt-button>
            </template>
            <template slot='page-table' slot-scope='props' class='contentBox'>
                <nt-table :data='props.tableData'>
                    <nt-table-column type='selection'>
                    </nt-table-column>
                    <nt-table-column prop='sendTimeLimit' label='sendTimeLimit' sortable="custom" width='280' show-overflow-tooltip>
                    </nt-table-column>
                    <nt-table-column prop='logisticsCode' label='物流编码' sortable min-width='80'>
                    </nt-table-column>
                    <nt-table-column prop='targetPortName' label='目标港口' sortable min-width='40' :formatter="formatter">
                        <template slot-scope="props" slot="append">
                            <nt-tooltip placement="top">
                                <nt-button type="text" style="margin-left: 20px; padding: 0;"><i class="nt-icon-xbn-19" ></i></nt-button>
                                <div slot="content">多行信息<br/>第二行信息</div>
                            </nt-tooltip>
                        </template>
                    </nt-table-column>
                    <nt-table-column prop='disposalSiteName' label='发出港口' sortable="custom" min-width='40'>
                        <template slot-scope="scope">
                            <ul>
                                <li>
                                    {{scope.row.disposalSiteName}}
                                </li>
                            </ul>
                        </template>
                    </nt-table-column>
                    <template slot="empty" slot-scope="props">
                        内容为空， 马上<a>创建</a>吧
                    </template>
                </nt-table>
            </template>
        </template-search-list>
    </div>
</template>

<script>

    import listMixin from './search.config';
    import simpleMixin from './simple.search.config';
    import NtTooltip from "nt-element/src/components/tooltip/src/main";

    export default {

        components: {NtTooltip},
        mixins: [listMixin, simpleMixin],

        data() {
            return {};
        },

        computed: {},

        created: async function () {

        },

        watch: {},

        methods: {

            once: function() {
                this.$nt.once('reloaded', () => {
                   this.$message('page reloaded');
                });
            },

            getParam: function() {
                let params = this.$refs.pageTmpl.getCurrentQuery();
                this.logger.log(JSON.stringify(params));
            },

            refresh: function() {
                let params = this.$refs.pageTmpl.refreshData(function() {
                    console.log('trigger refreshed');
                });
            },
            remoteFetch: function(query, callback) {
                setTimeout(function() {
                    callback([
                        { 'value': '三全鲜食（北新泾店）'},
                        { 'value': 'Hot honey 首尔炸鸡（仙霞路）'}
                    ]);
                }, 1000);
            },

            formatter: function(row, column) {
                return row.targetPortName + '22';
            },

            //获取物流计划列表
            queryPlans: async function (params) {
                const plans = {
                    'statusCode': '2000000',
                    'errMsg': null,
                    'errorList': null,
                    'data': {
                        'page': {'pageNo': params.pageNo, 'pageSize': 10, 'totalCount': params.pageNo*10+34},
                        'list': [{
                            'id': '230364732346851328',
                            'logisticsCode': 'sasfd23423437',
                            'disposalSite': 1,
                            'logisticsType': 1,
                            'targetPort': 1,
                            'sendTimeLimit': '2017-09-27 16:26:57',
                            'expectedArrivalDate': '2017-09-30',
                            'receiveTimeLimit': '2017-09-28 16:26:59',
                            'cutTheTime': '2017-09-29 16:27:01',
                            'startStation': 'SA',
                            'lastStation': 'ASD',
                            'stockAddress': 'asdsa',
                            'createTime': '2017-09-27 08:27:14',
                            'lastUpdateTime': '2017-09-27 08:27:50',
                            'createUser': 'creator',
                            'lastUpdateUser': 'updater',
                            'disposalSiteName': '天津',
                            'targetPortName': '美国-洛杉矶港'
                        }, {
                            'id': '230364854145245184',
                            'logisticsCode': 'asd324324',
                            'disposalSite': 1,
                            'logisticsType': 1,
                            'targetPort': 1,
                            'sendTimeLimit': '2017-09-27 16:27:27',
                            'expectedArrivalDate': '2017-09-30',
                            'receiveTimeLimit': '2017-09-28 16:27:29',
                            'cutTheTime': '2017-09-29 16:27:31',
                            'startStation': 'SA',
                            'lastStation': 'AS',
                            'stockAddress': 'sad',
                            'createTime': '2017-09-27 08:27:43',
                            'lastUpdateTime': '2017-09-27 08:27:43',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '北京',
                            'targetPortName': '美国-洛杉矶港'
                        }, {
                            'id': '230275486206386176',
                            'logisticsCode': 'ADD9999815661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': 'asdsaasddsa',
                            'createTime': '2017-09-27 02:32:36',
                            'lastUpdateTime': '2017-09-27 08:11:10',
                            'createUser': 'creator',
                            'lastUpdateUser': 'updater',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275503910543360',
                            'logisticsCode': 'ADD9999915661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': 'asdasasd',
                            'createTime': '2017-09-27 02:32:40',
                            'lastUpdateTime': '2017-09-27 06:44:46',
                            'createUser': 'creator',
                            'lastUpdateUser': 'updater',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275537351729152',
                            'logisticsCode': 'ADD9999925661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:32:48',
                            'lastUpdateTime': '2017-09-27 02:32:48',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275573250777088',
                            'logisticsCode': 'ADD9999945661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:32:57',
                            'lastUpdateTime': '2017-09-27 02:32:57',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275602833203200',
                            'logisticsCode': 'ADD9999956661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:33:04',
                            'lastUpdateTime': '2017-09-27 02:33:04',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275635754295296',
                            'logisticsCode': 'ADD9999976661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:33:12',
                            'lastUpdateTime': '2017-09-27 02:33:12',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275655027122176',
                            'logisticsCode': 'ADD9999986661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:33:16',
                            'lastUpdateTime': '2017-09-27 02:33:16',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }, {
                            'id': '230275741262012416',
                            'logisticsCode': 'ADD9999996661',
                            'disposalSite': 3,
                            'logisticsType': 1,
                            'targetPort': 7,
                            'sendTimeLimit': '2017-09-20 03:22:56',
                            'expectedArrivalDate': '2017-10-10',
                            'receiveTimeLimit': '2017-09-25 03:22:56',
                            'cutTheTime': '2017-09-28 03:22:56',
                            'startStation': 'GD',
                            'lastStation': 'RUS',
                            'stockAddress': null,
                            'createTime': '2017-09-27 02:33:37',
                            'lastUpdateTime': '2017-09-27 02:33:37',
                            'createUser': 'creator',
                            'lastUpdateUser': 'creator',
                            'disposalSiteName': '深圳',
                            'targetPortName': '俄罗斯-圣彼得堡港'
                        }]
                    }
                };
                const emptyData = {
                    'statusCode': '2000000',
                    'errMsg': null,
                    'errorList': null,
                    'data': {
                        'page': {'pageNo': 1, 'pageSize': 10, 'totalCount': 0, 'totalPages': 0},
                        'list': []
                    }
                };
                return plans;
            },

            listReloaded: function() {
                console.log('reloaded');
            }

        }
    };
</script>