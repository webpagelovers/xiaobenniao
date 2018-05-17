<style lang="less">

    .simpleSearch {
        width: 514px;
        .select {
            width: 110px;
        }

        .btn-search-more {
            padding: 0;
            margin: 0!important;
            width: 5px;
            min-width: 16px;
        }

        .nt-icon-more {
            transform: rotate(90deg);
        }

        &.comboed-search {
            .nt-icon-search {
                right: 37px;
                font-size: 16px;
            }
        }
    }

    .popSearchBox {
        background: #fff;
        width: 403px;
        padding: 0!important;
        border: 1px solid #eee;
        .popContent {
            padding: 16px;
            .fields {
                width: 372px;
                .search-field {
                    &.line {
                        width: 370px;
                    }
                    margin-bottom: 16px;
                    font-size: 14px;
                    display: inline-block;
                    width: 180px;
                    /*margin-right: 10px;*/
                    label {
                        line-height: 14px;
                        padding-bottom: 8px;
                        display: block;
                    }

                    .nt-select {
                        width: 100%;
                    }

                    &.timequery, &.numberquery {
                        width: 100%;
                        .operator {
                            width: 82px;
                        }

                        .time-query-value {
                            width: 282px;
                        }

                        .number-query-full {
                            width: 282px;
                        }

                        .number-query-sep {
                            width: 134px;
                        }
                    }
                }
                .search-field:last-child{
                    margin-bottom: 0px;
                }
            }


            .pop-btns {
                text-align: right;
                margin-top: 20px;
                .nt-button {
                    width: 80px;
                    padding: 5px 15px;
                    font-size: 16px;
                }
            }
        }
        .pop-close-icon {
            position: absolute;
            right: 16px;
            font-size: 10px;
            top: 10px;
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
    <div class="combo-container">
            <nt-popover ref="popComboSearch"
                        popper-class="popSearchBox"
                        :visible-arrow="false"
                        :offset="10"
                        placement="bottom-end"
                        show="handleComboShow"
                        hide="handleComboHide"
                        trigger="click">
                <div class="popContent">
                    <i class="nt-icon-close pop-close-icon" @click="closeComboSearch"></i>
                    <div class="fields">
                        <slot name="combo-search">
                            <div class="search-field" v-for="(combo, index) in comboSearch" :class="[index%2===0?'odd':'even', combo.line?'line':'', combo.type]">
                                <div v-if="combo.type==='input'">
                                    <label>{{combo.label}}</label>
                                    <div class="field">
                                        <nt-input :maxlength="combo.maxlength" v-model="comboModel[combo.key]"></nt-input>
                                    </div>
                                </div>
                                <div v-if="combo.type==='select'">
                                    <label>{{combo.label}}</label>
                                    <div class="field">
                                        <nt-select v-model="comboModel[combo.key]" placeholder="请选择" clearable>
                                            <nt-option
                                                    v-for="option in combo.options"
                                                    :key="option.value"
                                                    :label="option.label"
                                                    :value="option.value">
                                            </nt-option>
                                        </nt-select>
                                    </div>
                                </div>
                                <div v-if="combo.type==='timequery'">
                                    <label>{{combo.label}}</label>
                                    <time-query v-model="complexModel[combo.key]"></time-query>
                                </div>

                                <div v-if="combo.type==='numberquery'">
                                    <label>{{combo.label}}</label>
                                    <number-query v-model="complexModel[combo.key]"></number-query>
                                </div>
                            </div>
                        </slot>
                    </div>

                    <div class="pop-btns">
                        <nt-button type="primary" icon="search" @click="onComboSearch"></nt-button>
                    </div>
                </div>
            </nt-popover>
            <nt-autocomplete ref='autocomplete' v-model="simpleValue" v-if="simple && simple.length" :fetch-suggestions="suggestions" :placeholder="simplePlaceHolder"  icon="search" class="simpleSearch"
                      :class="this.hasComboSearch?'comboed-search':''"
                      :on-icon-click="handleSimpleSearch">
                <nt-select v-if="simpleSearch.length>1" v-model="simpleKey"
                           slot="prepend" class="select" >
                    <nt-option
                            v-for="item in simpleSearch"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </nt-option>
                </nt-select>
                <nt-button v-if="this.hasComboSearch" slot="append" icon="more" class="btn-search-more" v-popover:popComboSearch></nt-button>
            </nt-autocomplete>
    </div>

</template>
<script>

    import DateUtils from 'nt-element/src/utils/date';

    import TimeQuery from './timequery.vue';
    import NumberQuery from './numberquery.vue';

    import {CappedArray} from './capped-array';
    import {validParam} from '../../utils/valid-param';

    import _map from 'lodash.map';


    export default {
        props: {
            suggestionMethod: { //获取自动完成提示

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
            initialQuery: {
                type : Object,
                default: function() {
                    return {
                        param: {},
                        searchParam: {}
                    };
                }
            }
        },
        components: {
            TimeQuery,
            NumberQuery
        },

        created() {

        },

        data () {
            let simpleSearchKey = null;
            let simpleSearchValue = null;
            if (this.simple.length >0) {
                simpleSearchKey = this.simple[0].value;
                for(let simple of this.simple) {
                    if (validParam(this.initialQuery.param[simple.value])) {
                        simpleSearchKey = simple.value;
                        simpleSearchValue = this.initialQuery.param[simple.value];
                    }
                }
            }

            //这个属性如果放置未computed的话， combo变化时
            const comboModel = {};
            if (this.combo) {  //高级搜索条件处理
                for(let field of this.combo) {
                    if (field.type === 'input' || field.type === 'select' || field.type === 'date' ) {
                        //就是简单拼接 xxx=xx的条件类型
                        comboModel[field.key] = this.initialQuery.param[field.key] || null;
                    }
                }
            }

            const complexModel = {};
            if (this.combo) {  //高级搜索条件处理
                for(let field of this.combo) {
                    if (field.type === 'timequery' || field.type === 'numberquery') {
                        complexModel[field.key] = this.recoverComplexByKey(field.key, this.initialQuery, field.type);
                    }
                }
            }

            const data = {
                complexModel,
                comboModel,
                recentSearches: {   //最近简单搜索条件
                    default: [],
                },
                simpleSearch: this.simple,  //简单搜索
                comboSearch: this.combo,    //组合搜索
                simpleKey: simpleSearchKey, //简单搜索key
                simpleValue: simpleSearchValue, //简单搜索的输入值
                //显示弹出层是否显示 true为显示， false为隐藏
                searchPopoverShow: false,
            };
            return data;
        },

        watch: {
            simpleKey: function() {
                this.simpleValue = '';
            },

            simpleValue: function(val){
                this.comboModel[this.simpleKey] = val;
            }

        },

        computed: {
            /**
             * 复杂搜索的数据模型
             */
            complexModel11: function() {
                const complexModel = {};
                if (this.combo) {  //高级搜索条件处理
                    for(let field of this.combo) {
                        if (field.type === 'timequery' || field.type === 'numberquery') {
                            complexModel[field.key] = this.recoverComplexByKey(field.key, this.initialQuery, field.type);
                        }
                        /*
                        if (field.type === 'timequery') {
                            //timequery 拼接到 searchParam上， 作为复杂搜索条件
                            complexModel[field.key] = {
                                operator: 'gt',         //默认是大于
                                dateValue: '',          //单值
                                rangeValue: [],         //时间范围
                            };
                        } else if (field.type === 'numberquery') {
                            //数字范围查询 拼接到 searchParam上， 作为复杂搜索条件
                            complexModel[field.key] = {
                                operator: 'gt',         //默认是大于
                                value: '',        //单值
                                gt: '',                 //数字范围
                                lt: '',
                            };
                        }*/
                    }
                }
                return complexModel;
            },

            hasComboSearch: function() {
                return this.combo && this.combo.length;
            },

            simplePlaceHolder: function() {
                if (this.simple.length === 1) {
                    return this.simple[0].placeholder || '请输入查询条件';
                } else {
                    for(const sp of this.simple) {
                        if (sp.value === this.simpleKey) {
                            return sp.placeholder;
                        }
                    }
                }
            },
        },

        beforeCreate: function() {

        },

        beforeUpdate: function() {

        },

        methods: {

            /**
             * 拼接出前端请求参数， 见Web接口规范 --这里只拼接出简单、高级搜索的字符串
             * http://wiki.xbniao.com/pages/viewpage.action?pageId=18124599
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
                const query = {};
                query.param = {};
                query.searchParam = [];
                //快速搜索
                if (this.$refs.autocomplete) {
                    this.simpleValue = this.$refs.autocomplete.$refs.input.$refs.input.value;
                    if (validParam(this.simpleValue)) {
                        query.param[this.simpleKey] = this.trimedValue(this.simpleValue);
                    }
                }
                /**
                 * 这里进行高级搜索条件的拼接
                 */
                for(const advancedItem of this.combo) {
                    //对应 = 的操作 使用param
                    if (validParam(this.comboModel[advancedItem.key])) {
                        query.param[advancedItem.key] = this.trimedValue(this.comboModel[advancedItem.key]);
                    }
                    if (this.complexModel[advancedItem.key]) {
                        //对应对比性的操作 写入 searchParam
                        const model = this.complexModel[advancedItem.key];
                        if (model.operator === 'between') {
                            //需要拼接2个条件 大于和小于
                            //处理时间范围介于
                            if (model.rangeValue && model.rangeValue.length === 2) {
                                if (model.rangeValue[0]) {
                                    query.searchParam.push({
                                        key: advancedItem.key,
                                        operator: 'gt',
                                        value: this.formatTime(model.rangeValue[0], false)
                                    });
                                }
                                if (model.rangeValue[1]) {
                                    query.searchParam.push({
                                        key: advancedItem.key,
                                        operator: 'lt',
                                        value: this.formatTime(model.rangeValue[1], true)
                                    });
                                }
                            }
                            //处理数字介于
                            if (validParam(model.lt)) {
                                query.searchParam.push({
                                    key: advancedItem.key,
                                    operator: 'lt',
                                    value: model.lt
                                });
                            }
                            if (validParam(model.gt)) {
                                query.searchParam.push({
                                    key: advancedItem.key,
                                    operator: 'gt',
                                    value: model.gt
                                });
                            }
                        } else {
                            //大于、小于、等于 直接写入operator
                            if (model.dateValue) {          //这是时间比对输入项的处理
                                query.searchParam.push({
                                    key: advancedItem.key,             //key的值是字段名
                                    operator: model.operator,          //枚举，根据业务实际需要填写，如 ge eq lt gt ...
                                    value: this.formatTime(model.dateValue, model.operator==='gt')
                                });
                            }
                            if (validParam(model.value)) {              //直接的对比
                                query.searchParam.push({
                                    key: advancedItem.key,                          //key的值是字段名
                                    operator: model.operator,                       //枚举，根据业务实际需要填写，如 ge eq lt gt ...
                                    value: model.value  //值的范围可以是 数字，字符串，数组，对象。
                                });
                            }
                        }
                    }
                }
                return query;
            },

            /**
             * 根据传入的日期、大于小于关系将转换日期
             * operator = true，  转为当天 23:59:59
             * operator = false， 转为当天 00:00:00
             **/
            formatTime(time, operator) {
                let timeParam = DateUtils.format(time, 'yyyy-MM-dd HH:mm:ss');
                //小于 时间格式化为所选日期的 23:59:59
                if (operator) {
                    timeParam = DateUtils.format(new Date(time.getTime() + (24*60*60*1000-1)),  'yyyy-MM-dd HH:mm:ss');
                }
                return timeParam;
            },

            /**
             * 重置高级搜索栏， 在执行简单搜索时触发
             **/
            resetPoppedSearch: function() {
                for(let combo of this.comboSearch) {
                    if(this.comboModel[combo.key]) {
                        this.comboModel[combo.key] = null;
                    }
                    this.complexModel[combo.key] = this.recoverComplexByKey(null, {}, combo.type);
                }
            },

            /**
             * 根据查询条件，进而还原数据模型信息 （实际就是对时间、日期搜索进行反向抽取）
             **/
            recoverComplexByKey(field, initialQuery, type) {

                if (this.$nt.isEmpty(initialQuery.searchParam)) {
                    return this.getFieldDefaultValue(type);
                }

                const matches = [];
                for(let param of initialQuery.searchParam) {
                    if (param.key === field) {
                        matches.push(param);
                    }
                }

                if (matches.length === 2) {  //介于的条件
                    //先排序
                    matches.sort((a, b) => {
                        return a < b;
                    });
                    if (type === 'numberquery') {
                        return {
                            operator: 'between',
                            value: '',
                            gt: matches[1].value,
                            lt: matches[0].value
                        }
                    } else if (type === "timequery") {
                        return {
                            operator: 'between',
                            dateValue: '',
                            rangeValue: [new Date(matches[0].value), new Date(matches[1].value)]
                        }
                    }
                } else if (matches.length ===1) {
                    if (type === 'timequery') {
                        return {
                            operator: matches[0].operator,
                            dateValue: new Date(matches[0].value),
                            rangeValue: []
                        };
                    }
                    if (type === 'numberquery') {
                        return {
                            operator: matches[0].operator,
                            value: matches[0].value,
                            gt: '',
                            lt: ''
                        }
                    }
                } else {
                   return this.getFieldDefaultValue(type);
                }
            },

            getFieldDefaultValue(type) {
                if (type === 'timequery') {
                    return {
                        operator: 'gt',
                        dateValue: '',
                        rangeValue: []
                    }
                }
                if (type === 'numberquery') {
                    return {
                        operator: 'gt',
                        value: '',
                        gt: '',
                        lt: ''
                    }
                }
                return {}
            },

            getCurrentQuery: function() {
                return this.queryParam();
            },

            /**
             * 处理简单搜索事件
             **/
            handleSimpleSearch: async function() {
                this.resetPoppedSearch();

                //这里处理保存搜索记录到本地的工作
                const key = this.getHistoryKey();
                let historyList = this.ctx.store.get(key);
                if (!historyList) {
                    historyList = [];
                }
                const capped = new CappedArray(historyList, 8);
                if (validParam(this.simpleValue)) {
                    //搜索记录去重
                    capped.push(this.simpleValue, true);
                }
                this.ctx.store.set(key, capped.getArray());

                this.$nextTick(() => {
                    this.$emit('query', this.queryParam());
                });

                this.$refs.autocomplete.close();
            },

            onComboSearch: function() {
                this.$emit('query', this.queryParam());
                this.closeComboSearch();
            },

            closeComboSearch: function() {
                this.$refs.popComboSearch.doClose();
            },

            getHistoryKey: function() {
                //const routePath = this.$router.currentRoute.fullPath;
                return 'combo.search.history.' + this.simpleKey;
            },

            suggestions: function(queryString, callback) {
                const key = this.getHistoryKey();
                let historyList = this.ctx.store.get(key);

                if (!historyList) {
                    historyList = [];
                }

                historyList = _map(historyList, v =>{
                    return { 'value': v};
                }).reverse();

                if(this.suggestionMethod) {
                    this.suggestionMethod(queryString, function(suggestArray) {
                        callback(historyList.concat(suggestArray));
                    });
                } else {
                    callback(historyList);
                }
            },

            trimedValue(val) {
              if (this.$nt.isString(val)) {
                  return val.trim();
              } else {
                  return val;
              }
            },

            /**
             * 监听高级搜索 popover的显示和隐藏
             */
            handleComboShow: function() {
                this.searchPopoverShow = true;
            },
            /**
             * 监听高级搜索 popover的显示和隐藏
             */
            handleComboHide: function() {
                this.searchPopoverShow = false;
            }
        }
    };
</script>

