X.define("modules.declare.addOrder", ["model.declareModel","data.orderCountryData","common.layer"], function (declareModel,orderCountryData,layer) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.declare.tpl.addOrder
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {

            ctrl.vmaddOrder = ctrl.getViewModel(ctrl.view.el.find(".js-addOrder"),
                {meta: {"payName":{dataSource:declareModel.const.paymentMethod,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputPaymentMethod")
                    }},"currency":{dataSource:declareModel.const.currencyType,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputCurrencyType")
                    }},"taxMode":{dataSource:declareModel.const.drawbackMode,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputDrawbackMode")
                    }},"logisCompanyName":{dataSource:declareModel.const.logisticsCompany,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputLogisticsCompany")
                    }},"consigneeCountry":{dataSource:orderCountryData.country,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputConsigneeState")
                    }},"transMode":{dataSource:declareModel.const.typeOfShipping,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputTypeOfShipping")
                    }},"realShippingId":{dataSource:declareModel.const.delivery,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputDelivery")
                    }},"wrapType":{dataSource:declareModel.const.packingType,selectedChanged: function(item){
                        ctrl.selectedChanged(item,".js-inputPackingType")
                    }}
                }});
            ctrl.vmaddOrder.initControl();

            ctrl.datetimeInit('.js-datetimepicker1');

            ctrl.datetimeInit('.js-datetimepicker2');

            ctrl.initDataGrid();

            ctrl.formValidate();

            ctrl.validateEdit([ctrl.view.el.find(".js-totalGrossWeight"),ctrl.view.el.find(".js-totalNetWeight")])
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    /**
     @method initDataGrid 初始化表单
     */
    ctrl.initDataGrid = function () {
        var good = {
            columns: [
                {
                    field:{
                        name:"goodsName",
                        title:"商品名称",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 50
                    },
                    width:"25%"
                },
                {
                    field:{
                        name:"goodsModel",
                        title:"商品型号",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 30
                    },
                    width:"18%"
                },
                {
                    field:{
                        name:"goodsNo",
                        title:"商品编码",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 10,
                        minLength: 10,
                        onlyNumber: true
                    },
                    width:"18%"
                },
                {
                    field:{
                        name:"goodsAmount",
                        title:"件数",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 3,
                        onlyNumber: true
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"goodsUnit",
                        title:"单位",
                        ctrlType:"ComboBox",
                        className:'w40',
                        dataSource: declareModel.const.unit
                    },
                    width:"10%"
                },
                {
                    field:{
                        name:"weight",
                        title:"重量(kg)",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 5
                    },
                    width:"6%"
                },
                {
                    field:{
                        name:"unitPrice",
                        title:"单价",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        maxLength: 5
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"totalPrice",
                        title:"总价",
                        ctrlType: "TextBox",
                        className: 'w100p',
                        disabled:true
                    },
                    width:"7%"
                },
                {
                    field:{
                        name:"third",
                        title:"操作",
                        type: "string",
                    },
                    nodata: true,
                    itemRenderer: {
                        render: ctrl.removeGood
                    },
                    width:"5%"
                }
            ]
        };
        good.editable = true;
        ctrl.grid = X.controls.getControl('DataGrid', ctrl.view.el.find(".js-datagrid")[0], good);
        ctrl.grid.init();

        var toolbarOpt = {
            selector: '.toolbar-good',
            items: [
                {
                    ctrlType:"ToolbarButton",
                    name:"delete",
                    icon: "icon-add",
                    title:"增加一个商品",
                    click:ctrl.addGood
                }
            ]
        };
        var toolbar = X.controls.getControl("Toolbar", ctrl.view.el.find(".js-operation"), toolbarOpt);
        toolbar.init();
        toolbar.target = ctrl.grid;

        ctrl.addGood({parent:toolbar})
    };

    /**
     @method addGood 添加商品
     */
    ctrl.addGood = function (that) {
        var datagrid = that.parent.target;
        if(datagrid.$table.find('tbody').find('tr').length < 5){
            datagrid.insertRow();
            ctrl.addValidate(datagrid.tbody.children[datagrid.tbody.childElementCount - 1]);
        }
    };

    /**
     @method removeGood 删除商品
     */
    ctrl.removeGood = function(data, field, index, grid) {
        var len = ctrl.view.el.find(".js-datagrid").find('table').find("tr").length;
        if(len > 1){
            var html = $('<i class="iconfont icon-lajitong colcc curp f20 js-removeGood"></i>');
            html.on('click', function() {
                var index = $(this).parents('tr').index();
                grid.grid.removeRow(grid.grid.rows[index]);
                ctrl.calculationTotal();
            });
            return html[0];
        }else{
            var html = '<div style="width: 20px;"></div>';
            return html;
        }
    };

    /**
     @method validateEdit 添加校验
     @param arr {Array} 需要校验的dom数组
     */
    ctrl.validateEdit = function(arr){
        $.each(arr, function (index,value){
            $(value).on('blur', function() {
                if(!(/^(\d{1,2}(.\d{1,2})?)$/g.test($(this).val()) && !(Number($(this).val()) > 99) && (Number($(this).val()) > 0))){
                    $(this).val('');
                }
            })
        });
    };

    /**
     @method addValidate 表格里面的输入框或者下拉框校验
     @param tr {string} 当前校验的输入框或者下拉框
     */
    ctrl.addValidate = function(tr){
        $(tr).find('input').on('blur', function() {
            ctrl.valListInput.call(this);
            ctrl.calculationTotalPrice(this);
        })
    };

    ctrl.valListInput = function(){
        var me    = $(this),
            td    = me.closest("td"),
            index = td.siblings().length - td.index(),
            table = td.parents('table'),
            result = true;

        if (index !== 1) {
            var wrap = '';
            me.attr("class") ? wrap = me.attr("class").split(" ")[3]:'';
            if (!this.value && !this.value.trim()) {
                var po    = me.position(),
                    top   = po.top + 30,
                    left  = po.left,
                    title = table.children('thead').find('th')[td.index()].innerHTML;
                title == '件数' ?  title = '商品件数' :'';
                if (!me.next('.error').length) me.after('<label class="error" style="text-align: left">请填写'+ title +'</label>')

                result = false
            } else if(wrap == "js-goodsNo"){
                if(!(me.val().length == 10)){
                    if (!me.next('.error').length) me.after('<label class="error" style="text-align: left">商品编码只能为数字且长度为10位</label>')
                }else{
                    me.next('.error').remove()
                }
            }else if(wrap == "js-weight" || wrap == "js-unitPrice"){
                if(!(/^(\d{1,2}(.\d{1,2})?)$/g.test(me.val()) && !(Number(me.val()) > 99) && (Number(me.val()) > 0))){
                    me.val('');
                }
            }else {
                me.next('.error').remove()
            }
        }
        return result
    };

    /**
     @method calculationTotalPrice 计算表格下面每行的总价
     @param wrap {string} 当前的input
     */
    ctrl.calculationTotalPrice = function(wrap){
        var wrapParent = $(wrap).closest("td"),
            number = $(wrapParent).parent().find('.js-goodsAmount'),
            unitPrice = $(wrapParent).parent().find('.js-unitPrice'),
            totalPrice = $(wrapParent).parent().find('.js-totalPrice');
        if(wrapParent.index() == 3 || wrapParent.index() == 6){
            if(Number(number.val()) && Number(unitPrice.val())){
                totalPrice.val(Number(number.val()) * Number(unitPrice.val()));
                ctrl.calculationTotal();
            }
        }
    };

    /**
     @method calculationTotal 计算商品总件数和订单总金额
     */
    ctrl.calculationTotal = function(){
        var wrapParent = ctrl.view.el.find(".js-addOrder"),
            totalNumber = wrapParent.find('.js-totalNumber'),
            totalAmount = wrapParent.find('.js-totalAmount'),
            arr = ctrl.grid.collectData(),
            num = '',tPrice = '';

        $.each(arr,function(index,value){
            value.goodsAmount ? num = Number(value.goodsAmount) + Number(num) : '';
            value.totalPrice ? tPrice = Number(value.totalPrice) + Number(tPrice) : '';
        });

        totalNumber.html(num);
        totalAmount.html(tPrice);
    };

    /**
     @method selectedChanged 下拉框选择后事件
     @param data {string} 下拉框选中的数据
     @param wrap {string} 给wrap赋值data，用来校验
     */
    ctrl.selectedChanged = function (data,wrap) {
        var inputSource = ctrl.view.el.find(wrap);
        var sourceError = inputSource.siblings(".js-error");
        inputSource.val(data.text);
        sourceError.html('');
    };

    ctrl.getDatetime = function () {
        function p(s) {
            return s < 10 ? '0' + s: s;
        }

        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();       //获取当前小时数(0-23)
        var m=myDate.getMinutes();     //获取当前分钟数(0-59)

        var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m);
        return now;
    };

    /**
     @method datetimeInit 时间控件初始化
     @param wrap {string} 时间控件input框
     */
    ctrl.datetimeInit = function (wrap) {
        $.datetimepicker.setLocale('en');
        $(wrap).datetimepicker({
            //value:'2015/04/15 05:03',
            dayOfWeekStart : 1,
            lang:'en',
            format:"Y-m-d H:i",
            disabledDates:['1986/01/08','1986/01/09','1986/01/10']
            //startDate:	'1986/01/05'
        });
        /*$($(wrap)[0]).val(ctrl.getDatetime());*/
        $(wrap).datetimepicker({value:'',step:10});
        $(wrap).focusin(function () {
            $('.xbn-frame').css({
                "overflow-y": "hidden"
            });
            $(wrap).css('border-color', '#00aff0');
        });
        $(wrap).focusout(function () {
            $('.xbn-frame').css({
                "overflow-y": "auto"
            });
            $(wrap).css('border-color', '#cccccc');
        });
    };

    /**
     @method gridValidate 校验表格里面的输入框或者下拉框
     */
    ctrl.gridValidate = function(){
        var arr = [];
        $(ctrl.view.el.find(".js-datagrid").find('table').find('input')).each(function(i){
            if(ctrl.valListInput.call(this)){
                arr.push(ctrl.valListInput.call(this));
            }
        });
        return arr.length;
    };

    /**
     @method formValidate 表单数据校验
     */
    ctrl.formValidate = function(){

        //验证原始订单号是否已存在
        $.validator.addMethod("isOldOrderNo", function (value, element) {

            var flag = true;

            $.ajax({
                type: "GET",
                url: X.constructor.prototype.config.PATH_FILE.path.rootUrl + "/order/"+value,
                async: false,
                success: function (data) {
                    if (data.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS) {
                        flag = data.data;
                    }
                }
            });

            return flag;

        }, '原始订单号已存在');

        // 只能输入数字，整数>=2,小数点后最多2位
        $.validator.addMethod("isNumber2Float2", function (value, element) {
            return this.optional(element) || (/^(\d{1,2}(.\d{1,2})?)$/g.test(value) && !(Number(value) > 99) && (Number(value) > 0));
        }, "");

        ctrl.validate = {
            rules: {
                inputPaymentMethod: { required: true},
                payTime: { required: true},
                inputCurrencyType: { required: true},
                inputDrawbackMode:{ required: true},
                rate: { required: true,isNumber2Float2:true},
                oldOrderNo: { required: true,isOldOrderNo:true},
                totalGrossWeight: { required: true},
                totalNetWeight: { required: true},
                inputLogisticsCompany: { required: true},
                wayBillNo: { required: true},
                consignee: { required: true},
                inputConsigneeState: { required: true },
                inputTypeOfShipping: { required: true },
                inputDelivery: { required: true },
                inputPackingType: { required: true },
                shippingTime: { required: true }
            },
            messages: {
                inputPaymentMethod: { required: "请选择支付方式"},
                payTime: { required: "请填写支付时间"},
                inputCurrencyType: { required: "请选择货币类型"},
                inputDrawbackMode:{ required: "请选择退税方式"},
                rate: { required: "请填写汇率",isNumber2Float2:'大于0的数字，整数部分最大两位，小数部分最大两位'},
                oldOrderNo: { required: "请填写原始订单号",isOldOrderNo:'该原始订单号已存在'},
                totalGrossWeight: { required: "请填写总毛重"},
                totalNetWeight: { required: "请填写总净重"},
                inputLogisticsCompany: { required: "请选择物流公司"},
                wayBillNo: { required: "请填写运单号"},
                consignee: { required: "请填写收货人"},
                inputConsigneeState: { required: "请选择收货人国家" },
                inputTypeOfShipping: { required: "请选择运输方式" },
                inputDelivery: { required: "请选择发货方式" },
                inputPackingType: { required: "请选择包装种类" },
                shippingTime: { required: "请填写发货时间" }
            },
            onkeyup: false,
            onfocusout: function (element) {
                var elem = $(element);
                 elem.valid();
            },
            success: function(value){},
            errorPlacement: function (error, element) {
                if($(error).html()){
                    var errorWrap = element.parent().find(".js-error");
                    errorWrap.html("");
                    error.appendTo(errorWrap);
                }
            }
        };
        ctrl.view.el.find('.js-addOrder').validate(ctrl.validate);
    };

    /**
     @method formSubmit 表单数据提交
     */
    ctrl.formSubmit = function(){
        if(ctrl.view.el.find('.js-addOrder').valid() && ctrl.gridValidate()){
            var opt = {
                title: '提示',
                content:'<div style="padding:15px;font-size: 16px">提交后将发送订单数据，是否确认数据无误？</div>',
                shadeClose: true,
                btn : ["确定","返回修改"],
                yes: function(){
                    var data = ctrl.vmaddOrder.collectData();
                    data.wzfOrderGoodsList = ctrl.grid.collectData();
                    var callback = function(result){
                        if (result.statusCode ===  X.constructor.prototype.constant.statusCode.SUCCESS){
                            layer.closeAll();
                            var callback = function(url,mold){
                                var li = $('.js-accondion').find('li');
                                $.each(li, function(index,value){
                                    if(url.split('=')[1] == $(value).attr('code')){
                                        $(value).children("div").addClass("selected");
                                    }else if(mold.m == $(value).attr('code')){
                                        $(value).children("div").removeClass("selected");
                                    }
                                })
                            };
                            X.router.run("m=declare.orderList",'','',callback);
                        }
                    };
                    declareModel.addOrder(data,callback);
                }
            };
            layer.layerOpen(opt);
        }
    };

    ctrl.addEvent("click", ".js-button", "formSubmit");

    return ctrl;

});
