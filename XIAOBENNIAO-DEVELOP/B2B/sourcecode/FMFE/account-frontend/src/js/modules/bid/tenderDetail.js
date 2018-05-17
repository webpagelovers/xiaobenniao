X.define("modules.bid.tenderDetail",["model.bidModel","model.publicBidModel","common.layer","adapter.webuploader","adapter.underscore","data.addressData","modules.common.moment"],function (bidModel,publicBidModel,layer,webuploader,underscore,addressData,moment) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.bid.tpl.tenderDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.initControl = function (id) {};

    ctrl.rendering = function () {
        var callback = function(result){
            var data = result.data[0];
            switch(Number(data.tenderStatus)){
                case bidModel.CONSTANTS.tenderStatus.TENDER.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.TENDER.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.BIDOPEN.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.BIDOPEN.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.END.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.END.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.SIGN.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.SIGN.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.INSTANCE.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.INSTANCE.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.WASTE.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.WASTE.value;
                    break;
                case bidModel.CONSTANTS.tenderStatus.FLOWMARK.key:
                    data.tenderStatus = bidModel.CONSTANTS.tenderStatus.FLOWMARK.value;
                    break;
            }
            switch(Number(data.tenderType)){
                case 0:
                    data.tenderType = "公开招标";
                    break;
                case 1:
                    data.tenderType = "邀请招标";
                    break;
            }
            return view.render(data,function () {
                var activeTabLiInfo;

                if(data.tenderStatus =="报名中" || data.tenderStatus =="资审中" || data.applyResult == 0){
                    ctrl.view.el.find(".js-sign").css("display","block");
                    ctrl.view.el.find(".js-detail").css("display","none");
                    activeTabLiInfo ="tabReview";
                    ctrl.initPage(activeTabLiInfo,data,$('.js_tabPannel2'));
                }else if(data.tenderStatus !="资审中" && data.applyResult == 1){
                    ctrl.view.el.find(".js-sign").css("display","none");
                    ctrl.view.el.find(".js-detail").css("display","block");
                    activeTabLiInfo ="tabTenderDetail";
                    ctrl.initPage(activeTabLiInfo,data,$('.js_tabPannel1'));
                }

                if(data["applyDate"] && data.noticeable ==1){
                    ctrl.view.el.find(".js-new").css("display","inline-block");
                }

                var currentStatus = ctrl.view.el.find(".js-currentStatus");
                var applyDueDate = ctrl.view.el.find(".js-applyDueDate");
                var purchaseBidsDueDate = ctrl.view.el.find(".js-purchaseBidsDueDate");
                switch(data.tenderStatus){
                    case "报名中":
                        purchaseBidsDueDate.remove();
                        if(data.isTerminated =="1"){
                            currentStatus.html("废标");
                        }
                        break;
                    case "资审中":
                        purchaseBidsDueDate.remove();
                        if(data.isTerminated =="1"){
                            currentStatus.html("废标");
                        }
                        break;
                    case "投标中":
                        applyDueDate.remove();
                        if(data.isTerminated =="1"){
                            currentStatus.html("废标");
                        }
                        break;
                    case "开标中":
                        applyDueDate.remove();
                        if(data.isTerminated =="1"){
                            currentStatus.html("废标");
                        }
                        break;
                    case "已结束":
                        applyDueDate.remove();
                        if(data.isTerminated =="1"){
                            currentStatus.html("废标");
                        }else if(data.winBid == "1"){
                            ctrl.view.el.find(".js-winWrap").html('<img class="poa" src="images/winner.png" style="left:-20px;top:-5px">');
                        }
                        ctrl.view.el.find(".js-buttons").css("display","none");
                        break;
                }
                $('.js-basicInfoForm span.textOverflowEllippsis').attr('title',function(){
                    return $(this).text();
                });
            });
        };

        ctrl.getData(callback);
    };

    //获取我的招标信息详情
    ctrl.getData = function(callback){
        var data = {
           tenderId:_para["tenderId"]
        };
        bidModel.getTenderIdItem(data,callback);
    };

    /*--资审中，报名中--*/
    function initTabPageSign($elem,tabPage,data) {
        var tabReviewData = data;
        switch(tabPage){
            case "tabReview":
                var tabReviewF = function(){
                    //上传文件
                    var upload =  X.controls.getControl("WebUpload",$elem.find(".js-webUpload"), {size: 100,type:3,downloadType:1,maxNum:20,filePicker:".filePicker"});
                    upload.init();

                    var callback = function(result){
                        //招标文件下载

                        var biddingAttachment = ctrl.view.el.find(".js-biddingAttachment");
                        var wrapBiddingAttachment = biddingAttachment.find(".js-wrapAttachment");
                        var wrapQualification = ctrl.view.el.find(".js-wrapQualification");
                        var uploadUrl = X.config.PATH_FILE.path.rootUploadUrl;
                        var uploadFunction = function(data,num,elem){
                            $.each(data,function(i,item){
                                var a = '<a href="'+uploadUrl+'?fileType='+num+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory orange-font">'+item.filename+'</a>';
                                $(elem).append(a);
                            });
                        };
                        wrapBiddingAttachment.html("");
                        uploadFunction(result.data[0].tenderApplyAttachmentList,0,wrapBiddingAttachment);

                        //公告内容
                        var tenderContent = ctrl.view.el.find(".js-tenderContent");
                        tenderContent.html(result.data[0].applyAnnouncement);

                        var getSign = function(){
                            upload.reset();
                            upload.setValue(result.data[0].biddingApplyAttachmentList);
                            ctrl.errorLength = function(){
                                var wrapError = biddingAttachment.find(".js-error");
                                var wrapErrorHtml;
                                var array = [];
                                $.each(wrapError,function(){
                                    wrapErrorHtml = $(this).html();
                                    if(wrapErrorHtml == ""){
                                        array.push(true);
                                    }else{
                                        array.push(false);
                                    }
                                });
                                if($.inArray(false, array) == -1){
                                    return true;
                                }else{
                                    return false;
                                }
                            };
                            ctrl.signUp = function(){
                                var attachData = upload.getValue("0");
                                if(attachData.length > 0 && ctrl.errorLength()){
                                    var data;
                                    var oData;
                                    var callback;
                                    var applyDueDate = Date.parse(moment(result.data[0]["applyDueDate"]));
                                    var currentDataTime = Date.parse(new Date());
                                    if(applyDueDate > currentDataTime){
                                        if(result.data[0]["biddingId"]){
                                            //修改资审报名
                                            data = {
                                                tenderId:_para["tenderId"],
                                                biddingId:result.data[0]["biddingId"],
                                                companyId:result.data[0].biddingCompanyId,
                                                biddingAttachmentList:upload.getValue("0")
                                            };
                                            oData = result.data[0].biddingApplyAttachmentList;
                                            $.each(oData, function(i,item){
                                                delete oData[i]["attachmentId"];
                                                delete oData[i]["biddingId"];
                                            });
                                            if(_.isEqual(data.biddingAttachmentList,oData) == false){
                                                callback = function(result){
                                                    if(result.statusCode ==2000000) {
                                                        layer.successMsg("报名提交成功", function (number) {
                                                            layer.closeIt(number);
                                                            X.router.back();
                                                        },"auto");
                                                    }else{
                                                        layer.warnMsg(result.message, function (number) {
                                                            //状态异常时，刷新当前页
                                                            ctrl.rendering();
                                                            layer.closeIt(number);
                                                        });
                                                    }
                                                };
                                                //提交资审报名
                                                bidModel.qualificationApply(data,callback);
                                            }else{
                                                layer.warnMsg("提交内容未更改，不能重复提交", function (number) {
                                                    layer.closeIt(number);
                                                });
                                            }
                                        }else{
                                            //新增资审报名
                                            data = {
                                                tenderId:_para["tenderId"],
                                                companyId:result.data[0].biddingCompanyId,
                                                biddingAttachmentList:upload.getValue("0")
                                            };
                                            oData = result.data[0].biddingApplyAttachmentList;
                                            $.each(oData, function(i,item){
                                                delete oData[i]["attachmentId"];
                                                delete oData[i]["biddingId"];
                                            });
                                            if(_.isEqual(data.biddingAttachmentList,oData) == false){
                                                callback = function(result) {
                                                    if (result.statusCode == 2000000) {
                                                        layer.successMsg("报名提交成功", function (number) {
                                                            layer.closeIt(number);
                                                            X.router.back();
                                                        },"auto");
                                                    }else{
                                                        layer.warnMsg(result.message, function (number) {
                                                            //状态异常时，刷新当前页
                                                            ctrl.rendering();
                                                            layer.closeIt(number);
                                                        });
                                                    }
                                                };
                                                bidModel.postQualificationApply(data,callback);
                                            }else{
                                                layer.warnMsg("提交内容未更改，不能重复提交", function (number) {
                                                    layer.closeIt(number);
                                                });
                                            }
                                        }
                                    }else{
                                        layer.warnMsg("报名时间已结束，不能报名", function (number) {
                                            layer.closeIt(number);
                                        });
                                    }
                                }else{
                                    if(attachData.length > 0){

                                    }else{
                                        var wrapbiddingAttachment = ctrl.view.el.find(".js-biddingAttachment");
                                        var wrapAttachError = wrapbiddingAttachment.find(".js-attachError");
                                        var error = '<label class="error">附件不能为空</label>';
                                        $(error).appendTo(wrapAttachError);
                                        if(wrapAttachError.html()){

                                        }else{
                                            var error = '<label class="error">附件不能为空</label>';
                                            $(error).appendTo(wrapAttachError);
                                        }
                                    }
                                }
                            };
                            ctrl.addEvent("click", ".js-signUp", "signUp");
                        };
                        if(result.data[0]["applyDate"]){
                            getSign();
                            if(result.data[0].tenderStatus == "5" || result.data[0].applyResult){
                                ctrl.view.el.find(".js-signUp").css("display","none");
                                ctrl.view.el.find(".js-capitalAudit").css("display","none");

                                if(result.data[0].applyResult){
                                    var cancelAN = biddingAttachment.find(".cancel");
                                    cancelAN.css("display","none");
                                    if(result.data[0].applyResult =="1"){
                                        ctrl.view.el.find(".js-adopt").css("display","block");
                                        ctrl.view.el.find(".js-noAdopt").css("display","none");
                                    }else if(result.data[0].applyResult =="0"){
                                        ctrl.view.el.find(".js-adopt").css("display","none");
                                        ctrl.view.el.find(".js-noAdopt").css("display","block");
                                        var noAdoptReason = ctrl.view.el.find(".js-noAdoptReason");
                                        noAdoptReason.html(result.data[0].applyResultNote);
                                    }
                                }
                            }
                        }else if(result.data[0].tenderStatus !== "4"){
                            ctrl.view.el.find(".js-signUp").css("display","none");
                            ctrl.view.el.find(".js-capitalAudit").css("display","none");
                        }else{
                            getSign();
                            if(tabReviewData.isTerminated == "1"){
                                ctrl.view.el.find(".js-signUp").css("display","none");
                                ctrl.view.el.find(".js-capitalAudit").css("display","none");
                            }
                        }
                    };
                    var getData = {
                        tenderId:_para["tenderId"]
                    };
                    //获取资审公告
                    bidModel.qualificationInfo(getData,callback);
                };
                tabReviewF();
                break;
            case "tabChangeData":
                if(tabReviewData["applyDate"]){
                    var noticeData = {
                        tenderId:_para["tenderId"]
                    };
                    var noticeCallback = function(result){
                        if(result.statusCode == 2000000) {
                            ctrl.view.el.find(".js-new").css("display", "none");
                            var callback = function(result){
                                var tabDataGrid =  X.controls.getControl("TabDataGrid",$elem,{dataSource:result,getHeaderF:function(){
                                    var header = (function () {
                                        var mapField = {
                                            fieldName:[
                                                {key:'tenderName',value:'招标名称'},
                                                {key:'purchaseBidsDueDate',value:'投标截止时间'},
                                                {key:'contact',value:'联系人'},
                                                {key:'productCategory',value:'货品类别'},
                                                {key:'purchaseProvince',value:'采购地区省'},
                                                {key:'purchaseCity',value:'采购地区市'},
                                                {key:'contactPhone',value:'联系人电话'},
                                                {key:'tenderType',value:'招标形式'},
                                                {key:'qualificationType',value:'资审形式'},
                                                {key:'tenderNum',value:'招标编号'},
                                                {key:'contactEmail',value:'EMAIL'},
                                                {key:'purchaseBudget',value:'采购预算'},
                                                {key:'TechnicalProvision',value:'技术条款'},
                                                {key:'TenderItem',value:'招标货品清单'},
                                                {key:'BusinessProvision',value:'商务条款'},
                                                {key:'TenderAttachment',value:'招标附件'},
                                                {key:'applyAttachmentList',value:'资审附件'},
                                                {key:'applyDueDate',value:'报名截止时间'},
                                                {key:'applyAnnouncement',value:'预审公告'},
                                                {key:'ApplyAttachment',value:'预审附件'},
                                                {key:'bulletin',value:'公告内容'},
                                                {key:'comment',value:'变更说明'},
                                                {key:'name',value:'货品名称'},
                                                {key:'count',value:'数量'},
                                                {key:'model',value:'型号'},
                                                {key:'label',value:'条款标号'},
                                                {key:'overview',value:'条款概要'},
                                                {key:'remark',value:'备注'},
                                                {key:'content',value:'供应商响应'}
                                            ],
                                            getCnField: function(field){
                                                var items = this["fieldName"];
                                                for(var i = 0; i < items.length; i++ ){
                                                    if(items[i]["key"]==field){
                                                        return items[i]["value"]
                                                    }
                                                }
                                            }
                                        };
                                        return {
                                            "tenderHistoryItemList": [
                                                {
                                                    field:{
                                                        name:"orderid",
                                                        title:"序号",
                                                        type:"int"
                                                    },
                                                    width:"3%",
                                                    className:"tL"
                                                },
                                                {
                                                    field:{
                                                        name: "overview",
                                                        title:"变更内容",
                                                        type:"string"
                                                    },
                                                    itemRenderer:{
                                                        render: function(data, field, index, grid){
                                                            if(data.currentData){
                                                                if(data.updateItem == "purchaseProvince"){
                                                                    return mapField.getCnField(data.updateItem)+":变更为"+ addressData.getPro(data.currentData);
                                                                }else if(data.updateItem == "purchaseCity"){
                                                                    return mapField.getCnField(data.updateItem)+":变更为"+ addressData.getCity(data.currentData);
                                                                }else{
                                                                    return mapField.getCnField(data.updateItem)+":变更为"+ data.currentData;
                                                                }
                                                            }else{
                                                                return mapField.getCnField(data.updateItem)+":变更";
                                                            }
                                                        }
                                                    },
                                                    width:"12%"
                                                }
                                            ]
                                        }
                                    })();
                                    return header;
                                }});
                                tabDataGrid.init();
                            };

                            var data = {tenderId:_para["tenderId"]};
                            bidModel.getQualification(data,callback);
                        }
                    };
                    bidModel.clearNotice(noticeData,noticeCallback);
                }
                break;
        }
    }
    /*--资审中，报名中--*/

    /*---投标中，开标中,已结束---*/
    function initTabPage($elem,tabPage,data) {
        var getBiddingIdData = data;
        switch(tabPage){
            case "tabTenderDetail":
                var header = (function () {
                    return {
                        "tenderItemList" :  [
                            {
                                field:{
                                    name:"",
                                    title:"序号",
                                    type:"int"
                                },
                                width:"10%",
                                className:"tL"
                            },
                            {
                                field:{
                                    name: "name",
                                    title:"货品名称",
                                    type:"string"
                                },
                                width:"12%"
                            },
                            {
                                field:{
                                    name:"count",
                                    title:"数量",
                                    type:"string"
                                },
                                width:"7%"
                            },
                            {
                                field:{
                                    name:"unit",
                                    title:"单位",
                                    type:"string"
                                },
                                width:"7%"
                            },
                            {
                                field:{
                                    name:"model",
                                    title:"规格型号",
                                    type:"string"
                                },
                                width:"10%"
                            },
                            {
                                field:{
                                    name:"remark",
                                    title:"备注",
                                    type:"string"
                                },
                                width:"10%"
                            }
                        ],
                        "businessProvisionList": [
                            {
                                field:{
                                    name:"label",
                                    title:"条款标号",
                                    type:"int"
                                },
                                width:"10%",
                                className:"tL"
                            },
                            {
                                field:{
                                    name: "overview",
                                    title:"条款概要",
                                    type:"string"
                                },
                                width:"12%"
                            },
                            {
                                field:{
                                    name:"remark",
                                    title:"备注",
                                    type:"string"
                                },
                                width:"12%"
                            }
                        ],
                        "technicalProvisionListList" : [
                            {
                                field:{
                                    name:"label",
                                    title:"条款标号",
                                    type:"int"
                                },
                                width:"10%",
                                className:"tL"
                            },
                            {
                                field:{
                                    name: "overview",
                                    title:"条款概要",
                                    type:"string"
                                },
                                width:"12%"
                            },
                            {
                                field:{
                                    name:"remark",
                                    title:"备注",
                                    type:"string"
                                },
                                width:"12%"
                            }
                        ]
                    }
                })();

                //采购清单
                var grida =  X.controls.getControl("DataGrid",$elem.find(".js-datagrida").get(0),{columns:header["tenderItemList"],afterRowRender: function (row, data,index) {
                    $(row.dom).find("td").first().html(index+1);
                }});
                grida.init();

                //商务条款
                var gridb =  X.controls.getControl("DataGrid",$elem.find(".js-datagridb").get(0),{columns:header["businessProvisionList"]});
                gridb.init();

                //技术条款
                var gridc =  X.controls.getControl("DataGrid",$elem.find(".js-datagridc").get(0),{columns:header["technicalProvisionListList"]});
                gridc.init();

               var callback = function (result) {
                    //招标正文
                    ctrl.view.el.find(".tenderContent").html(result.data[0].bulletin);
                    grida.loadData(result.data[0].tenderItemList);
                    gridb.loadData(result.data[0].businessProvisionList);
                    gridc.loadData(result.data[0].technicalProvisionListList);

                    //招标文件
                   var wrapData = ctrl.view.el.find(".js-wrapDatas");
                   wrapData.html("");
                   var uploadUrl = X.config.PATH_FILE.path.rootUploadUrl;
                   var uploadFunction = function(data,num){
                       $.each(data,function(i,item){
                           var a = '<a href="'+uploadUrl+'?fileType='+num+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory orange-font">'+item.filename+'</a>';
                           $(wrapData).append(a);
                       });
                   };
                   uploadFunction(result.data[0].tenderAttachmentList,0);
                };
                ctrl.getData(callback);
                break;

            case "tabChange":

                var changeCallback = function(result){
                    if(result.statusCode == 2000000){
                        ctrl.view.el.find(".js-new").css("display", "none");
                        var callback = function(result){
                            var tabDataGrid =  X.controls.getControl("TabDataGrid",$elem,{dataSource:result,getHeaderF:function(){
                                var header = (function () {
                                    var mapField = {
                                         fieldName:[
                                             {key:'tenderName',value:'招标名称'},
                                             {key:'purchaseBidsDueDate',value:'投标截止时间'},
                                             {key:'contact',value:'联系人'},
                                             {key:'productCategory',value:'货品类别'},
                                             {key:'purchaseProvince',value:'采购地区省'},
                                             {key:'purchaseCity',value:'采购地区市'},
                                             {key:'contactPhone',value:'联系人电话'},
                                             {key:'tenderType',value:'招标形式'},
                                             {key:'qualificationType',value:'资审形式'},
                                             {key:'tenderNum',value:'招标编号'},
                                             {key:'contactEmail',value:'EMAIL'},
                                             {key:'purchaseBudget',value:'采购预算'},
                                             {key:'TechnicalProvision',value:'技术条款'},
                                             {key:'TenderItem',value:'招标货品清单'},
                                             {key:'BusinessProvision',value:'商务条款'},
                                             {key:'TenderAttachment',value:'招标附件'},
                                             {key:'applyAttachmentList',value:'资审附件'},
                                             {key:'applyDueDate',value:'报名截止时间'},
                                             {key:'applyAnnouncement',value:'预审公告'},
                                             {key:'ApplyAttachment',value:'预审附件'},
                                             {key:'bulletin',value:'公告内容'},
                                             {key:'comment',value:'变更说明'},
                                             {key:'name',value:'货品名称'},
                                             {key:'count',value:'数量'},
                                             {key:'model',value:'型号'},
                                             {key:'label',value:'条款标号'},
                                             {key:'overview',value:'条款概要'},
                                             {key:'remark',value:'备注'},
                                             {key:'content',value:'供应商响应'}
                                         ],
                                         getCnField: function(field){
                                             var items = this["fieldName"];
                                             for(var i = 0; i < items.length; i++ ){
                                                 if(items[i]["key"]==field){
                                                    return items[i]["value"]
                                                 }
                                             }
                                         }
                                     };
                                    return {
                                         "tenderHistoryItemList": [
                                             {
                                                 field:{
                                                     name:"orderid",
                                                     title:"序号",
                                                     type:"int"
                                                 },
                                                 width:"3%",
                                                 className:"tL"
                                             },
                                             {
                                                 field:{
                                                     name: "overview",
                                                     title:"变更内容",
                                                     type:"string"
                                                 },
                                                 itemRenderer:{
                                                     render: function(data, field, index, grid){
                                                         if(data.currentData){
                                                             if(data.updateItem == "purchaseProvince"){
                                                                 return mapField.getCnField(data.updateItem)+":变更为"+ addressData.getPro(data.currentData);
                                                             }else if(data.updateItem == "purchaseCity"){
                                                                 return mapField.getCnField(data.updateItem)+":变更为"+ addressData.getCity(data.currentData);
                                                             }else{
                                                                 return mapField.getCnField(data.updateItem)+":变更为"+ data.currentData;
                                                             }
                                                         }else{
                                                         return mapField.getCnField(data.updateItem)+":变更";
                                                         }
                                                     }
                                                 },
                                                 width:"12%"
                                             }
                                         ]
                                    }
                                })();
                                return header;
                            }});
                            tabDataGrid.init();
                        };

                        var data = {tenderId:_para["tenderId"]};
                        bidModel.getChangeList(data,callback);
                    }
                };
                var postData = {tenderId:_para["tenderId"]};
                bidModel.clearNotice(postData,changeCallback);

                break;
            case "tabMyBid":

                var tabMyBidF = function(){
                    var biddingCompanyId,lastPriceRound,bidgrida,bidgridb,bidgridc,upload,bidExplain;
                    var result;
                    var wrapBidDate = ctrl.view.el.find(".js-bidDate");
                    var bidCallback = function(result){
                        lastPriceRound = result.data[0]["lastPriceRound"];

                        //投标说明
                        bidExplain =  X.controls.getControl("TextBox",$elem.find("textarea[name=bidExplain]"));
                        bidExplain.init();

                        //上传文件
                        upload =  X.controls.getControl("WebUpload",$elem.find(".js-webUpload"), {size: 100,type:3,maxNum:20,downloadType:1,filePicker:".filePicker"});
                        upload.init();

                        var dataTime = Date.parse(moment(result.data[0]["roundEndTime"]));
                        var currentTime = Date.parse(new Date());

                        var header = (function () {
                            var dataLengthF = function(){
                                $.each(result.data[0].biddingBidPriceInfoList,function(i,item){
                                    var length = result.data[0].biddingBidPriceInfoList[i].biddingBidPriceList.length;
                                    if(length > 1){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                })
                            };
                            var headerF = function(lastPriceRound,isTerminated,tenderStatus){
                                var head = {
                                    "myTenderItemList": [
                                        {
                                            field:{
                                                name:"",
                                                title:"序号",
                                                type:"int"
                                            },
                                            width:"10%",
                                            className:"tL",
                                            nodata : true,
                                            itemRenderer:{
                                                render: function(data, field, index, grid){
                                                    data = index+1;
                                                    return data.toString();
                                                }
                                            }
                                        },
                                        {
                                            field:{
                                                name: "name",
                                                title:"货品名称",
                                                type:"string"
                                            },
                                            width:"12%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"count",
                                                title:"数量",
                                                type:"string"
                                            },
                                            width:"7%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"unit",
                                                title:"单位",
                                                type:"string"
                                            },
                                            width:"7%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"model",
                                                title:"规格型号",
                                                type:"string"
                                            },
                                            width:"10%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"remark",
                                                title:"备注",
                                                type:"string"
                                            },
                                            width:"10%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"price",
                                                title:"我的报价",
                                                type:"string",
                                                ctrlType:"TextBox",
                                                maxLength: 10,
                                                positiveNumber : true
                                            },
                                            titleFunction:function(data, field){
                                                if(data.biddingBidPriceList[0]){
                                                    return data.biddingBidPriceList[0].price;
                                                }else{
                                                    return "";
                                                }
                                            },
                                            formater :{
                                                format:function(data,field){
                                                    if(data.biddingBidPriceList[0]){
                                                        return data.biddingBidPriceList[0].price;
                                                    }else{
                                                        return "";
                                                    }
                                                }
                                            },
                                            headerRenderer:{
                                                render: function(data, field, index, grid){
                                                    return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                }
                                            },
                                            width:"10%"
                                        }
                                    ],
                                    "myBusinessProvisionList": [
                                        {
                                            field:{
                                                name:"label",
                                                title:"条款标号",
                                                type:"int"
                                            },
                                            width:"10%",
                                            className:"tL",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name: "overview",
                                                title:"条款概要",
                                                type:"string"
                                            },
                                            width:"12%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"remark",
                                                title:"备注",
                                                type:"string"
                                            },
                                            width:"12%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"content",
                                                title:"供应商说明",
                                                type:"string",
                                                ctrlType:"TextBox",
                                                maxLength: 30
                                            },
                                            width:"12%",
                                            headerRenderer:{
                                                render: function(data, field, index, grid){

                                                    return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                }
                                            }
                                        }
                                    ],
                                    "myTechnicalProvisionListList" : [
                                        {
                                            field:{
                                                name:"label",
                                                title:"条款标号",
                                                type:"int"
                                            },
                                            width:"10%",
                                            className:"tL",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name: "overview",
                                                title:"条款概要",
                                                type:"string"
                                            },
                                            width:"12%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"remark",
                                                title:"备注",
                                                type:"string"
                                            },
                                            width:"12%",
                                            nodata : true
                                        },
                                        {
                                            field:{
                                                name:"content",
                                                title:"供应商说明",
                                                type:"string",
                                                ctrlType:"TextBox",
                                                maxLength: 30
                                            },
                                            width:"12%",
                                            headerRenderer:{
                                                render: function(data, field, index, grid){
                                                    return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                }
                                            }
                                        }
                                    ]
                                };
                                var len = head.myTenderItemList.length;
                                var lenBusiness = head.myBusinessProvisionList.length;
                                var lenTechnical = head.myTechnicalProvisionListList.length;
                                switch(lastPriceRound){
                                    case 0:
                                        if(isTerminated || tenderStatus==1 ||tenderStatus==2){
                                            head.myTenderItemList.splice(len-1,1,
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string",
                                                        maxLength: 10
                                                    },
                                                    titleFunction:function(data, field){
                                                        if(data.biddingBidPriceList[0]){
                                                            return data.biddingBidPriceList[0].price;
                                                        }else{
                                                            return "";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"10%"
                                                }
                                            );
                                            head.myBusinessProvisionList.splice(lenBusiness-1,1,
                                                {
                                                    field:{
                                                        name:"content",
                                                        title:"供应商说明",
                                                        type:"string"
                                                    },
                                                    width:"12%",
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){

                                                            return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                        }
                                                    }
                                                }
                                            );
                                            head.myTechnicalProvisionListList.splice(lenTechnical-1,1,
                                                {
                                                    field:{
                                                        name:"content",
                                                        title:"供应商说明",
                                                        type:"string"
                                                    },
                                                    width:"12%",
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){

                                                            return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                        break;
                                    case 1:
                                        if(isTerminated || tenderStatus==1 ||tenderStatus==2){
                                            head.myTenderItemList.splice(len-1,1,
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string",
                                                        maxLength: 10
                                                    },
                                                    titleFunction:function(data, field){
                                                        if(data.biddingBidPriceList[0]){
                                                            return data.biddingBidPriceList[0].price;
                                                        }else{
                                                            return "";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"10%"
                                                }
                                            );
                                            head.myBusinessProvisionList.splice(lenBusiness-1,1,
                                                {
                                                    field:{
                                                        name:"content",
                                                        title:"供应商说明",
                                                        type:"string"
                                                    },
                                                    width:"12%",
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){

                                                            return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                        }
                                                    }
                                                }
                                            );
                                            head.myTechnicalProvisionListList.splice(lenTechnical-1,1,
                                                {
                                                    field:{
                                                        name:"content",
                                                        title:"供应商说明",
                                                        type:"string"
                                                    },
                                                    width:"12%",
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){

                                                            return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                        break;
                                    case 2:
                                        head.myTenderItemList.splice(len-1,1);
                                        if(isTerminated || tenderStatus==2){
                                            head.myTenderItemList.push(
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string"
                                                    },
                                                    nodata : true,
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 1){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"14%"
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第二轮报价(单价(元))",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 2){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第二轮报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"10%"
                                                }
                                            );
                                        }else{
                                            head.myTenderItemList.push(
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string"
                                                    },
                                                    nodata : true,
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 1){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"14%"
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第二轮报价",
                                                        type:"string",
                                                        ctrlType:"TextBox",
                                                        maxLength: 10,
                                                        positiveNumber : true
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 2){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "";
                                                        }
                                                    },
                                                    formater :{
                                                        format:function(data,field){
                                                            var priceData;
                                                            $.each(data.biddingBidPriceList, function(i,item){
                                                                if(data.biddingBidPriceList[i].round == 2){
                                                                    priceData = data.biddingBidPriceList[i].price;
                                                                }
                                                            });
                                                            if(priceData){
                                                                return    priceData
                                                            }else{
                                                                return "";
                                                            }
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第二轮报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"15%"
                                                }
                                            );
                                        }
                                        head.myBusinessProvisionList.splice(lenBusiness-1,1,
                                            {
                                                field:{
                                                    name:"content",
                                                    title:"供应商说明",
                                                    type:"string"
                                                },
                                                width:"12%",
                                                headerRenderer:{
                                                    render: function(data, field, index, grid){

                                                        return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                    }
                                                }
                                            }
                                        );
                                        head.myTechnicalProvisionListList.splice(lenTechnical-1,1,
                                            {
                                                field:{
                                                    name:"content",
                                                    title:"供应商说明",
                                                    type:"string"
                                                },
                                                width:"12%",
                                                headerRenderer:{
                                                    render: function(data, field, index, grid){

                                                        return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                    }
                                                }
                                            }
                                        );
                                        break;
                                    case 3:
                                        head.myTenderItemList.splice(len-1,1);
                                        if(isTerminated || tenderStatus==2){
                                            head.myTenderItemList.push(
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 1){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"14%",
                                                    nodata : true
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第二轮报价(单价(元))",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 2){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return  priceData;
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第二轮报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"15%",
                                                    nodata : true
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第三轮报价",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 3){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return  priceData;
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第三轮报价</div>")[0];
                                                        }
                                                    },
                                                    width:"15%"
                                                }
                                            );
                                        }else{
                                            head.myTenderItemList.push(
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"我的报价",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 1){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>我的报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"14%",
                                                    nodata : true
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第二轮报价",
                                                        type:"string"
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 2){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "未报价";
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第二轮报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"15%",
                                                    nodata : true
                                                },
                                                {
                                                    field:{
                                                        name:"price",
                                                        title:"第三轮报价",
                                                        type:"string",
                                                        ctrlType:"TextBox",
                                                        maxLength: 10,
                                                        positiveNumber : true
                                                    },
                                                    titleFunction:function(data, field){
                                                        var priceData;
                                                        $.each(data.biddingBidPriceList, function(i,item){
                                                            if(data.biddingBidPriceList[i].round == 3){
                                                                priceData = data.biddingBidPriceList[i].price;
                                                            }
                                                        });
                                                        if(priceData){
                                                            return    priceData
                                                        }else{
                                                            return "";
                                                        }
                                                    },
                                                    formater :{
                                                        format:function(data,field){
                                                            var priceData;
                                                            $.each(data.biddingBidPriceList, function(i,item){
                                                                if(data.biddingBidPriceList[i].round == 3){
                                                                    priceData = data.biddingBidPriceList[i].price;
                                                                }
                                                            });
                                                            if(priceData){
                                                                return    priceData
                                                            }else{
                                                                return "";
                                                            }
                                                        }
                                                    },
                                                    headerRenderer:{
                                                        render: function(data, field, index, grid){
                                                            return $("<div><span class='redFont'>*</span>第三轮报价(单价(元))</div>")[0];
                                                        }
                                                    },
                                                    width:"15%"
                                                }
                                            );
                                        }
                                        head.myBusinessProvisionList.splice(lenBusiness-1,1,
                                            {
                                                field:{
                                                    name:"content",
                                                    title:"供应商说明",
                                                    type:"string"
                                                },
                                                width:"12%",
                                                headerRenderer:{
                                                    render: function(data, field, index, grid){

                                                        return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                    }
                                                }
                                            }
                                        );
                                        head.myTechnicalProvisionListList.splice(lenTechnical-1,1,
                                            {
                                                field:{
                                                    name:"content",
                                                    title:"供应商说明",
                                                    type:"string"
                                                },
                                                width:"12%",
                                                headerRenderer:{
                                                    render: function(data, field, index, grid){

                                                        return $("<div><span class='redFont'>*</span>供应商说明</div>")[0];
                                                    }
                                                }
                                            }
                                        );
                                        break;
                                }
                                return head;
                            };
                            switch(Number(result.data[0].tenderStatus)){
                                case 0:
                                    if(data.isTerminated == 1){
                                        ctrl.view.el.find(".filePicker").css("display","none");
                                        ctrl.view.el.find(".js-wrapbidExplain").find("textarea").attr("disabled",true);
                                        ctrl.view.el.find(".js-buttoned").css("display","none");
                                    }
                                    return headerF(0,data.isTerminated == 1,Number(result.data[0].tenderStatus));
                                    break;
                                case 1:
                                    if(data.isTerminated == 1){
                                        ctrl.view.el.find(".js-buttoned").css("display","none");
                                    }
                                    ctrl.view.el.find(".filePicker").css("display","none");
                                    ctrl.view.el.find(".js-wrapbidExplain").find("textarea").attr("disabled",true);
                                    switch(Number(result.data[0]["lastPriceRound"])){
                                        case 0:
                                            ctrl.view.el.find(".js-buttoned").css("display","none");
                                            return headerF(0,data.isTerminated == 1,Number(result.data[0].tenderStatus));
                                            break;
                                        case 1:
                                            ctrl.view.el.find(".js-buttoned").css("display","none");
                                            return headerF(1,data.isTerminated == 1,Number(result.data[0].tenderStatus));
                                            break;
                                        case 2:
                                            if(dataLengthF && dataTime > currentTime){
                                                return headerF(2,data.isTerminated == 1,Number(result.data[0].tenderStatus));
                                            }else {
                                                ctrl.view.el.find(".js-buttoned").css("display","none");
                                                return headerF(2,true,Number(result.data[0].tenderStatus));
                                            }
                                            break;
                                        case 3:
                                            if(dataLengthF && dataTime > currentTime){
                                                return headerF(3,data.isTerminated == 1,Number(result.data[0].tenderStatus));
                                            }else {
                                                ctrl.view.el.find(".js-buttoned").css("display","none");
                                                return headerF(3,true,Number(result.data[0].tenderStatus));
                                            }
                                            break;
                                    }
                                    break;
                                case 2:
                                    ctrl.view.el.find(".js-buttoned").css("display","none");
                                    ctrl.view.el.find(".filePicker").css("display","none");
                                    ctrl.view.el.find(".js-wrapbidExplain").find("textarea").attr("disabled",true);
                                    switch(Number(result.data[0]["lastPriceRound"])){
                                        case 0:
                                            return headerF(0,data.isTerminated ==1,Number(result.data[0].tenderStatus));
                                            break;
                                        case 1:
                                            return headerF(1,data.isTerminated ==1,Number(result.data[0].tenderStatus));
                                            break;
                                        case 2:
                                            return headerF(2,data.isTerminated ==1,Number(result.data[0].tenderStatus));
                                            break;
                                        case 3:
                                            return headerF(3,data.isTerminated ==1,Number(result.data[0].tenderStatus));
                                            break;
                                    }
                                    break;
                            }
                        })();

                        //采购清单
                        bidgrida =  X.controls.getControl("DataGrid",$elem.find(".js-datagrida").get(0),{columns:header["myTenderItemList"],editable:true,"primary":"tenderItemId",afterRowRender: function (row, data,index) {
                            $(row.dom).find("td").first().html(index+1);
                        }});
                        bidgrida.init();

                        //商务条款
                        bidgridb =  X.controls.getControl("DataGrid",$elem.find(".js-datagridb").get(0),{columns:header["myBusinessProvisionList"],editable:true,"primary":"businessProvisionId"});
                        bidgridb.init();

                        //技术条款
                        bidgridc =  X.controls.getControl("DataGrid",$elem.find(".js-datagridc").get(0),{columns:header["myTechnicalProvisionListList"],editable:true,"primary":"technicalProvisionId"});
                        bidgridc.init();

                        bidExplain.setValue(result.data[0].bidExplain);
                        bidgrida.loadData(result.data[0].biddingBidPriceInfoList);
                        bidgridb.loadData(result.data[0].biddingBusinessCommentInfoList);
                        bidgridc.loadData(result.data[0].biddingTechnicalCommentInfoList);
                        upload.reset();
                        upload.setValue(result.data[0].biddingAttachmentList);
                        if(result.data[0].tenderStatus !=0){
                            var wrap = ctrl.view.el.find(".cancel");
                            wrap.css("display","none");
                        }

                        biddingCompanyId = result.data[0].biddingCompanyId;

                        //判断是否为空
                        ctrl.sure = function (){
                            var input = $("input[type=text]");
                            var textArea = ctrl.view.el.find("textarea[name=bidExplain]");
                            var error = $(".inputWrap").find(".js-error");
                            var errorHtml;

                            var array = [];
                            var arrayLen = [];

                            var currentInput;
                            input.each(function(index){
                                if($(input[index]).val().length > 0){
                                    array.push(false);
                                }else{
                                    array.push(true);
                                    currentInput = $(input[index]);
                                    currentInput.css("border-color","red");
                                    currentInput.next('.errorNotice').length ? 1: currentInput.after('<div class="errorNotice">不能为空</div>');
                                }
                                if($(input[index]).val().length < 30){
                                    arrayLen.push(false);
                                }else{
                                    arrayLen.push(true);
                                    currentInput = $(input[index]);
                                    currentInput.css("border-color","red");
                                    currentInput.next('.errorNotice').length ? 1: currentInput.after('<div class="errorNotice">长度超过30个字符</div>');
                                }
                                $(input[index]).focusout(function(){
                                    var errorNotice;
                                    errorNotice = $(this).next('.errorNotice');
                                    if($(this).val().length > 0 && $(this).val().length < 30){
                                        $(this).css("border-color","#ccc");
                                        errorNotice.remove()
                                    }else if($(this).val().length <= 0){
                                        errorNotice.html('<div class="errorNotice">不能为空</div>');
                                    }else if($(this).val().length > 30){
                                        errorNotice.html('<div class="errorNotice">长度超过30个字符</div>');
                                    }
                                })
                            });

                            textArea.focusout(function(){
                                if(textArea.val()){
                                    textArea.css("border-color","#ccc");
                                    var errorNotice;
                                    (errorNotice = textArea.next('.errorNotice')).length ? errorNotice.remove(): 1
                                }
                            });

                            if($.inArray(true, array) != -1){
                                errorHtml = "不能为空";
                            }else if($.inArray(true, arrayLen) != -1){
                                errorHtml = "长度超过30个字符";
                            }
                            if($.inArray(true, array) == -1 &&$.inArray(true, arrayLen) == -1 && textArea.val()){
                                error.html("");
                                return true;
                            }else{
                                //error.html(errorHtml);
                                if(textArea.val()){

                                }else{
                                    textArea.css("border-color","red");
                                    textArea.next('.errorNotice').length ? 1: textArea.after('<div class="errorNotice ml20">不能为空</div>')
                                }
                                return false;
                            }

                        };
                        ctrl.errorLength = function(){
                            var wrapError = wrapBidDate.find(".js-error");
                            var wrapErrorHtml;
                            var array = [];
                            $.each(wrapError,function(){
                                wrapErrorHtml = $(this).html();
                                if(wrapErrorHtml == ""){
                                    array.push(true);
                                }else{
                                    array.push(false);
                                }
                            });
                            if($.inArray(false, array) == -1){
                                return true;
                            }else{
                                return false;
                            }
                        };
                        ctrl.buttoned = function(){
                            var getData = function(num,data){
                                var dataa = bidgrida.collectData(data);
                                if(dataa){
                                    for(var i=0; i<dataa.length; i++){
                                        dataa[i].round = num;
                                    }
                                }
                                return dataa;
                            };
                            var datab = bidgridb.collectData(true);
                            var datac = bidgridc.collectData(true);
                            var fileData = upload.getValue("1");


                            var putFile = function(num){
                                if(fileData.length>0){
                                    var data;
                                    if(lastPriceRound > 1){
                                        data = $.extend( false, {},{biddingBidPriceList:getData(num)},{biddingId:result.data[0]["biddingId"]},{companyId: biddingCompanyId},{tenderId: _para["tenderId"]});
                                    }else{
                                        data = $.extend( false, {},{bidExplain:bidExplain.getValue()},{biddingAttachmentList:fileData},{biddingBidPriceList:getData(num)},{biddingBusinessCommentList:bidgridb.collectData()},
                                            {biddingTechnicalCommentList:bidgridc.collectData()},{biddingId:result.data[0]["biddingId"]},{companyId: biddingCompanyId},{tenderId: _para["tenderId"]});
                                        if(result.data[0]["bidDate"]){
                                            var obidExplain = result.data[0].bidExplain;
                                            var obiddingAttachmentList = result.data[0].biddingAttachmentList;
                                            $.each(obiddingAttachmentList, function(i,item){
                                                delete obiddingAttachmentList[i]["attachmentId"];
                                                delete obiddingAttachmentList[i]["biddingId"];
                                            });
                                        }
                                    }
                                    if(data){
                                        var submitData = function(){
                                            if(ctrl.sure() && ctrl.errorLength()){
                                                var putFileCallback = function(result){
                                                    if(result.statusCode == 2000000){
                                                        layer.successMsg("提交成功",function(number){
                                                            layer.closeIt(number);
                                                            X.router.back();
                                                        },"auto");
                                                    }else{
                                                        layer.warnMsg(result.message,function(number){
                                                            //状态异常时，刷新当前页
                                                            ctrl.rendering();
                                                            layer.closeIt(number);
                                                        });
                                                    }
                                                };
                                                bidModel.putFile(data,putFileCallback);
                                            }
                                        };
                                        if(lastPriceRound > 1){
                                            if(getData(num,true).length !==0){
                                                submitData();
                                            }else{
                                                layer.warnMsg("提交内容未更改，不能重复提交", function (number) {
                                                    layer.closeIt(number);
                                                });
                                            }
                                        }else if(_.isEqual(data.bidExplain,obidExplain) && _.isEqual(data.biddingAttachmentList,obiddingAttachmentList) && getData(num,true).length == 0 && datab.length == 0 && datac.length == 0){
                                            layer.warnMsg("提交内容未更改，不能重复提交", function (number) {
                                                layer.closeIt(number);
                                            });
                                        }else{
                                            submitData();
                                        }
                                    }
                                }else{
                                    var error = '<label class="error">附件不能为空</label>';
                                    $(error).appendTo(ctrl.view.el.find(".js-attachError"));
                                }

                            };

                            var postFile = function(num){
                                if(fileData.length>0){
                                    var data = $.extend( false, {},{bidExplain:bidExplain.getValue()},{biddingAttachmentList:fileData},{biddingBidPriceList:getData(num)},{biddingBusinessCommentList:bidgridb.collectData()},
                                        {biddingTechnicalCommentList:bidgridc.collectData()},{companyId: biddingCompanyId},{tenderId: _para["tenderId"]});
                                    if(data && ctrl.sure() && ctrl.errorLength()){
                                        var postFileCallback = function(result){
                                            if(result.statusCode == 2000000){
                                                layer.successMsg("提交成功",function(number){
                                                    layer.closeIt(number);
                                                    X.router.back();
                                                },"auto");
                                            }else{
                                                layer.warnMsg(result.message,function(number){
                                                    //状态异常时，刷新当前页
                                                    ctrl.rendering();
                                                    layer.closeIt(number);
                                                });
                                            }
                                        };

                                        publicBidModel.postFile(data,postFileCallback);
                                    }
                                }else{
                                    var error = '<label class="error">附件不能为空</label>';
                                    $(error).appendTo(ctrl.view.el.find(".js-attachError"));
                                }
                            };

                            if(result.data[0]["biddingId"]){
                                switch(Number(lastPriceRound)){
                                    case 0:
                                        putFile(1);
                                        break;
                                    case 1:
                                        putFile(1);
                                        break;
                                    case 2:
                                        putFile(2);
                                        break;
                                    case 3:
                                        putFile(3);
                                        break;
                                }
                            }else{
                                switch(Number(lastPriceRound)){
                                    case 0:
                                        postFile(1);
                                        break;
                                    case 1:
                                        postFile(1);
                                        break;
                                }
                            }
                        };

                        ctrl.addEvent("click", ".js-buttoned", "buttoned");

                    };
                    var getData;
                    if(getBiddingIdData["bidDate"]){
                        getData = {biddingId: getBiddingIdData["biddingId"]};
                        bidModel.getFile(getData,bidCallback);
                    }else {
                        getData = {tenderId: _para["tenderId"]};
                        publicBidModel.getPublicBidFile(getData,bidCallback);
                    }

                };
                tabMyBidF();
                break;
            case "tabAnswerQuestion":

                break;
            case "tabAnswer":

                break;
            case "tabQualification":
                if(getBiddingIdData.biddingId){
                    var qualificationCallback = function(result){
                        if(result.data[0].qualificationType == "1"){
                            var tabQualification = ctrl.view.el.find(".js-tabQualification");
                            tabQualification.html("");
                        }else{
                            var tabQualificationBlock = ctrl.view.el.find(".js-tabQualification");
                            var uploadUrl = X.config.PATH_FILE.path.rootUploadUrl;
                            //招标文件
                            var uploadFunction = function(data,num,elem){
                                $.each(data,function(i,item){
                                    var a = '<a href="'+uploadUrl+'?fileType='+num+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory orange-font">'+item.filename+'</a>';
                                    $(elem).append(a);
                                });
                            };

                            var wrapData = tabQualificationBlock.find(".js-wrapAttachment");
                            uploadFunction(result.data[0].tenderApplyAttachmentList,0,wrapData);

                            //投标文件
                            var wrapQualification = tabQualificationBlock.find(".js-wrapQualification");
                            uploadFunction(result.data[0].biddingApplyAttachmentList,1,wrapQualification);

                            //公告内容
                            var tenderContent = tabQualificationBlock.find(".js-tenderContent");
                            tenderContent.html(result.data[0].applyAnnouncement);
                        }
                    };

                    var qualificationData = {
                        tenderId:_para["tenderId"]
                    };
                    //获取资审公告
                    bidModel.qualificationInfo(qualificationData,qualificationCallback);
                }else{
                    var tabQualification = ctrl.view.el.find(".js-tabQualification");
                    tabQualification.html("");
                }

                break;
        }
    }

    var getQuestionData;
    var formatSearchData = function(data,num,getQuestionData){
        data.query.askType =num;
        data.query.biddingId = getQuestionData["biddingId"];

        return data;
    };

    var schemas = (function(){
        var schemas = {
            "tabAnswerQuestion" :{
                searchMeta: {
                    schema: {
                        simple:[

                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                //storeHelper.setStore(tabPannel);
                            }
                            return formatSearchData(data,1,getQuestionData);
                        }
                    }
                },
                gridMeta :{
                    columns : [],
                    afterRowRender:function(row,data){
                        if(data.answerContent == ""){
                            $(row.dom).find(".js-anserContent").html("<p class='redFont pl30'>对方未回复</p>");
                        }
                    },
                    type : "C",
                    selector : ".js-bid-tenderQuestion-tpl",
                    tableClass : "w100p"
                },
                pageInfo : {
                    pageSize: '6',
                    totalPages: '10',
                    dataSource:[{key:6,value:6},{key:10,value:10},{key:15,value:15},{key:20,value:20}],
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                url : X.config.bid.api.tabAnswerQuestion
            },
            "tabAnswer" :{
                searchMeta: {
                    schema: {
                        simple:[

                        ]
                    },
                    search: {
                        onSearch : function (data,searcher,click) {
                            if(click){
                                //storeHelper.setStore(tabPannel);
                            }
                            return formatSearchData(data,0,getQuestionData);
                        }
                    }
                },
                gridMeta :{
                    columns : [],
                    orderMode : 1,
                    primaryKey:"messageId",
                    orderMode : 1,
                    afterRowRender: function (row, data) {
                    },
                    tableClass :"w100p"
                },
                pageInfo : {
                    pageSize: '6',
                    totalPages: '10',
                    dataSource:[{key:6,value:6},{key:10,value:10},{key:15,value:15},{key:20,value:20}],
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                url : X.config.bid.api.tabAnswerQuestion
            }
        };
        return schemas;
    })();

    var lists = {};
    function initTabPageList($elem,schema,tabPage,data) {
        getQuestionData = data;
        switch (tabPage) {
            case "tabAnswerQuestion":

                var textBox = X.controls.getControl("TextBox", $elem.find("[name=questionContent]"));
                textBox.init();

                var run = function (data) {
                    var list = X.controls.getControl("List", $elem, schema);
                    list.init();
                    lists[tabPage] = list;
                    if(data.tenderStatus=="开标中" || data.tenderStatus =="已结束" || data.isTerminated == "1"){
                        var askQuestion = ctrl.view.el.find(".js-askQuestion");
                        askQuestion.remove();
                        var textarea = ctrl.view.el.find(".js-textarea");
                        textarea.remove();
                    }
                };

                run(data);

                var textarea = ctrl.view.el.find(".js-textarea").find("textarea");
                var error = ctrl.view.el.find(".js-tenderQuestion").find(".supplierDisplayJsError");
                textarea.focusout(function(){
                    if (textBox.getValue().length > 300){
                        error.html("<label class='error'>字数超出限制，请输入300字以内的问题！</label>");
                    }else{
                        error.html("");
                    }
                });


                //提交提问问题
                ctrl.SubmitQuestion = function () {
                    var postData = textBox.getValue();
                    var that = this.that;
                    var error = ctrl.view.el.find(".js-tenderQuestion").find(".supplierDisplayJsError");
                    if(!postData){
                        error.html("<label class='error'>提问问题不能为空！</label>");
                    }else if (postData) {
                        if($(".js-textarea").valid()){
                            var data = $.extend(false, {}, {questionContent: postData}, {
                                tenderId: _para["tenderId"],
                                biddingId: getQuestionData["biddingId"]
                            });
                            var postQuestionCallback = function(result){
                                if(result.statusCode == 2000000){
                                    layer.successMsg("提交成功", function (number) {
                                        var tenderQuestion = ctrl.view.el.find(".js-tenderQuestion");
                                        tenderQuestion.find("textarea").attr("value","");
                                        var list = X.controls.getControl("List", $elem, schema);
                                        list.init();
                                        lists[tabPage] = list;
                                        layer.closeIt(number);
                                    },"auto");
                                }else{
                                    layer.warnMsg(result.message, function (number) {
                                        //状态异常时，刷新当前页
                                        ctrl.rendering();
                                        layer.closeIt(number);
                                    });
                                }
                                $(that).removeAttr("disabled");
                            };
                            $(that).attr("disabled","disabled");
                            bidModel.postQuestion(data, postQuestionCallback);
                        }
                    }
                };

                //点击提交提问问题
                ctrl.addEvent("click", ".js-buttons", "SubmitQuestion");

                break;
            case "tabAnswer":

                var getData;

                var formatSearchData = function (data, num, status,getData) {
                    data.query.askType = num;
                    data.query.biddingId = getData["biddingId"];
                    data.query.status = status;

                    return data;
                };

                var schemas = (function () {
                    var schemas = {
                        "tabNoAnswer": {
                            searchMeta: {
                                schema: {
                                    simple: []
                                },
                                search: {
                                    onSearch: function (data, searcher, click) {
                                        if (click) {
                                            //storeHelper.setStore(tabPannel);
                                        }
                                        return formatSearchData(data, 0, 0,getData);
                                    }
                                }
                            },
                            gridMeta: {
                                columns: [],
                                afterRowRender: function (row, data) {
                                    var form = X.controls.getControl("SubmitControl", $(row.dom).find(".js-wrapSubmit"), {
                                        submit2:function(postData,tenderTalkId){
                                            var data = $.extend(false, {}, {answerContent: postData},{tenderTalkId:tenderTalkId});
                                            bidModel.postAnswer(data, function (result) {
                                                if(result.statusCode == 2000000){
                                                    layer.successMsg("回答成功", function (number) {
                                                        for(var key in listed){
                                                            if(listed.hasOwnProperty(key)){
                                                                listed[key].loadData();
                                                            }
                                                        }
                                                        layer.closeIt(number);
                                                    },"auto");
                                                }else if(result.statusCode == 2000100){
                                                    layer.warnMsg("在开标中才可以回答问题", function (number) {
                                                        layer.closeIt(number);
                                                    });
                                                }else{
                                                    layer.warnMsg(result.message, function (number) {
                                                        //状态异常时，刷新当前页
                                                        ctrl.rendering();
                                                        layer.closeIt(number);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                    form.init();
                                    if(getData.tenderStatus == "已结束" || getData.isTerminated == "1"){
                                        $(row.dom).find(".js-contAnswer").remove();
                                    }
                                },
                                afterTableRender: function(grid){
                                    if(grid.rows.length>0){
                                        ctrl.view.el.find(".js-tenderCompanyNameCn").html(data.companyName);
                                    }else{
                                        ctrl.view.el.find(".js-tenderCompanyNameCnNone").css("display","none");
                                    }
                                },
                                type : "C",
                                selector : ".js-bid-tenderAnswer-tpl",
                                tableClass :"w100p"
                            },
                            pageInfo: {
                                pageSize: '6',
                                totalPages: '10',
                                dataSource:[{key:6,value:6},{key:10,value:10},{key:15,value:15},{key:20,value:20}],
                                pageNo: '1',
                                smallPapogation: {
                                    isShow: false,
                                    elem: '.js_small_papogation1'
                                }
                            },
                            url: X.config.bid.api.tabAnswerQuestion
                        },
                        "tabHasAnswer": {
                            searchMeta: {
                                schema: {
                                    simple: []
                                },
                                search: {
                                    onSearch: function (data, searcher, click) {
                                        if (click) {
                                            //storeHelper.setStore(tabPannel);
                                        }
                                        return formatSearchData(data, 0, 1,getData);
                                    }
                                }
                            },
                            gridMeta: {
                                columns: [],
                                type : "C",
                                selector : ".js-bid-tenderQuestion-tpl",
                                afterRowRender: function (row, data) {
                                },
                                tableClass :"w100p"
                            },
                            pageInfo: {
                                pageSize: '6',
                                totalPages: '10',
                                dataSource:[{key:6,value:6},{key:10,value:10},{key:15,value:15},{key:20,value:20}],
                                pageNo: '1',
                                smallPapogation: {
                                    isShow: false,
                                    elem: '.js_small_papogation1'
                                }
                            },
                            url: X.config.bid.api.tabAnswerQuestion
                        }
                    };
                    return schemas;
                })();

                var listed = {};

                function initTabPageAnswer($elem, schema, tabPage,data) {
                    getData = data;
                    switch (tabPage) {
                        case "tabNoAnswer":
                            var runner = function (data) {
                                if (data["biddingId"]) {
                                    if(data.tenderStatus == "投标中"){
                                        ctrl.view.el.find(".js-tenderAnswer").html("");
                                    }else if(data.tenderStatus == "开标中" && data.bidDate == ""){
                                        ctrl.view.el.find(".js-tenderAnswer").html("");
                                    }else{
                                        var list = X.controls.getControl("List", $elem, schema);
                                        list.init();
                                        listed[tabPage] = list;
                                    }
                                }else {
                                    ctrl.view.el.find(".js-tenderAnswer").html("");
                                }
                            };

                            runner(data);

                            break;
                        case "tabHasAnswer":
                            var runAnswer = function (data) {
                                if (data["biddingId"]) {
                                    var list = X.controls.getControl("List", $elem, schema);
                                    list.init();
                                    listed[tabPage] = list;
                                }
                            };
                            runAnswer(data);
                            break;
                }
            }

                var activeTabInfo2;
                answerTabPannel = X.controls.getControl("TabPanel", $('.js_tabPannel3'), {
                    activeTabInfo: activeTabInfo2,
                    beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                        activeTabInfo2 = tabLiInfo;
                        var page = $(tabPage);
                        if (!page.data("hasInited")) {
                            var schema = schemas[tabLiInfo];
                            if (schema) {
                                initTabPageAnswer(page, schema, tabLiInfo,data);
                            }
                            page.data("hasInited", true);
                        }

                        // 为了样式效果，把当前选中的前一个加上样式名
                        targetLi.prev().removeClass('tab_lineNone');
                        return true;
                    },
                    afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                        activeTabInfo2 = tabLiInfo;
                        activeTabLi = targetLi;
                        // 为了样式效果，把当前选中的前一个加上样式名
                        targetLi.prev().addClass('tab_lineNone');
                        if (tabLiInfo != oldTab) {

                        }
                    }
                });

                break;
        }
    }
    var answerTabPannel;
    var tabPannel;
    /*--投标中，开标中，已结束--*/
    ctrl.initPage  =function (activeTabLiInfo,data,selector){
        tabPannel = X.controls.getControl("TabPanel",selector, {
            activeTabInfo: activeTabLiInfo,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo = tabLiInfo;
                var page = $(tabPage);
                if(!page.data("hasInited")){
                    var schema = schemas[tabLiInfo];
                    if(schema){
                        initTabPageList(page,schema,tabLiInfo,data);
                    }else if(data.tenderStatus =="报名中" || data.tenderStatus =="资审中" || data.applyResult == 0){
                        initTabPageSign(page,tabLiInfo,data);
                    }else{
                        initTabPage(page,tabLiInfo,data);
                    }
                    page.data("hasInited",true);
                }

                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().removeClass('tab_lineNone');
                return true;
            },
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                activeTabLiInfo = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if(tabLiInfo!=oldTab){

                }
            }
        });
    };

    var _para;
    ctrl.load = function(para){
        para = para || {};
        _para = para ;
        ctrl.rendering();
    };

    return ctrl;
});
