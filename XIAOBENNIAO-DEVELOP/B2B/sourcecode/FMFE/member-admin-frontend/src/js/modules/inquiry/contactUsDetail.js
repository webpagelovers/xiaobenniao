X.define("modules.inquiry.contactUsDetail", ["model.inquiryModel"], function (inquiryModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.contactUsDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var events = {
        init: function(data,para) {
            var that = this;
            ctrl.view.el.find(".js-addButton").click(function(){
                var info = {};
                if(data && data.internationalFeedback){
                    data.postTime ? info.postTime = data.postTime : '';
                    data.internationalFeedback.firstName ? info.firstName = data.internationalFeedback.firstName : '';
                    data.internationalFeedback.lastName ? info.lastName = data.internationalFeedback.lastName : '';
                    data.internationalFeedback.email ? info.email = data.internationalFeedback.email : '';
                    data.internationalFeedback.subject ? info.subject = data.internationalFeedback.subject : '';
                    data.internationalFeedback.message ? info.message = data.internationalFeedback.message : '';

                    that.setCookie('info',JSON.stringify(info));
                }
                X.router.run("m=inquiry.addRFQ");
            });

            that.changeState(para.contactUsId);
        },
        setCookie:function(name,value){
            document.cookie = name +"=" + value + "; path='/';" ;
        },
        getCookie:function(name){
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++)
            {
                var aCrumb = aCookie[i].split("=");
                if (name == aCrumb[0])
                    return unescape(aCrumb[1]);
            }
            return null;
        },
        changeState: function(id){
            var callback = function(result){
                if (result.statusCode ===  X.constructor.prototype.constant.statusCode.SUCCESS){
                    console.log('状态修改成功')
                }
            };
            inquiryModel.updateState(id,callback)
        }
    };


    ctrl.load = function(para) {
        inquiryModel.query(para.contactUsId, function(result) {
            var data = result.data[0];
            if (result.statusCode ===  X.constructor.prototype.constant.statusCode.SUCCESS){
                var dateMatch = /^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/;
                if(data.internationalFeedback) {
                    if(data.internationalFeedback.createTime){
                        if (data.internationalFeedback.createTime.match(dateMatch)) {
                            data.postTime = data.internationalFeedback.createTime.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
                        }
                    }
                }

                data.localAccessDate ? data.localAccessDate = data.localAccessDate +'(当地时间)；':'';
                data.userBrowseInfo ? (data.userBrowseInfo.firstAccessDate ? data.userBrowseInfo.firstAccessDate = data.userBrowseInfo.firstAccessDate +'(北京时间)':'') :'';
                data.userBrowseInfo ? ((data.userBrowseInfo.firstAccessDate && data.localAccessDate) ? data.userBrowseInfo.firstAccessDate = data.localAccessDate + data.userBrowseInfo.firstAccessDate:''):'';

                data.userBrowseInfo ? (data.userBrowseInfo.countryAbb ? data.userBrowseInfo.ip = data.userBrowseInfo.ip + ' '+ data.country.abb + ' '+ data.country.nameCn :'') :'';

                data.localCreateTime ? data.localCreateTime = data.localCreateTime +'(当地时间)；':'';
                data.internationalFeedback ? (data.internationalFeedback.createTime ? data.createTime = data.internationalFeedback.createTime +'(北京时间)':''):'';
                data.internationalFeedback ? ((data.internationalFeedback.createTime && data.localCreateTime) ? data.createTime = data.localCreateTime + data.createTime:'') :'';

            }
            view.render(data, function() {
                events.init(data,para)
            })
        })
    }

    return ctrl
});
