<style lang="less">
    .plan-list-container {
        .popover1 {
            margin-bottom: 0 !important;
        }

        .popover1 .nt-form-item__label {
            padding: 0 !important;
        }

        .popover2 .nt-form-item__label {
            margin-top: 30px;
        }
        .bgcfff {
            background-color: #fff !important;
        }

        /*.pd10 {
            padding: 10px;
        }

        .tac {
            text-align: center;
        }*/

        .col20a0ff {
            cursor: pointer;
            color: #20a0ff;
        }

        .nt-dialog__body p {
            line-height: 28px;
        }
        .col_317dff {
            color: #317dff;
        }

        /* .nt-table th > .cell {
             padding: 0 5px;
         }
         .nt-table .cell {
             padding: 0 5px;
         }*/
        .nt-page-pagination {
            text-align: center;
        }
        .col_e40000 {
            color: #e40000;
        }
        .bg_f5 {
            background: #f5f5f5;
            border-radius: 5px;
            width: 253px;
            height: 30px;
        }
        .pL10 {
            padding-left: 10px;
        }
        .mR10 {
            margin-right: 10px;
        }

        .nt-page-filter {
            text-align: right;
        }

    }

    .nt-popover.clearPadding {
        padding: 0;
        overflow: hidden;
    }

</style>

<template>
    <div class="plan-list-container">

        <template-search-list ref="pageTmpl" title="港口管理" :simple="simpleSearch" :combo="comboSearch"
                              :method="queryPort"
                              :filter="quickFilter">
            <template slot="page-table-operations">
                <nt-button type="primary" nt-col-offset-0 @click="jumpAdd">新增港口</nt-button>
            </template>


            <template slot="page-table" slot-scope="props">
                <div class="contentBox">
                    <nt-table :data="props.tableData" class="border_layout">
                        <nt-table-column width="27"></nt-table-column>
                        <nt-table-column prop="name" label="港口名称" sortable min-width="120">
                            <template slot-scope="scope">
                                <span :filter-method="changeN(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column prop="portType" label="港口类型">
                            <template slot-scope="scope">
                                <span :filter-method="changePT(scope.row)">{{scope.row.portType}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="所属国家" prop="countryId">
                            <template slot-scope="scope">
                                <span :filter-method="changeCI(scope.row)">{{scope.row.countryId}}</span>
                            </template>
                        </nt-table-column>
                        <nt-table-column label="操作" width="200" min-width="200">
                            <template slot-scope="scope">
                                <nt-button type="text" size="small" @click="jumpUpdate(scope.$index, scope.row)">修改
                                </nt-button>
                                <!--<nt-button type="text" size="small" @click="deleteCurrentPort(scope.$index, scope.row)">删除
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
    import constant from '../constant.js';

    export default {
        mixins: [listMixin],
        components: {},
        data() {
            return {
                portTypeFormat: [{label: '国内', id: '1'}, {label: '海外', id: '2'}],
                countryIdFormat: [],
                imgBaseUrl: constant.baseUrl,
                dialogImgVisible: true
            };
        },

        created: async function () {
            const dictionary = await this.ctx.models.port.getGcfsDictionary();
            this.countryIdFormat = dictionary.country;
        },

        methods: {


            //获取物流计划列表
            queryPort: function (params) {
                return this.ctx.models.port.listPort(params);
            },


            //获取字典
            getGcfsDictionary: async function () {
                const dictionary = await this.ctx.models.port.getGcfsDictionary();
                return dictionary;
            },


            //删除单条
            deleteCurrentPort: function (index, row) {
                const This = this;
                this.ctx.models.port.deletePort(row.id).then((res) => {
                    if (res.statusCode == 2000000) {
                        This.$refs.pageTmpl.refreshData();
                    }
                });

            },

            //格式化港口名称
            changeN: function (row) {
                row.name = this.ellipsCharts(row.name, 40);
            },

            //格式化港口类型
            changePT: function (row) {
                row.portType = this.getItem(row.portType, this.portTypeFormat);
                row.portType = this.ellipsCharts(row.portType, 20);
            },

            //格式化所属国家
            changeCI: function (row) {
                row.countryId = this.getCItem(row.countryId, this.countryIdFormat);
                row.countryId = this.ellipsCharts(row.countryId, 20);

            },

            //跳到增加页面
            jumpAdd: function () {
                this.$router.push({path: constant.addPage});
            },

            //跳到修改页面
            jumpUpdate(index, row) {
                this.$router.push({path: constant.updatePage + '?id=' + row.id});
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

            //获取格式化以后的数据
            getItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].label;
                    }
                }
                return itemType;
            },

            //获取货币单位item
            getCItem: function (itemType, itemFormat) {
                for (let i = 0; i < itemFormat.length; i++) {
                    if (itemFormat[i].id == itemType) {
                        itemType = itemFormat[i].country;
                    }
                }
                return itemType;
            },


        }
    };
</script>