X.define("modules.contract.fundDetails", ["model.contractModel","common.commonMethod"], function (contractModel,commonMethod) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.contract.tpl.fundDetails
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {

        var callback = function(result){
            data = result.data[0];
            data.foreignTradeAmount = commonMethod.formatMoney(data.foreignTradeAmount,2,true);
            data.settlementRmb = commonMethod.formatMoney(data.settlementRmb,2,true);
            data.refundAmount = commonMethod.formatMoney(data.refundAmount,2,true);
            data.receivableForeignTradeAmount = commonMethod.formatMoney(data.receivableForeignTradeAmount,2,true);
            data.settlementExtractAmount = commonMethod.formatMoney(data.settlementExtractAmount,2,true);
            data.refundExtractAmount = commonMethod.formatMoney(data.refundExtractAmount,2,true);
            data.exchangeRate = commonMethod.formatMoney(data.exchangeRate,4);


            $.addTemplateFormatter({
                //币种
                currencyFormater: function (value, template) {
                    var item = contractModel.getItemById(Number(value),"key",contractModel.constants.currencyArr);
                    if(item){
                        return item.value;
                    }
                }
            });

            return view.render(data, function () {});

        };
        var data = {
            exportFormId : _para["exportFormId"]
        };
        //获取账户资金信息
        contractModel.getAcountDetailInfo(data,callback);
    };


    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;

});