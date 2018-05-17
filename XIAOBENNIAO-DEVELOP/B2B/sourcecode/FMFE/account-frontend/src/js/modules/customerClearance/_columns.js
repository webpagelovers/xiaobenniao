X.define('modules.customerClearance._columns', ['model.declareProductModel'], function(declareProductModel) {
   
    var addProduct = [
        {
            field:{
                name:"",
                title:'<input type="checkbox" eventType="_eventCheckBox">'
            },
            itemRenderer: {
                render: function (data) {
                    return '<input type="checkbox" class="checkItem" id="'+ data.productId +'" eventType="_eventCheckBox">'
                }
            },
            width: "10%"
        },
        {
            field: {
                name: "nameCn",
                title: "产品名称",

                isSearch: true
            },
            itemRenderer: {
                render: function (data) {
                    return '<span class="word-cut w120">'+ data.nameCn +'</span>'
                }
            },
            isShowItem: true,
            width: "12%"
        },
        {
            field: {
                name: "nameEn",
                title: "产品英文名称"
            },
            width: "16%"
        },
        {
            field: {
                name: "hsCode",
                title: "HSCode"
            },
            isShowItem: true,
            width: "10%"
        },
        {
            field: {
                name: "brand",
                title: "品牌"
            },
            isShowItem: true,
            width: "10%"
        },
        {
            field: {
                name: "texture",
                title: "材质"
            },
            width: "10%"
        },
        {
            field: {
                name: "model",
                title: "型号"
            },
            isShowItem: true,
            width: "10%"
        },
        {
            field: {
                name: "usage",
                title: "用途"
            },
            width: "10%"
        },
        {
            field: {
                name: "status",
                title: "状态"
            },
            notCheckItem: true,
            isShowItem: true,
            itemRenderer: {
                render: function(data) {
                    return declareProductModel.constants.status[data.status].value
                }
            },
            width: "10%"
        },
        {
            field: {
                name: "opp",
                title: "操作"
            },
            notCheckItem: true,
            isShowItem: true,
            itemRenderer: {
                render: function (data) {
                    return '<span class="word-cut w120 curp colff6" id="'+ data.productId +'" eventType="_eventRemove" checked="false">删除</span>'
                }
            },
            width: "10%"
        }
    ]

    var _columns = {
        addProduct: addProduct
    }

    return _columns
})

