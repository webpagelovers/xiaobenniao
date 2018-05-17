X.define('modules.customerClearance._validates', function() {
   
    var addDrawer = {
        ignore: 'ignore',
        rules: {
            drawerCompany:                          { required: true,                                 rangelength: [2, 20]                   },
            taxpayerIdentityNumber:                 { required: true,                                 rangelength: [1, 20]                   },                       
            registrationNumber:                     { required: true,                                 rangelength: [1, 20]                   },
            addressDetailed:                        { required: true,                                 rangelength: [1, 50]                   },                     
            sourceOfSupply:                         { required: true,                                 rangelength: [1, 50]                   },
            customsRegistrationCode:                { required: true,                                 rangelength: [1, 20]                   },
            organizationCode:                       { required: true,                                 rangelength: [1, 20]                   },
            taxpayersThatTime:                      { required: true,                                                                        },
            addressProvince:                        { required: true,                                                                        },
            addressCity:                            { required: true,                                                                        },
            addressDistrict:                        { required: true,                                                                        },
            vatRates:                               { required: true                                                                         },
            exportRight:                            { required: true                                                                         },
            taxAttachment:                          { required: true                                                                         },
            taxpayerAttachment:                     { required: true                                                                         },        
            productList:                            { required: true                                                                         }
        },
        messages: {
            drawerCompany:                          { required: "请输入开票人公司名称",               rangelength: "字数在2-20字以内"        },
            taxpayerIdentityNumber:                 { required: "请输入纳税人识别号",                 rangelength: "字数在20字以内"          },
            registrationNumber:                     { required: "请输入营业执照注册号",               rangelength: "字数在20字以内"          },
            addressDetailed:                        { required: "请输入开票人地址",                   rangelength: "字数在50字以内"          },
            sourceOfSupply:                         { required: "请输入境内货源地",                   rangelength: "字数在50字以内"          },
            customsRegistrationCode:                { required: "请选择海关注册登记编码",             rangelength: "字数在20字以内"          },
            organizationCode:                       { required: "请选择组织机构代码",                 rangelength: "字数在20字以内"          },
            taxpayersThatTime:                      { required: "请输入一般纳税人认定时间"                                                   },
            addressProvince:                        { required: "请输入省"                                                                   },
            addressCity:                            { required: "请输入市"                                                                   },
            addressDistrict:                        { required: "请输入区"                                                                   },
            vatRates:                               { required: "请选择开票人增值税率"                                                       },
            exportRight:                            { required: "请添加出口权"                                                               },
            taxAttachment:                          { required: "请添加税务登记证副本照片"                                                   },
            taxpayerAttachment:                     { required: "请添加一般纳税人认证书照片"                                                 },
            productList:                            { required: "请添加至少一个关联产品"                                                     }
        },
        onkeyup: false,
        onfocusout: function (element) {
            var elem = $(element);
            elem.valid();
        },
        errorPlacement: function (error, element) {
            element.after(error)
        }
    }

    var _validates = {
        addDrawer: addDrawer
    }

    return _validates
})