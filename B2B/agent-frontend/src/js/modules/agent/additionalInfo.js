X.define('modules.agent.additionalInfo', ["model.agentModel", "modules.common.global", "modules.user.login", "modules.user.regist", "modules.common.multipleFiles"], function (model, global, login, regist, multipleFiles) {

    var view = X.view.newOne({
        el: $('.js-additional-info'),
        url: X.config.agent.tpl.additionalInfo,
        res: X.config.agent.res.buyRequest
    });

    var ctrl = X.controller.newOne({
        view: view
    });
    ctrl.countryName = "";
    ctrl.area = function () {
        $("#phone").intlTelInput({
            preferredCountries: ["cn"],            
            utilsScript: "js/lib/utils.js"
        });
        ctrl.countryName = "China (中国)"
        $(".js-other").css({'background-color': 'white', 'box-shadow': 'none'});
        $(".js-other").parent().parent().find('.dial-code').text('');
        $(".iti-flag-add").removeClass('iti-flag');
        $("#phone").on("countrychange", function(e, countryData) {
            if (countryData.dialCode == 259) {
                var flag = jQuery('.selected-flag .iti-flag-add');
                flag.removeClass('iti-flag');
                flag.css({'position':'absolute', 'top': '15px'})
            } else {
                var flag2 = jQuery('.selected-flag .iti-flag');
                flag2.css({'position':'absolute', 'top': '0px'})
            }
            ctrl.countryName = countryData.name;
        });
    };
    
    ctrl.validate = {
        rules: {
            location : {
                required: true
            },
            personalName  : {
                required: true
            },
            personalId  : {
                required: true,
                isIdCardNo: true,
                checkPersonalId:true,
                isAdult:true
            },
            radio:{
                required:true
            },
            category:{
                required:true
            },
            expCommission:{
                required:true
            },
            selfIntroduction:{
                required:true
            }
        },
        messages: {
            location: {
                required: "Please enter the City"
            },
            personalName: {
                required: "Please enter the Name"
            },
            personalId: {
                required: "Please enter the ID Number",
                isIdCardNo:"The ID Number format is wrong",
                checkPersonalId:"This ID number has been used",
                isAdult:"Your age must be over 16"
            },
            radio:{
                required:"Please choose the Language"
            },
            category:{
                required:"Please enter the Category"
            },
            expCommission:{
                required:"Please enter the Expected Commission"
            },
            selfIntroduction:{
                required:"Please enter the Self-introduction"
            }
        },
        onkeyup: false,
        onfocusout: function (element) {
            var elem = $(element);
            elem.valid();
        },
        errorPlacement: function (error, element) {
            element.after(error);
            error.css({position: "absolute", "left": "11px","bottom":"-16px" })

        } 
        // showErrors : function (errorMap, elementList) {
        //     var a =0;
        // }
    };
    ctrl.GetQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
    // 验证Category
    ctrl.valiCategory = function(){
        var categoryHtml = ctrl.view.find(".js-addCategory-html");
        if (categoryHtml.length != 0){
            return true;
        }else{
            ctrl.view.find(".js-category-error").text("Please enter the Category");
            return false;
        }
    };
    //获取Category 
    ctrl.getCategory = function(){
        var category= "";
        var categoryHtml = ctrl.view.find(".js-addCategory-html");
        for (var i=0;i<categoryHtml.length;i++){
            category += $(ctrl.view.find(".js-addCategory-html")[i]).find("span").text()+",";
        }
        return category
    };  
    var events = {
    	init: function() {
            var that = this;
            var languageInput = $('.languageInput', ctrl.view.el)
            var meta = {
                'language': {
                    dataSource : model.languageType,
                    selectedChanged: function(val) {
                        if (this.value == 10) {
                            languageInput.toggleClass('none')
                            !this.checked && (languageInput.val(''))
                        }
                    }
                }
            };
            ctrl.view.el.find("form").validate(ctrl.validate);
            ctrl.vm = ctrl.getViewModel(ctrl.view.find(".js-additional-form"),{ meta: meta});
            ctrl.vm.initControl();
            ctrl.area();
            view.el.on('keydown', function (e) {
                e.keyCode === 13 && that.addCategory()
            })
            that.addCategory(); 
            ctrl.view.find(".js-add-category").click(function(){that.addCategory()});
            ctrl.view.find(".js-additional-submit").click(function(){that.submit()});
            this.triggerPartTime()
    	},
    	submit: function() {
            if (ctrl.view.el.find("form").valid() && ctrl.valiCategory()) {
                var data = ctrl.vm.collectData();
                data.category= ctrl.getCategory();
                data.location =ctrl.countryName  + data.location;
                data.languageInput && (data.language += ','+data.languageInput)
                delete data.languageInput
                model.agentInformation(data,function(res){
                    if (res.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS) {
                          window.location.href = X.config.common.link.qutation + "?id=" + ctrl.GetQueryString("id")  
                    }
            })

    	}},
        addCategory : function(){
                var itemHtml = ctrl.view.find(".js-category-val");
                if (itemHtml.val()){
                var categoryHtml = '<div class="addInfo-category colff f16 bold br5 disib bgcd1 js-addCategory-html">';
                    categoryHtml += '  <span>'+itemHtml.val()+'</span><a class="addInfo-category-btn disib tac ml10 js-del-category fwn f22">×</a>';
                    categoryHtml += '</div>';
                    ctrl.view.find(".js-category-html").append(categoryHtml);
                    ctrl.view.find(".js-category-hidden-val").val(itemHtml.val())
                    ctrl.view.find("input[name='category']").valid()
                    itemHtml.val("");
                    events.delCategory();
                    ctrl.view.find(".js-category-error").text(" ");
                    if(ctrl.view.find(".js-addCategory-html").length >=6){
                        ctrl.view.find(".js-add-category").remove();
                        itemHtml.attr("disabled",true)
                    }
                }
        },
        delCategory : function(){
            ctrl.view.find(".js-del-category").click(function(){
                $(this).parent().remove()
                if(ctrl.view.find(".js-addCategory-html").length < 6){
                    if(ctrl.view.find(".js-add-category").length === 0){                        
                        var addHTML='<a class="addInfo-category-btn disib f16 bold tac ml10 js-add-category" style="background: #d1d1d1;color: #FFFFFF">+</a>'
                        ctrl.view.find(".js-category-val").attr("disabled",false).parent().append(addHTML);
                        ctrl.view.find(".js-add-category").click(function(){events.addCategory()})
                    }
                    if(ctrl.view.find(".js-addCategory-html").length === 0){
                        ctrl.view.find(".js-category-hidden-val").val("")  
                        ctrl.view.find("input[name='category']").valid() 
                    }
                }
            })
        },
        triggerPartTime: function() {
            /*var partTimeAgent = $('.part-time-agent', ctrl.view.el),
                partInput     = partTimeAgent.children('input')[0]

            $('.js-represent', ctrl.view.el).on('click', function() {
                partTimeAgent.toggleClass('none')
                !this.checked && (partInput.checked = false)

            })*/
            $('.js-represent-box', ctrl.view.el).find('input[type=checkbox]').on('click', function() { 
                this.value = this.checked? 1: 0
            })
        }
    };
    

    ctrl.load = function() {
    	view.render(function() {
            events.init();

    	})
    };
    ctrl.load();
    X.require(["modules.common.loadingTime"]);
    return ctrl
});