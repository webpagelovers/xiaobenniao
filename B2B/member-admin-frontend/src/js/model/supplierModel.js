X.define("model.supplierModel",function () {

    var query = X.config.supplier.api.listByPage;
    var find = X.config.supplier.api.getSupplierById;
    var audit = X.config.supplier.api.audit;

    var supplierModel =	X.model.create("model.supplierModel",{idAttribute:"supplierId",service:{query:query,find:find}});


    //企业信息审核状态
    supplierModel.audit = function (data,callback) {

        var option = {data:data,url:audit,type:"POST",callback:function(result){
            console.log("提交成功");
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    supplierModel.const = {
        status :{
            NOAUDIT : { key : "0", text :"未审核" },
            APPROVED : { key : "1", text :"审核通过" },
            REJECTED : { key : "2", text :"审核未通过" },
            DELETED : { key : "3", text :"已删除" }
        }
    }

    return supplierModel;
});
