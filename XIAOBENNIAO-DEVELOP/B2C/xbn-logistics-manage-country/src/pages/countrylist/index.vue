<style lang="less">
    .nt-popover.clearPadding {
        padding: 0;
        overflow: hidden;
    }

</style>

<template>
    <div class="plan-list-container">

        <template-search-list ref="pageTmpl" title="国家配置" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryCountry"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增国家</nt-button>
            </template>


            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="country" label="国家名称" min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeCty(scope.row)">{{scope.row.country}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="abbreviation" label="国家缩写">
                            <template slot-scope="scope">
                                <span :filter-method="changeAbbr(scope.row)">{{scope.row.abbreviation}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="imgPath" label="国家旗帜">
                            <template slot-scope="scope">
                                <nt-popover
                                        ref="popover{{$index}}"
                                        placement="right-start"
                                        v-model="scope.row.visibleSmall"
                                        width="286"
                                        height="190"
                                        :visible-arrow="false"
                                        popper-class="clearPadding"
                                        trigger="click">
                                    <img width="286" height="190" :src="scope.row.imgPath" class="fL border_outer"
                                         alt="" >
                                </nt-popover>
                                <div class="inline_block" v-popover:popover{{$index}}>
                                    <img :src="scope.row.imgPath" alt="" width="46"
                                         height="30" class="border_outer"
                                         v-if="scope.row.imgPath">
                                </div>

                            </template>
                        </nt-table-column>
                        <nt-table-column label="货币单位" prop="currencyUnit" sortable>
                            <template slot-scope="scope">
                                <span :filter-method="changeCU(scope.row)">{{scope.row.currencyUnit}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="过滤词" prop="forbiddenKeys" min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeFK(scope.row)">{{scope.row.forbiddenKeys}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" min-width="110">
                            <template slot-scope="scope">
                                <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)" v-if="scope.row.countryType == 1">修改
                                </nt-button>
                                <!--<nt-button type="text" size="small" @click="deleteCurrentCountry(scope.$index, scope.row)">删除
                                </nt-button>-->
                            </template>
                        </nt-table-column>
                    </nt-table>
                </div>
            </template>
        </template-search-list>
    </div>
</template>

<script>

    import listMixin from './search.config';

    export default {
        mixins: [listMixin],
        components: {},
        data() {
            return {
                dialogImgVisible: true
            };
        },

        created: async function () {
        },

        methods: {

            aaa: function (a) {
                const h = this.$createElement;
                this.$msgbox({
                    title: ' ',
                    message: h('div', {}, a),
                    showConfirmButton: false,
                });

            },

            //获取物流计划列表
            queryCountry: function (params) {
                return this.ctx.models.country.listCountry(params);
            },


            //删除单条
            deleteCurrentCountry: function (index, row) {
                const This = this;
                this.ctx.models.country.deleteCountry(row.id).then((res) => {
                    if (res.statusCode == 2000000) {
                        This.$refs.pageTmpl.refreshData();
                    }
                });

            },

            //格式化国家
            changeCty: function (row) {
                row.country = this.ellipsCharts(row.country, 20);
            },

            //格式化国家简写
            changeAbbr: function (row) {
                row.abbreviation = this.ellipsCharts(row.abbreviation, 20);
            },

            //格式化货币单位
            changeCU: function (row) {
                row.currencyUnit = this.ellipsCharts(row.currencyUnit, 24);
            },

            //格式化过滤词
            changeFK: function (row) {
                row.forbiddenKeys = this.ellipsCharts(row.forbiddenKeys, 20);
            },


            //跳到增加页面
            jumpAdd: function () {
                this.$router.push({path: '/country/add'});
            },

            //跳到修改页面
            jumpUpdate(index, row) {
                this.$router.push({path: '/country/update?id=' + row.id});
            },

            //省略多余的字符
            ellipsCharts: function (str, len) {
                if (!str) {
                    return false;
                }

                let _len = str.split('').length;
                if (_len > len) {
                    return str.substring(0, len) + '...';
                } else {
                    return str;
                }
            },


        }
    }
    ;
</script>