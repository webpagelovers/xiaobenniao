X.define('modules.purchaseInfo.matchInfo_columns', ['model.purchaseInfoModel'], function(model) {

	var filterDataColumns = [
        {
            field:{
                name:"title",
                title:"标题"
            },
            itemRenderer: {
                render: function(data) {
                    return '<span class="word-cut" style="width: 460px;" title="'+ data.title +'">'+ data.title +'</span>'
                }
            },
            width:"20%"
        },
        {
            field:{
                name:"country",
                title:"国别"
            },
            /*itemRenderer: {
                render: function(data) {
                    return '<span class="word-cut w120" title="'+ data.purchaserName +'">'+ data.purchaserName +'</span>'
                }
            },*/
            width:"8%"
        },
        {
            field:{
                name:"createDate",
                title:"发布日期"
            },
            width:"8%"
        },
        {
            field:{
                name:"purchaseNum",
                title:"采购数量"
            },
            /*itemRenderer: {
                render: function(data) {
                    return '<span class="word-cut w120" title="'+ data.deliveryAddress +'">'+ data.deliveryAddress +'</span>'
                }
            },*/
            width:"8%"
        },
        {
            field:{
                name:"productsCategory",
                title:"类型"
            },
            /*itemRenderer: {
                render: function(data) {
                    return data.productsCategory? data.productsCategory.split: ''
                }
            },*/
            width:"20%"
        }
        /*{
            field:{
                name:"infoType",
                title:"类型"
            },
            itemRenderer: {
            	render: function(data) {
            		return model.infoTypeArr[data.infoType]
            	}
            },
            width:"10%"
        }*/
    ]

    var matchPeopleColumns = [
        {
            field:{
                name:"userId",
                title:"用户ID"
            },
            width:"10%",
        },
        {
            field:{
                name:"userName",
                title:"用户姓名"
            },
            width:"10%"
        },
        {
            field:{
                name:"mobile",
                title:"用户手机号"
            },
            width:"10%"
        },
        {
            field:{
                name:"companyNameCn",
                title:"公司名称"
            },
            width:"10%"
        },
        {
            field:{
                name:"memberType",
                title:"会员种类"
            },
             itemRenderer: {
            	render: function(data) {
            		return model.memberTypeArr[data.memberType]
            	}
            },
            width:"10%"
        }
    ]

	var filterData = {
        searchMeta: {
            search: {
                onSearch: function (data,searcher,click) {
                    if (data.query.createDate) {
                        var dd = data.query.createDate.split('@')
                        data.query.beginTime = dd[0]
                        data.query.endTime   = dd[1]
                        delete data.query.createDate
                    }
                    return data
                }
            },
            schema:{
                simple: [
                    {
                        name:"title",
                        title:"名称",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"createDate",
                        title:"发布日期",
                        ctrlType: "DateRangePicker"
                    }
                ]
            }
        },
        toolbar: {
            selector: '.toolbar-good',
            items: [
                {
                    ctrlType:"ToolbarButton",
                    title:'<input type="checkbox" kind="allAll" style="margin:0 9px;"><span>选择所有筛选数据</span>'
                }
            ]
        },
        gridMeta: {
            columns: [
                {
                    field:{
                        name:"filterDataCheckbox",
                        title:'<input type="checkbox" kind="itemsAll">'
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<input type="checkbox" id="'+ data.purchaseInfoId +'">'
                        }
                    },
                    width:"5%"
                }
            ]
            .concat(filterDataColumns)
            .concat(
                [
                    {
                        field:{
                            name:"third",
                            title:"操作"
                        },
                        itemRenderer: {
                            render: function(data) {
                            	return '<span class="c009add filterDataDetail" id="'+ data.purchaseInfoId +'">详情</span>'
                            }
                        },
                        width:"10%"
                    }
                ]
            ),
	        afterTableRender: function() {
        		model.clickOtherPage()
        	}
        },
        pageInfo: {
            pageSize : '10',
            pageNo : '1'
        },
        url: X.config.purchaseInfo.api.filterData
    }

    var matchPeople = {
        searchMeta: {
            search: {
                onSearch: function (data,searcher,click) {
                    if(data.query.userId && isNaN(data.query.userId)){
                        data.query.userId = -1;
                    }
                    return data
                },
            },
            schema:{
                simple: [
                    {
                        name:"userId",
                        title:"用户ID",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"userName",
                        title:"用户姓名",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"mobile",
                        title:"用户手机号",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"companyNameCn",
                        title:"公司名称",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"memberType",
                        title:"会员种类",
                        ctrlType: "ComboBox",
                        dataSource: model.memberType
                    }
                ]
            }
        },
        toolbar: {
            selector: '.toolbar-good',
            items: [
                {
                    ctrlType:"ToolbarButton",
                    title:'<input type="checkbox" kind="allAll" style="margin:0 22px;"><span>选择所有匹配信息</span>'
                }
            ]
        },
        gridMeta: {
            columns: [
                {
                    field:{
                        name:"filterDataCheckbox",
                        title:'<input type="checkbox" kind="itemsAll">'
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<input type="checkbox" id="'+ data.supplierCompanyId +'">'
                        }
                    },
                    width:"4%"
                }
            ]
            .concat(matchPeopleColumns),
            afterTableRender: function() {
        		model.clickOtherPage()
        	}
        },
        pageInfo: {
            pageSize : '10',
            pageNo : '1'
        },
        url: X.config.purchaseInfo.api.matchPeople
    }

    var matchedFilterData = {
        gridMeta: {
            columns: filterDataColumns
        },
        pageInfo: {
            pageSize : '10',
            pageNo : '1'
        }
    }

    var matchedPeople = {
        gridMeta: {
            columns: matchPeopleColumns
        },
        pageInfo: {
            pageSize : '10',
            pageNo : '1'
        }
    }

    var matchRecord = {
        searchMeta: {
            search: {
                onSearch: function(data) {
                    if (data.query.matchingDate) {
                        var dd = data.query.matchingDate.split('@')
                        data.query.beginTime = dd[0]
                        data.query.endTime   = dd[1]
                        delete data.query.matchingDate
                    }
                    if(data.query.userId && isNaN(data.query.userId)){
                        data.query.userId = -1;
                    }
                    return data
                }
            },
            schema: {
                simple: [
                    {
                        name:"userId",
                        title:"用户ID",
                        ctrlType: "TextBox",
                        className: "w130"
                    },
                    {
                        name:"mobile",
                        title:"手机号",
                        ctrlType: "TextBox",
                        className: "w130"
                    },
                    {
                        name:"userName",
                        title:"姓名",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"companyNameCn",
                        title:"所属公司",
                        ctrlType: "TextBox",
                        className: "w160"
                    },
                    {
                        name:"matchingDate",
                        title:"匹配日期",
                        ctrlType: "DateRangePicker"
                    }
                ]
            }
        },
        gridMeta: {
            columns: [
                {
                    field:{
                        name:"userId",
                        title:"用户ID"
                    },
                    width:"10%",
                },
                {
                    field:{
                        name:"mobile",
                        title:"手机号"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"userName",
                        title:"姓名"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"companyNameCn",
                        title:"所属公司"
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"matchingCount",
                        title:"匹配数量（条）"
                    },
                    width:"10%",
                },
                {
                    field:{
                        name:"",
                        title:"操作"
                    },
                    itemRenderer: {
                        render: function(data) {
                            return '<span class="c009add cup matchRecordDetail" id="'+ data.purchaseInfoIds +'" supplierCompanyId="'+ data.supplierCompanyId +'">详情</span>'
                        }
                    },
                    width:"10%"
                }
            ]
        },
        pageInfo: {
            pageNo: '1',
            pageSize: '10'
        },
        url: X.config.purchaseInfo.api.recordList
    }

    var recordDetail = {
        searchMeta: {
            search: {
                onSearch: function(data) {
                    data.query.purchaseInfoIds   = recordDetail.purchaseInfoIds
                    data.query.supplierCompanyId = recordDetail.supplierCompanyId
                    return data
                }
            }
        },
        gridMeta: {
            columns: []
                .concat(filterDataColumns)
                .concat(
                    {
                        field:{
                            name:"matchingDate",
                            title:"匹配日期"
                        },
                        width:"10%",
                    },
                    {
                        field:{
                            name:"userName",
                            title:"操作员姓名"
                        },
                        width:"10%",
                    },
                    {
                        field:{
                            name:"third",
                            title:"操作"
                        },
                        itemRenderer: {
                            render: function(data) {
                                return '<span class="c009add filterDataDetail" id="'+ data.purchaseInfoId +'">详情</span>'
                            }
                        },
                        width:"10%"
                    }
                )
        },
        pageInfo: {
            pageNo: '1',
            pageSize: '10'
        },
        url: X.config.purchaseInfo.api.recordDetail
    }

    var columns = {
    	filterData: 		filterData,
    	matchPeople: 		matchPeople,
    	matchedFilterData: 	matchedFilterData,
    	matchedPeople: 		matchedPeople,
        filterDataColumns:  filterDataColumns,
        matchRecord:        matchRecord,
        recordDetail:       recordDetail
    }
	
	return columns
})