X.define("model.customerClearanceModel",function () {

    var getList = X.config.customerClearance.api.getList;
    var getById = X.config.customerClearance.api.getById;
    var getExportGoodsList = X.config.customerClearance.api.getExportGoodsList;
    var find = X.config.customerClearance.api.getExportFormId;

    var customerClearanceModel =X.model.create("model.customerClearanceModel",{idAttribute:"exportFormId",service:{find:find}});

    //
    customerClearanceModel.getList = function(callback){
        var option = {url: getList,type:"POST",callback:function(result){
            if(result.statusCode == "2000000") {
                var data = result.data.list;
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };
    //根据
    customerClearanceModel.getById = function(exportFormId,callback){
        var option = {url: getById + exportFormId,type:"GET",callback:function(result){
            if(result.statusCode == "2000000"){
                callback&&callback(result.data[0]);
            }
        }};

        X.loadData(option);
    };


    //提交报关资料审核
    customerClearanceModel.reviewRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.declarationAudit,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //提交订舱资料 clearanceRegister
    customerClearanceModel.bookingRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.createExportBooking,type:"POST",callback:function(result){
            callback&&callback(result);
        }};
        X.loadData(option);
    };
    //提交报关资料 clearanceRegister
    customerClearanceModel.clearanceRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.declare,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    //提交结汇资料 clearanceRegister
    customerClearanceModel.conversionRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.settlement,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };
    //提交退税资料
    customerClearanceModel.drawbackRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.refund,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    //取消
    customerClearanceModel.cancelRegister = function(data,callback){
        var option = {data:data,url:X.config.customerClearance.api.createCancelExport,type:"POST",callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    customerClearanceModel.const = {
        exchangeMethod:["电汇（T/T）","托收（D/P,D/A）","信用证（L/C）","信汇（M/T）","票汇（D/D）"],
        priceTerm:["FOB","CIF","C&F","其它","EXW","FAS","FCA","CPT","CIP","DES","DAF","DEQ","DDP","DDU"],
        packageType:["整装","混装（任一包装中含两种或以上产品）"],
        detailConfirmed:["未确定（产品信息未确定的状态下，下单后不会立即报关，客户需确认签函才能进入报关审核环节）","已确定（产品信息确定的状态下，下单成功后进入报关审核环节）"],
        packagingMaterial:["木箱","纸箱","桶装","散装","托盘","其它"],
        contractType:["客户提供合同号","商检合同号"," 系统自动生成"],
        exportGoods:{
            attribute:["自产","委托加工","外购"]
        },
        status:["已取消","待审核","待订舱","待报关","待结汇","待退税","已完成"],
        tabAllStatus:["全部","已取消","待审核","待订舱","待报关","待结汇","待退税","已完成"],
        tendingStatus:["全部","待审核","待订舱","待报关","待结汇","待退税"],
        tabType:["全部","办理中","完成","取消"],
        containerType:["20尺普柜","40尺普柜","40尺高柜"],
        containerCount:["1","2","3","4"],
        trayType:["人造板","实木","塑料"],
        exchangeMethodArr:[{key:0,value:"电汇（T/T）"},{key:1,value:"托收（D/P,D/A）"},{key:2,value:"信用证（L/C）"},{key:3,value:"信汇（M/T）"},{key:4,value:"票汇（D/D）"}],
        priceTermArr:[{key:4,value:"EXW"},{key:5,value:"FAS"},{key:6,value:"FCA"},{key:7,value:"CPT"},{key:8,value:"CIP"},{key:9,value:"DES"},{key:10,value:"DAF"},{key:11,value:"DEQ"},{key:12,value:"DDP"},{key:13,value:"DDU"}],
        currencyArr:[{key:0,value:"USD"},{key:1,value:"HKD"},{key:2,value:"EUR"},{key:3,value:"CNY"},{key:4,value:"GBP"},{key:5,value:"AED"},{key:6,value:"AUD"},{key:7,value:"CAD"},{key:8,value:"CHF"},
            {key:9,value:"JPY"},{key:10,value:"NZD"},{key:11,value:"SEK"},{key:12,value:"SGD"}],
        packingAllMethodArr:[{key:0,value:"木箱"},{key:1,value:"纸箱"},{key:2,value:"桶装"},{key:3,value:"散装"},{key:4,value:"托盘"},{key:5,value:"其它"}],
        contractTypeArr:[{key:0,value:"客户提供合同号"},{key:1,value:"商检合同号"},{key:2,value:"系统自动分配"}],
        attributeArr:[{key:0,value:"自产"},{key:1,value:"委托加工"},{key:2,value:"外购"}],
	    containerSizeArr:[{key: 0, value: "20尺普柜"}, {key: 1, value: "40尺普柜"}, {key: 2, value: "40尺高柜"}],
        containerNumArr : [{key: 0, value: "1"}, {key: 1, value: "2"}, {key: 2, value: "3"}, {key: 3, value: "4"}],
        declarationStatus:{
            CANCEL:{key:0,text:"已取消"},
            REVIEW:{key:1,text:"报关资料待审核"},
            BOOKING:{key:2,text:"待订舱"},
            CLEARANCE:{key:3,text:"待报关"},
            CONVERSION:{key:4,text:"待结汇"},
            DRAWBACK:{key:5,text:"退税"},
            COMPLETE:{key:6,text:"已完成"}
        }
    };

    return customerClearanceModel;
});