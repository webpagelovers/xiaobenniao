X.define("model.companyModel",function () {

    //临时测试数据
    var query = "js/data/mockData/bidList.json";
    var checkCompanyType = X.config.company.api.checkCompanyType;
    var companyInfo = X.config.accountSettings.api.companyInfo;
    var companySave = X.config.accountSettings.api.companyInfoSave;

    var companyModel =	X.model.create("model.companyModel",{idAttribute:"tenderId",service:{query:query}});

    //提交公司logo
    companyModel.putLogoUrl = function(data,callback){
        var option = {url: X.config.company.api.logoUrl,data:data,type:"PUT",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //checkCompanyType
    companyModel.checkCompanyType = function (callback) {
        var option = {
            url: checkCompanyType, type: "GET", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback(result.data[0]);
                }
            }
        };
        X.loadData(option);
    };
    //获取登录用户的企业信息
    companyModel.getCompanyInfo = function (callback) {
        var option = {
            url: companyInfo, type: "GET", callback: function (result) {
                if (result.statusCode == "2000000") {
                    callback && callback(result);
                }
            }
        };
        X.loadData(option);
    };
    //编辑企业信息
    companyModel.companyBaseEdit = function (data,callback) {
        var option = {data:data,url:companyInfo,type:"PUT",callback:function(result){
            if(result.statusCode=="2000000") {
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };
    //企业信息实时保存
    companyModel.companyInfoSave = function (data,callback) {
        var option = {data:data,url:companySave,type:"PUT",callback:function(result){
            if(result.statusCode=="2000000") {
                callback&&callback(result);
            }
        }};

        X.loadData(option);
    };
    companyModel.CONSTANT = {
        status :{
            NOAUDIT : { key : "0", text :"未审核" },
            APPROVED : { key : "1", text :"审核通过" },
            REJECTED : { key : "2", text :"审核未通过" },
            DELETED : { key : "3", text :"已删除" },
            EDITING : { key : "4", text :"编辑中" }
        },
        lincenseType:{
            LINCENSECODE:{ key : "0", text :"营业执照" },
            CREDIT:{ key : "1", text :"社会统一代码" },
            ORGANIZTION :{ key : "2", text :"组织机构代码证" },
            TAXCODE:{ key : "3", text :"税务登记证" },
            ENTRY:{ key : "4", text :"入驻许可证" },
            AUTHORIZATION:{key : "5", text :"企业授权书" },
            OTHERS:{key : "6", text :"其他" }
        },
        enterprise:{
            SUPPLIER: { key : "0", text :"供应商" },
            PURCHASEERS:{ key : "1", text :"采购商" },
            BOTH:{ key : "2", text :"即是供应商又是采购商" }
        },
        cardType:{
            FIVE: { key : "0", text :"五证企业" },
            ONETHREE:{ key : "1", text :"三证合一" },
            ONEFIVE:{ key : "2", text :"五证合一" }
        }

    };


    return companyModel;
});

