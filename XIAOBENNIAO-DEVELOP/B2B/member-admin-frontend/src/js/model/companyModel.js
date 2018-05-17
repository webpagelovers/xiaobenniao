X.define("model.companyModel",function () {

    var query = X.config.supplier.api.listByPage;
    //var find = X.config.supplier.api.getSupplierById;
    var audit = X.config.supplier.api.audit;
    var find = X.config.purchasers.api.purchasersEdit;
    var revise = X.config.purchasers.api.purchasersEdit;
    var companyModel =	X.model.create("model.companyModel",{idAttribute:"companyId",service:{query:query,find:find}});


    //企业信息审核状态
    companyModel.audit = function (data,callback) {
        var option = {data:data,url:audit,type:"PUT",callback:function(){
            console.log("提交成功");
            X.router.back();
            callback&&callback();
        }};

        X.loadData(option);
    };
    //添加采购商
    companyModel.register = function (data,callback) {
        var option = {data:data,url:X.config.purchasers.api.purchasersEdit,type:"POST",callback:function(result){
            if(result.statusCode="2000000") {
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };

    //    修改采购商公司信息
    companyModel.companyBase = function (data,callback) {
        var option = {data:data,url: X.config.purchasers.api.companyBase,type:"PUT",callback:function(result){
            if(result.statusCode="2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };
    //    修改采购商执照信息
    companyModel.companyLicenses = function (data,callback) {
        var option = {data:data,url: X.config.purchasers.api.companyLicenses,type:"PUT",callback:function(result){
            if(result.statusCode="2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };

    companyModel.const = {
        status :{
            NOAUDIT : { key : "0", text :"待审核" },
            APPROVED : { key : "1", text :"通过" },
            REJECTED : { key : "2", text :"驳回" },
            DELETED : { key : "3", text :"已删除" },
            EDIT : { key : "4", text :"编辑中" }
        },
        lincenseType:{
            LINCENSECODE:{ key : "0", text :"营业执照" },
            CREDIT:{ key : "1", text :"社会统一代码" },
            ORGANIZTION :{ key : "2", text :"组织机构代码证" },
            TAXCODE:{ key : "3", text :"税务登记证" },
            ENTRY:{ key : "4", text :"入驻许可证" }
        },
        enterprise:{
            SUPPLIER: { key : "0", text :"供应商" },
            PURCHASEERS:{ key : "1", text :"采购商" },
            BOTH:{ key : "2", text :"即是供应商又是采购商" }
        },
        companyType:[
            { key : "", value :"全部会员" },
            { key : 0, value :"普通会员" },
            { key : 1, value :"付费会员" }
        ]
    };

    return companyModel;
});
