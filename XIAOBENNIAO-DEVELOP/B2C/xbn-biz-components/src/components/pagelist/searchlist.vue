<style lang="less" scoped>

    .nt-pagelist {
        height: 100%;
        overflow: auto;
    }
    .operationBox {
        &.top-fixed {
            position: fixed;
            z-index: 999;
            right: 0;
            top: 0;
        }

        .nt-page-filter {
            .nt-select {
                margin-left: 15px;
            }
        }
    }

    .nt-page-operation-bar {
        margin: 15px 0px;
        height: 30px;

        .nt-page-buttons {
            float: left;
        }
        .nt-page-filter {
            float: right;
        }
    }

    .time-query-value {
        width: 280px;
    }

    .nt-page-filter {
        float: right;
    }

    .nt-page-pagination {
        .nt-pagination {
            padding-top: 0;
            text-align: center;
        }
    }
</style>

<template>
    <div class="nt-pagelist" ref="root">
        <page-head :title="title" ref="head">
            <template slot="search">
                <combo-search :simple='simple' :initial-query="initialQuery" :combo='combo' ref="comboSearch" :suggestion-method="suggestionMethod" @query="handleQuery">

                </combo-search>
            </template>
        </page-head>
        <!--表格上方的操作栏-->

        <page-nav >
            <div class="nt-page-buttons"  style="float:left;">
                <slot name="page-table-operations">

                </slot>
            </div>

            <div class="nt-page-right-buttons" style="float:right;">
                <slot name="page-table-right-operations">

                </slot>
            </div>

            <div class="nt-page-filter">
                <nt-select v-for="filter in quickFilter" :class="transformFilterSize(filter.size)"
                           :key="filter.key" v-model="comboModel[filter.key]" :placeholder="filter.label" clearable>
                    <nt-option
                            v-for="item in filter.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </nt-option>
                </nt-select>
            </div>
        </page-nav>

        <!--实际表格插槽-->
        <div class="nt-page-table">
            <nt-row ref="tableRow">
                <slot name="page-table" :tableData="tableData">
                </slot>
            </nt-row>
        </div>

        <div class="nt-page-pagination">
            <slot name="page-full-pagination">
                <nt-pagination
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange"
                        :current-page="page.pageNo"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.totalCount">
                </nt-pagination>
            </slot>
        </div>
    </div>
</template>
<script>

    import PageHead from '../head/pagehead.vue';
    import ComboSearch from '../combo-search/combosearch.vue';
    import findVmChildren from '../../utils/find';

    import deepmerge from 'deepmerge';
    import {validParam} from '../../utils/valid-param';

    import PageNav from '../navbar/page-nav.vue';

    import { on, off } from 'nt-element/src/utils/dom';

    const size_mapping = {
        'x-small': 'w80',
        'small': 'w110',
        'medium': 'w140',
        'large': 'w160',
        'x-large': 'w240',
        'xx-large': 'w370'
    };

    export default {
        props: {
            title: String, //标题
            method: { //根据搜索、分页、排序条件，拼接好的请求对象，然后传入method对应的方法， 同时从中获取数据
                required: true
            },
            suggestionMethod: { //获取自动完成提示

            },
            /**
             * # 搜索相关
             * 查询方法， 有以下途径 1 简单搜索 2复杂搜索 3分页、翻页 4、排序 5、工具栏过滤 方式会修改查询条件，
             */
            filter: { //其他需要传入的过滤条件
                type: Array,
                default: function() {
                    return [];
                }
            },
            simple: { //简单搜索条件
                type: Array,
                default: function() {
                    return [];
                }
            },
            combo: {  //复杂搜索选项
                type: Array,
                default: function() {
                    return [];
                }
            },
        },
        components: {
            PageHead,
            ComboSearch,
            PageNav
        },

        data () {
            let initialQuery = null;
            if (this.$route.query.query) {
                try {
                    initialQuery = JSON.parse(this.$route.query.query);
                } catch (err) {
                    // query 不合法
                }
            } else {
                initialQuery = {
                    pageNo: 1,
                    pageSize: 10,
                    param: {},
                    searchParam: {}
                };
            }

            const comboModel = {};
            if (this.filter) {
                for(let field of this.filter) {
                    comboModel[field.key] = initialQuery.param[field.key];
                }
            }

            const data = {
                initialQuery,
                comboParam: {
                },
                comboModel,
                quickFilter: this.filter,   //表头过滤条件
                selected: [],               //用户已经选择的列
                tableData: [],              //表格数据
                orders: [],                 //表格的排序信息
                page: {                     //分页信息
                    pageNo: initialQuery.pageNo,
                    pageSize: initialQuery.pageSize,
                    totalCount: 0,
                    totalPages: 0
                },
                //oprFixed: false,            //操作栏fixed标志
                //oprOffsetLeft: '',          //操作栏left距离. 在mounted中计算
            };
            return data;
        },

        watch: {
            'filter': function(val, oldVal) {
                this.rewatchFilters();
            }
        },

        mounted: function() {
            //on(document, 'scroll', this.handleScroll);
            //window.addEventListener('scroll', this.handleScroll);
            //计算左边距是整个list的左边距
        },

        destroyed() {
           // off(document, 'scroll', this.handleScroll);
        },

        computed: {

        },

        beforeCreate: function() {

        },

        created: async function() {
            const vmlist = this;
            this.filterWatches = [];

            /**
             * 在这里，获取slot内部的组件并动态绑定事件。
             * 按 vue作者说法
             * You cannot listen to events on <slot>. It can end up rendering anything: text, plain element, multiple nodes...
             * the behavior will be unpredictable.
             * It seems you are trying to make a slot container communicate with a slot child
             * - in most cases this means the two components are coupled by-design, so you can do something like this.$parent.$emit(...) from the child,
             * and listen to that event in the parent with this.$on(...).
             *
             * 组件监听slot内部的事件基本还要依赖于父的组件结构。(因为slot属于组件父的一部分， 它只是分发到组件显示而已)
             *
             * 这里采取的方案就是 组件的created nexttick里面， 遍历slot进而获取slot内部组件的方式
             *
             * 好处是不用修改组件使用方及第三方组件。 缺点是
             * 1 要确保 nextTick时， slot内部组件已经被加载
             * 2 确保通过组件options能够判断组件 vm.$options._componentTag
             */
            this.$nextTick(async ()=> {
                const tableRow = this.$refs.tableRow;
                this.$refs.table = findVmChildren(tableRow, function (vm) {
                    if (vm.$options && vm.$options._componentTag === 'nt-table') {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (this.$refs.table) {
                    //监听列排序方法
                    this.$refs.table.$on('sort-change', function(column, prop, order ) {
                        vmlist.hanldeRowOrder(column, prop, order);
                        //vmlist.$emit('sort-change', [column, prop, order]);
                    });
                    this.$refs.table.$on('selection-change', function(selection) {
                        vmlist.selected = selection;
                        vmlist.$emit('selection-change', selection);
                    });
                }
                this.comboParam = this.$refs.comboSearch.queryParam();
                await this.refreshData();
            });

            this.rewatchFilters();
        },

        beforeUpdate: function() {

        },

        methods: {
            /**
             * 拼接出前端请求参数， 见Web接口规范
             * http://wiki.xbniao.com/pages/viewpage.action?pageId=18124599
             *
             *
             *  {
             *   //参数
             *   param:{
             *      name: "雷锋",
             *      age: 20,
             *      ...
             *   },
             *   //分页信息
             *   pageSize:  10,      //正整数
             *   pageNo: 1,          //正整数 从1开始
             *
             *   //排序信息
             *   orderParam: [
             *      {
             *        "orderBy": "fieldName1", //排序字段
             *        "ascOrDesc": "asc",      //按什么顺序排，生序asc或者降序desc
             *        "orderIndex": 1          //排序优先级
             *      },
             *      {
             *        "orderBy": "desc",
             *        "ascOrDesc": "fieldName2",
             *        "orderIndex": 2
             *      }
             *   ],
             *   // 非必传字段 根据实际业务需要,用来处理 复杂条件查询 fieldName1<1 and field2 like 'abc'
             *   searchParam: [
             *     {
             *       "key": "fieldName1",    //key的值是字段名
             *       "operator": "le",       //枚举，根据业务实际需要填写，如 ge eq lt gt ...
             *       "value": 2              //值的范围可以是 数字，字符串，数组，对象。
             *     },
             *     {
             *       "key": "fieldName2",
             *       "operator": "like",//ge eq lt gt ...
             *       "value": "abc"
             *     }
             *     ]
             *   }
             */
            queryParam : function() {
                const query = {
                    param: {}
                };

                //表格头部的过滤搜索
                for(const filter of this.filter) {
                    if (this.comboModel[filter.key] != null) { //判断不为null undefined即可 可以为空字符串 "" 0等
                        query.param[filter.key] = this.comboModel[filter.key];
                    }
                }
                query.pageSize = this.page.pageSize;
                query.pageNo = this.page.pageNo;

                if (this.orders && this.orders.length) {
                    query.orderParam = this.orders;
                }

                let result = deepmerge(query, this.comboParam);

                return result;
            },

            /**
             * 处理滚动时，保持操作栏位于页面顶端 (会消失的情形下)
             **/
            handleScroll: function() {
                //获取页面头的高度
                this.oprOffsetLeft = this.$refs.root.offsetLeft + 'px';
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > this.$refs.head.$el.offsetHeight) {
                    this.oprFixed = true;
                } else {
                    this.oprFixed = false;
                }
            },

            /**
             * 当接受条件简单、复杂搜索条件变更时的处理
             **/
            handleQuery: async function (param) {
                this.comboParam = param;
                //已经翻页的情况下，重新选择筛选项后，重新加载列表，页码置为第1页；
                this.page.pageNo = 1;
                //重新输入搜索条件后，筛选项重置为默认值；
                this.resetFilter();
                await this.refreshData();
            },

            /**
             * 重置过滤器的搜索条件为空
             */
            resetFilter: function() {
                for(const filter of this.filter) {
                    this.comboModel[filter.key] = null;
                }
            },

            /**
             * 设置filter的显示宽度
             **/
            transformFilterSize: function(size) {
                if (!size) {
                    size = 'medium';
                }
                return size_mapping[size] || size_mapping['medium'];
            },

            /**
             * filter变更时重新触发搜索
             *
             **/
            rewatchFilters: function() {
                //因为filter会有动态增加的情况。 这时重新进行watch
                for(let unwatch of this.filterWatches) { //取消watcher
                    unwatch();
                }
                //监听快速搜索切换时， 提交搜索条件
                if (this.filter && this.filter.length) {
                    for(const filter of this.filter) {
                        //this.comboModel[filter.key] = '';
                        let unwatch = this.$watch(`comboModel.${filter.key}`, async function(newVal, oldVal) {
                            await this.refreshData();
                        });
                        this.filterWatches.push(unwatch);
                    }
                }
            },

            //点击列排序的处理
            hanldeRowOrder: function(column, prop, order) {
                this.orders = [];
                if (column.prop && column.order) {
                    //主排序字段的处理，目前只有一个排序字段
                    this.orders.push({
                        'orderBy': column.prop, //排序字段
                        'ascOrDesc': column.order === 'ascending' ? 'asc' : 'desc',      //按什么顺序排，生序asc或者降序desc
                        'orderIndex': 1          //排序优先级
                    });
                }
                this.refreshData();
            },

            //获取当前的查询条件
            getCurrentQuery: function() {
                return this.queryParam();
            },

            /**
             * 刷新服务数据。
             */
            async refreshData(callback) {
                const list = this;
                const loading = this.$loading({
                    fullscreen: true,
                    text: '正在加载列表中'
                });
                try {
                    const searchQuery = this.queryParam();

                    if (searchQuery.pageNo >1 || !this.$nt.isEmpty(searchQuery.param) || !this.$nt.isEmpty(searchQuery.searchParam)) {
                        this.$router.replace({
                            query: {
                                query: JSON.stringify(searchQuery)
                            }
                        });
                    } else {
                        this.$router.replace({
                            query: {}
                        });
                    }
                    console.log('refresh data with ', searchQuery);

                    const response = await this.method(searchQuery);
                    if (response.data && response.data.page) {
                        this.page = response.data.page;
                        //对于分页pageNo传回0 会造成无限循环， 这里无记录时 页码也是1
                        if (this.page.pageNo ===0) {
                            this.page.pageNo = 1;
                        }
                        //this.$refs.table.data = response.data.data.list;
                        this.tableData = response.data.list || [];
                    } else {
                        this.$alert('列表返回数据异常');
                    }
                    this.$emit('reloaded');
                    this.$nt.publish('reloaded', this, this.tableData);
                    if (this.$nt.isFunction(callback)) {
                        callback.call(this);
                    }
                    /*
                    this.$nextTick(() => {

                    });*/
                } catch (err) {
                    this.ctx.onerror(err);
                } finally {
                    //处理method 立即返回 loading无法消失的问题
                    this.$nextTick(() => {
                        loading.close();
                    });
                }
            },

            //分页大小改变时
            handlePageSizeChange: function(size) {
                this.page.pageSize = size;
                this.page.pageNo = 1;
                this.refreshData();
            },

            //页码变动时
            handleCurrentPageChange: function(pageNo) {
                if (pageNo === 0) {
                    return ;
                }
                this.page.pageNo = pageNo;
                this.refreshData();
            },

            //输入的提示
            suggestions: function(queryString, callback) {
                if(this.suggestionMethod) {
                    this.suggestionMethod(queryString, callback);
                } else {
                    callback([]);
                }
            },

            /**
             * 获取当前选择的行数据
             **/
            getSelection: function() {
                return this.selected;
            },
        }
    };
</script>

