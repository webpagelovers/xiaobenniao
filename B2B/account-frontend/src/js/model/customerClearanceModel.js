X.define("model.customerClearanceModel",function () {

    var getList = X.config.customerClearance.api.getList;
    var getById = X.config.customerClearance.api.getById;
    var getExportContactsByPage = X.config.customerClearance.api.getExportContactsByPage;
    var getCompanyBankAccountListByPage = X.config.customerClearance.api.getCompanyBankAccountListByPage;
    var exportContacts = X.config.customerClearance.api.exportContacts;
    var companyBankAccount = X.config.customerClearance.api.companyBankAccount;
    var exportFormShowInfo = X.config.customerClearance.api.exportFormShowInfo;
    var getDrawerById = X.config.customerClearance.api.getDrawerById;

    var customerClearanceModel =	X.model.create("model.customerClearanceModel",{});

    //分页查询报关进度
    customerClearanceModel.getList = function(callback){
        var option = {url: getList,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };
    //根据ID查询报关详细信息
    customerClearanceModel.getById = function(exportFormId,callback){
        var option = {url: getById + exportFormId,type:"GET",callback:function(result){
            if(result.statusCode == "2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };

    //分页获取联系人信息
    customerClearanceModel.getExportContactsByPage = function(callback){
        var option = {url: getExportContactsByPage,type:"POST",callback:function(result){
                var data = result.data.list;
                callback && callback(result);
        }};

        X.loadData(option);
    };

    //存储联系人实体信息
    customerClearanceModel.saveExportContacts = function(data,callback){
        var option = {url: exportContacts,data:data,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //修改联系人信息
    customerClearanceModel.editExportContacts = function(data,callback){
        var option = {url: exportContacts,data:data,type:"PUT",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //删除联系人信息
    customerClearanceModel.deleteExportContacts = function(data, callback){
        var option = {url: exportContacts,data: data, type:"DELETE",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //分页获取公司所有的银行信息
    customerClearanceModel.getCompanyBankAccountListByPage = function(callback){
        var option = {url: getCompanyBankAccountListByPage,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //存储公司银行信息
    customerClearanceModel.saveCompanyBankAccount = function(data,callback){
        var option = {url: companyBankAccount,data:data,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //修改公司银行信息
    customerClearanceModel.editCompanyBankAccount = function(data,callback){
        var option = {url: companyBankAccount,data:data,type:"PUT",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //删除公司银行信息
    customerClearanceModel.deleteCompanyBankAccount = function(data,callback){
        var option = {url: companyBankAccount,data:data,type:"DELETE",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //根据报关单ID前台展示报关单信息以及审核流程信息Model集合
    customerClearanceModel.getExportFormShowInfo = function(exportFormId ,callback){
        var option = {url: exportFormShowInfo + exportFormId ,type:"GET",callback:function(result){
            if(result.statusCode == "2000000") {
                callback && callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };

    customerClearanceModel.getDrawerById = function(drawerId, callback){
        var option = {url: getDrawerById, type:"GET", callback: function(result){
            if (result.statusCode == "2000000") {
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    customerClearanceModel.CONSTANTS = {
        exchangeMethod:["电汇（T/T）","托收（D/P,D/A）","信用证（L/C）","信汇（M/T）","票汇（D/D）"],
        priceTerm:["FOB","CIF","C&F"],
        packageType:["整装（同一包装中只含单项产品）","混装（任一包装中含两种或以上产品）"],
        detailConfirmed:["未确定（产品信息未确定的状态下，下单后不会立即报关，客户需确认签函才能进入报关审核环节）","已确定（产品信息确定的状态下，下单成功后进入报关审核环节）"],
        packagingMaterial:["木箱","纸箱","桶装","散装","托盘","其它"],
        contractType:["客户提供合同号","商检合同号"," 系统自动生成"],
        status:["已取消","待审核","待订舱","待报关","待结汇","待退税","已完成"],
        tabType:["全部","办理中","完成","取消"],
        attribute:["自产","委托加工","外购"],
        trayType:["人造板","实木","塑料"],
        cancelStatusCon:["提交资料","资料提交成功，待审核","审核通过，待订舱","订舱完成，待报关","报关完成，待结汇","结汇完成，待退税","通关完成"],
        currencyArr:[{key:0,value:"USD"},{key:1,value:"HKD"},{key:2,value:"EUR"},{key:3,value:"CNY"},{key:4,value:"GBP"},{key:5,value:"AED"},{key:6,value:"AUD"},{key:7,value:"CAD"},{key:8,value:"CHF"},
            {key:9,value:"JPY"},{key:10,value:"NZD"},{key:11,value:"SEK"},{key:12,value:"SGD"}],
        packingAllMethodArr:[{key:0,value:"木箱"},{key:1,value:"纸箱"},{key:2,value:"桶装"},{key:3,value:"散装"},{key:4,value:"托盘"},{key:5,value:"其它"}],
        contractTypeArr:[{key:0,value:"客户提供合同号"},{key:1,value:"商检合同号"},{key:2,value:"系统自动分配"}],
        attributeArr:[{key:0,value:"自产"},{key:1,value:"委托加工"},{key:2,value:"外购"}],
        priceTermOtherArr: [{key:4,value:"EXW"},{key:5,value:"FAS"},{key:6,value:"FCA"},{key:7,value:"CPT"},{key:8,value:"CIP"},{key:9,value:"DES"},
            {key:10,value:"DAF"},{key:11,value:"DEQ"},{key:12,value:"DDP"},{key:13,value:"DDU"}],
        drawerStatus:["全部","草稿","审核中","资料待完善","审核通过","临时审核通过","审核拒绝"],
    };

    return customerClearanceModel;
});