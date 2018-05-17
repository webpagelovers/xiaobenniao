X.define("model.emailModel",function () {

    //临时测试数据
    var query = "js/data/mockData/purchasers.json";

    var email = X.config.email.api.email;
    var emailSetting = X.config.email.api.emailSetting;
    var emailTemplate = X.config.email.api.emailTemplate;
    var emailTest = X.config.email.api.emailTest;

    var emailModel = X.model.create("model.emailModel");

    emailModel.getEmail = function(callback){

        X.loadData({url:email,type:"GET",callback:function(result){
            if(result.statusCode=="2000000" || result.statusCode=="4000000"){
                var data = result.data[0];
                callback(data);
            }

        }})
    };

    emailModel.emailSetting = function(option){

        X.loadData({url:emailSetting,type:"POST",data:option.data,callback:function(result){
            if(result.statusCode=="2000000" || result.statusCode=="4000000"){
                var data = result.data[0];
                option.callback(data)
            }
        }})
    };

    emailModel.emailTemplate = function(option){

        X.loadData({url:emailTemplate,type:"POST",data:option.data,callback:function(result){
            if(result.statusCode=="2000000" || result.statusCode=="4000000"){
                var data = result.data[0];
                option.callback(data)
            }
        }})
    };

    emailModel.emailTest = function(option){

        var url = emailTest + "/?emailAddress=" + option.data.emailAddress;
        X.loadData({url:url,type:"POST",data:option.data,callback:function(result){
            if(result.statusCode=="2000000"){
                var data = result.data[0];
                option.callback(data)
            }
        }})
    };

    emailModel.constant ={
      emailType :{
            EMAIL:{key:"0",text:"绑定邮箱"},
            PASSWORD:{key:"1",text:"找回密码"},
            TESTEMAIL:{key:"2",text:"测试邮箱"}
      }
    };




    return emailModel;
});
