;(function (_$) {

    var ROOT_PATH = window.X.config.PATH_FILE.path.rootUrl;

    var ruls = {
        iphone: function (value, element) {
            var length = value.length;
            return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
        },
        email: function (value, element) {
            return this.optional(element) || /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(value)
        }/*1118*/
        ,
        name: function (value, element) {
            return this.optional(element) || /^[a-zA-Z0-9]\w{3,20}$/.test(value);
        }

    };

    //短信验证码实时校验
    _$.validator.addMethod("telCode", function (value, element) {

        var flag = 0;

        _$.ajax({
            type: "PUT",
            url: mesCode + "/VerificationCode/check?"+"mobile="+$("#tel").val()+"&verificationCode="+value,
            async: false, //同步方法，如果用异步的话，flag永远为1
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data;
                }
            }
        });

        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, "验证码输入错误!");

    //验证手机是否被注册
    _$.validator.addMethod("isIphone", function (value, element) {

        var flag = 1;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "/user/check",
            async: false,
            data: toStringify({
                'mobile': value
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data;
                }
            }
        });

        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, '您的手机号已被注册！');

    //验证是否被注册
    _$.validator.addMethod("checkFiled", function (value, element) {

        var me  = $(element),
            url  = me.attr('checkFieldUrl'),
            name = me.attr('name'),
            flag = false,
            data = {};
        data[name] = value

        var callback = function(result) {
            var data = result.data
            data instanceof Array && (data = data[0])
            var val = data[Object.keys(data)[0]]

            flag = result.statusCode == '2000000'? (val? false: true) : false
        }

        _$.ajax({
            type: "POST",
            async: false,
            url: ROOT_PATH + url,
            data: toStringify(data),
            success: callback
        });

        return flag

    }, '已被注册！');

    //图片验证码实时校验
    _$.validator.addMethod("verCode", function (value, element) {
        var url = $(img).attr("src").split("/");
        var flag = 0;
        _$.ajax({
            type: "POST",
            url: imgUrl + "/ImageVerificationCode/check/"+value+"/"+url[url.length],
            async: false, //同步方法，如果用异步的话，flag永远为1
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = 1;
                }
            }
        });

        if (flag) {
            return true;
        } else {
            return false;
        }

    }, "验证码输入错误!");

    //验证角色是否被添加
    _$.validator.addMethod("isRole", function (value, element) {

        var flag = 1;

        _$.ajax({
            type: "GET",
            url: ROOT_PATH+"/role/exists/"+value,
            async: false,
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data;
                }
            }
        });

        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, '角色已被注册！');

    //验证邮箱是否被注册
    _$.validator.addMethod("isEmail", function (value, element, option) {

        var flag = 1;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "/user/verifyEmail",
            async: false,
            data: toStringify({
                'email': value
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data[0].code ;
                }
            }
        });
        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, '您的邮箱账号已被注册，<a class="js-regSign" data-type="email" href="javascript:;">使用邮箱账号登录！</a>');

    //验证用户名是否被注册
    _$.validator.addMethod("isUserName", function (value, element) {

        var flag = 1;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "/user/check",
            async: false,
            data: toStringify({
                'userName': value
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data;
                }
            }
        });

        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, '您的用户名已被注册');


    //验证用户原密码
    _$.validator.addMethod("isUserPas", function (value, element) {

        var flag;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "/backendUser/checkPassword",
            async: false, //同步方法，如果用异步的话，flag永远为1
            data: toStringify({
                'password': value
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = true;
                }else{
                    flag = false;
                }
            }
        });

        return flag;
    }, "验证码输入错误!");

    //验证新增管理员登录名是否被注册
    _$.validator.addMethod("isAdminName", function (value, element) {

        var flag = 1;

        _$.ajax({
            type: "GET",
            url: ROOT_PATH + "/backendUser/exist/"+value,
            async: false,
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data;
                }
            }
        });

        if (flag == 1) {
            return false;
        } else if(flag == 0){
            return true;
        }

    }, '您的用户名已被注册');

    //验证身份证的唯一性
    _$.validator.addMethod('isCardNumber', function (value, element) {

        var $_element = $(element);

        if ($_element.data('source') === $_element.val())
            return true;

        var flag = 1;
        _$.ajax({
            url: xbnConfig.PATH_FILE.path.root + xbnConfig.join.uri.userCardNumber,
            type: 'POST',
            async: false,
            data: JSON.stringify({registeredNo: value}),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    flag = data.data ? 1 : 0;
                }
            }
        });
        if (flag) {
            return true;
        } else {
            return false;
        }

    }, '该证件号码已申请入驻，如有疑问请联系：4000885691<em></em>');

    // 验证某个数据是否在max和min之间
    _$.validator.addMethod("isCheckRightRange", function (value, element, option) {
        var max = min = null,
            retrunRes = true;
        element = $(element);
        // own 获取当前节点的attr
        if (option.type == 'own') {
            max = option.max ? element.attr(option.max) : null;
            min = option.min ? element.attr(option.min) : null;
        } else if (option.type == 'siblings' || option.type == 'dom') {
            if (option.type == 'siblings') {
                max = element.siblings(option.max);
                min = element.siblings(option.min);
            } else {
                max = $(option.max);
                min = $(option.min);
            }
            max = max ? (max.val() || max.html()) : null;
            min = min ? (min.val() || min.html()) : null;
        } else if (option.type == 'number') {
            max = option.max;
            min = option.min;
        }
        if (max) {
            retrunRes = Number(max) > value;
        }
        if (min) {
            retrunRes = retrunRes && (Number(min) < value);
        }
        return retrunRes;
    }, 'hghg');

    //验证手机号码,用户名，邮箱是否会员
    _$.validator.addMethod("isnotIphone", function (value, element) {
        value = $.trim(value);
        var flag = true,
            source = {},
            uri = ROOT_PATH + "api/user/verify/",
            iphone = ruls.iphone.call(this, value, element),
            email = ruls.email.call(this, value, element),
            name = ruls.name.call(this, value, element);

        if (iphone) {
            source["mobile"] = value;
        } else if (email) {
            source["email"] = value;
        } else if (name) {
            source["name"] = value;
        }

        _$.ajax({
            type: "POST",
            url: uri,
            async: false,
            data: toStringify(source),
            success: function (data) {

                if (data.statusCode == '2000000') {
                    if (iphone) {
                        flag = data.data ? false : true;
                    } else
                    if (email) {
                        flag = data.data ? false : true;
                    } else
                    if (name) {
                        flag = data.data ? false : true;
                    }
                }
            }
        });
        return flag;
    }, '该账号不存在！');

    //验证登录密码
    _$.validator.addMethod("isPassWord", function (value, element) {
        var flag = 0;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "api/user/pwd/verify",
            dataType: "json",
            async: false,
            data: toStringify({
                'id': store.get("user").id,
                'password': hex_md5(value)
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    return flag = data.data ? 1 : 0;
                }
            }
        });

        if (flag) {
            return true;
        } else {
            return false;
        }

    }, '密码错误!<em></em>');

    //验证登录密码
    _$.validator.addMethod("isNotPassWord", function (value, element) {
        var flag = 0;

        _$.ajax({
            type: "POST",
            url: ROOT_PATH + "api/user/pwd/verify",
            dataType: "json",
            async: false,
            data: toStringify({
                'id': store.get("user").id,
                'password': hex_md5(value)
            }),
            success: function (data) {
                if (data.statusCode == '2000000') {
                    return flag = data.data ? 1 : 0;
                }
            }
        });

        if (flag) {
            return false;
        } else {
            return true;
        }

    }, '与原密码相同!<em></em>');

    //验证radio单选框
    _$.validator.addMethod("radioCheck", function (value, element) {
        var elem = $(element),
            str = elem.data("name");

        var radioBox = $("[data-name=" + str + "]:checked");

        var state = false;

        if (radioBox.length != 0) {
            state = true;
        } else {
            state = false;
        }

        return state;

    });

    //判断邮箱或手机输入是否正确
    _$.validator.addMethod("isphoneAndemail", function (value, element) {
        return ruls.iphone.call(this, value, element) || ruls.email.call(this, value, element);
    }, "请输入有效手机号或邮箱地址!");



    //判断用户名是否正确
    _$.validator.addMethod("isName", function (value, element) {
        return ruls.name.call(this, value, element);
    }, "用户名不存在");

    // 判断整数value是否等于0
    _$.validator.addMethod("isIntEqZero", function (value, element) {
        value = parseInt(value);
        return this.optional(element) || value == 0;
    });

    // 判断密码不能为手机号
    _$.validator.addMethod("equalFalse", function (value, element, option) {

        var _val = option.elem;

        for (prop in option.target) {
            if (option.target[prop].val() != "") {
                if (_val.val() == option.target[prop].val()) {
                    return false;
                }
            }
        }
        return true;
    });

    //验证中文字符长度
    _$.validator.addMethod("maxCnLength", function (value, element, options) {
        var len = value.replace(/[^\x00-\xff]/g, "**").length;
        return this.optional(element) || Number(len) <= Number(options);
    }, "您输入的文字已超过!");

    //判断是否url
    _$.validator.addMethod("isUrl", function (value, element) {
        return this.optional(element) || (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value));
    }, "请输入有效的url!");

    // 只包含数字和字母
    _$.validator.addMethod("isNumLetter", function (value, element) {
        var values = parseInt(value);
        return this.optional(element) || (/^[\d\-\sA-Za-z]*$/.test(value));
    }, "手机电话格式不正确");

    // 只包含数字和字母(纯数字和字母)
    _$.validator.addMethod("isNumCharacter", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]{5,18}$/.test(value);
    }, "格式不正确");


    // 判断APAC电话
    _$.validator.addMethod("isAPACPhone", function (value, element) {
        var values = parseInt(value);
        return this.optional(element) || (/^[\d\+\-\(\)\s]*$/.test(value));
    }, "手机电话格式不正确");

    // 判断整数value是否大于0
    _$.validator.addMethod("isIntGtZero", function (value, element) {
        var values = parseInt(value);
        return this.optional(element) || values > 0 && /^[^0].*/.test(value);
    });

    // 判断整数value是否大于或等于0
    _$.validator.addMethod("isIntGteZero", function (value, element) {
        value = parseInt(value);
        return this.optional(element) || value >= 0;
    }, "整数必须大于或等于0");

    // 判断整数value是否不等于0
    _$.validator.addMethod("isIntNEqZero", function (value, element) {
        value = parseInt(value);
        return this.optional(element) || value != 0;
    }, "整数必须不等于0");

    // 判断大于0的正整数
    _$.validator.addMethod("isIntGtZeroExtend", function (value, element) {
        return this.optional(element) || (/^[1-9]\d*$/.test(value));
    }, "大于等于0的正整数");

    // 判断大于等于0的正整数
    _$.validator.addMethod("isIntGteZeroExtend", function (value, element) {
        //value = parseInt(value);
        return this.optional(element) || (/^([1-9][\d]*|0)$/.test(value));
    }, "大于等于0的正整数");

    // 判断整数value是否小于0
    _$.validator.addMethod("isIntLtZero", function (value, element) {
        value = parseInt(value);
        return this.optional(element) || value < 0;
    }, "整数必须小于0");

    // 判断整数value是否小于或等于0
    _$.validator.addMethod("isIntLteZero", function (value, element) {
        value = parseInt(value);
        return this.optional(element) || value <= 0;
    }, "整数必须小于或等于0");

    // 判断浮点数value是否等于0
    _$.validator.addMethod("isFloatEqZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value == 0;
    }, "浮点数必须为0");

    // 判断浮点数value是否大于0
    _$.validator.addMethod("isFloatGtZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value > 0;
    }, "浮点数必须大于0");

    // 判断浮点数value是否大于或等于0
    _$.validator.addMethod("isFloatGteZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value >= 0;
    }, "浮点数必须大于或等于0");

    // 判断浮点数value是否不等于0
    _$.validator.addMethod("isFloatNEqZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value != 0;
    }, "浮点数必须不等于0");

    // 判断浮点数value是否小于0
    _$.validator.addMethod("isFloatLtZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value < 0;
    }, "浮点数必须小于0");

    // 判断浮点数value是否小于或等于0
    _$.validator.addMethod("isFloatLteZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value <= 0;
    }, "浮点数必须小于或等于0");

    // 判断浮点型
    _$.validator.addMethod("isFloat", function (value, element) {
        return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);
    }, "只能包含数字、小数点等字符");

    // 匹配integer
    _$.validator.addMethod("isInteger", function (value, element) {
        return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value) >= 0);
    }, "匹配integer");

    // 判断数值类型，包括整数和浮点数
    _$.validator.addMethod("isNumber", function (value, element) {
        return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);
    }, "匹配数值类型，包括整数和浮点数");

    // 判断数值类型（最多两位小数）
    _$.validator.addMethod("isNumberFloat2", function (value, element) {
        return this.optional(element) || /^([1-9][\d]{0,}|0)(\.[\d]{1,2})?$/.test(value);
    }, "最多可有两位小数");

    // 判断数值类型（最多两位小数）
    _$.validator.addMethod("isNumberFloat", function (value, element, params) {

        return this.optional(element) || new RegExp('^([1-9][\\d]{0,}|0)(\\.[\\d]{1,' + params + '})?$').test(value);
        //return this.optional(element) || /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value) ;
    }, "最多可有两位小数");

    // 最大价格99999.99
    _$.validator.addMethod("isMaxPrice", function (value, element) {
        return this.optional(element) || (value < '9999.99');
    }, "最大价格99999.99");

    // 只能输入[0-9]数字
    _$.validator.addMethod("isDigits", function (value, element) {
        return this.optional(element) || /^\d+$/.test(value);
    }, "只能输入0-9数字");

    _$.validator.addMethod("isDigitsLen", function (value, element) {
        value = $.trim(value);
        return this.optional(element) || (value.length == 6 && /^\d+$/.test(value));
    }, "只能输入0-9数字");

    // 不包含[0-9]数字
    _$.validator.addMethod("isNoDigits", function (value, element) {
        return this.optional(element) || !/\d+/.test(value);
    }, "不能包含数字");

    // 判断中文字符
    _$.validator.addMethod("isChinese", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "只能包含中文字符。");

    // 手机号码验证
    _$.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(value));
    }, "请输入13/14/15/17/18开头的手机号！");

    // 电话号码验证
    _$.validator.addMethod("isPhone", function (value, element) {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写您的电话号码。");

    // 空格验证
    _$.validator.addMethod("isSpace", function (value, element) {
        var space = /\s+/g;
        return this.optional(element) || (!space.test(value));
    }, "不能输入空格。");

    // 联系电话(手机/电话皆可)验证
    _$.validator.addMethod("isTel", function (value, element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || tel.test(value) || (length == 11 && mobile.test(value));
    }, "请正确填写您的联系方式");

    //字母、数字及“-”，不能以下划线开头
    _$.validator.addMethod("isName", function (value, element) {
        return this.optional(element) || (/^[a-zA-Z0-9]\w{4,20}$/.test(value));
    }, "请正确填写您的用户名。");

    // 匹配qq
    _$.validator.addMethod("isQq", function (value, element) {
        return this.optional(element) || /^[1-9]\d{4,12}$/;
    }, "匹配QQ");

    // 邮政编码验证
    _$.validator.addMethod("isZipCode", function (value, element) {
        var zip = /^[0-9]{6}$/;
        return this.optional(element) || (zip.test(value));
    }, "请正确填写您的邮政编码。");

    // 匹配密码，以字母开头，长度在6-16之间，只能包含字符、数字和下划线。
    _$.validator.addMethod("isPwd", function (value, element) {
        return this.optional(element) || /^[a-zA-Z]\\w{6,16}$/.test(value);
    }, "以字母开头，长度在6-16之间，只能包含字符、数字和下划线。");

    // 匹配密码，必须包含字母、大小写、数字、特殊字符其中两种规则。
    _$.validator.addMethod("strongPsw", function (value, element) {
        if(passwordLevel(value)==1){return false;}
        return true;
        function passwordLevel(password) {
            var Modes = 0;
            for (i = 0; i < password.length; i++) {
                Modes |= CharMode(password.charCodeAt(i));
            }
            return bitTotal(Modes);
            //CharMode函数
            function CharMode(iN) {
                if (iN >= 48 && iN <= 57)//数字
                    return 1;
                if (iN >= 65 && iN <= 90) //大写字母
                    return 2;
                if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
                //大小写
                    return 4;
                else
                    return 8; //特殊字符
            }
            //bitTotal函数
            function bitTotal(num) {
                modes = 0;
                for (i = 0; i < 4; i++) {
                    if (num & 1) modes++;
                    num >>>= 1;
                }
                return modes;
            }
        }
    }, "密码必须包含字母、大小写、数字、特殊字符其中两种规则");

    // 身份证号码验证
    _$.validator.addMethod("isIdCardNo", function (value, element) {
        //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
        return this.optional(element) || isIdCardNo(value);
    }, "请输入正确的身份证号码。");

    // IP地址验证
    _$.validator.addMethod("ip", function (value, element) {
        return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
    }, "请填写正确的IP地址。");

    // 字符验证，只能包含中文、英文、数字、下划线等字符。
    _$.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, "只能包含中文、英文、数字、下划线等字符");

    // 匹配english
    _$.validator.addMethod("isEnglish", function (value, element) {
        return this.optional(element) || /^[A-Za-z]|\s+$/.test(value);
    }, "匹配english");

    //匹配英文地址
    _$.validator.addMethod("enAddress", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9]|\s|[,.]+$/.test(value);
    }, "匹配english");

    // 匹配汉字
    _$.validator.addMethod("isChinese", function (value, element) {
        return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
    }, "匹配汉字");

    // 只能为中文和数字
    _$.validator.addMethod("isChineseNumber", function (value, element) {
        return this.optional(element) || /^[0-9\u4E00-\u9FA5]+$/.test(value);
    }, "只能为中文和数字。");

    // 匹配中文(包括汉字和字符)
    _$.validator.addMethod("isChineseChar", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "匹配中文(包括汉字和字符) ");

    // 只能输入字母，数字，特殊字符
    _$.validator.addMethod("isEnglishNumberSpecialChar", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9(\-)(\《)(\》)(\>)(\<)(\_)(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\")(\")(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]*$/.test(value);
    }, "不能输入中文 ");

    // 判断是否为合法字符(a-zA-Z0-9-_)
    _$.validator.addMethod("isRightfulString", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
    }, "判断是否为合法字符(a-zA-Z0-9-_)");

    // 判断是否包含中英文特殊字符，除英文"-_"字符外
    _$.validator.addMethod("isContainsSpecialChar", function (value, element) {
        var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
        return this.optional(element) || !reg.test(value);
    }, "含有中英文特殊字符");

    // 判断是否包含中英文特殊字符，除英文"-_"字符以及空格外
    _$.validator.addMethod("isContainsSpecialCharNotSpace", function (value, element) {
        var reg = RegExp(/[(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
        return this.optional(element) || !reg.test(value);
    }, "含有中英文特殊字符");

    // 判断是否包为SKU格式(包括  英文，数字，-，_)
    _$.validator.addMethod("isSKU", function (value, element) {
        return this.optional(element) || /^[\w\-]+$/.test(value);
    }, "");

    // 判断是否小于某个数值
    _$.validator.addMethod("LessThanNum", function (value, element, params) {
        return this.optional(element) || Number(value) <= Number(params);
    }, "");

    // 匹配中文 字母  空格
    _$.validator.addMethod("isGroupByCnWordsSpace", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5a-zA-Z\s\d]*$/.test(value);
    }, "");
    // 判断数值类型（最多三位小数）
    _$.validator.addMethod("isNumberFloat3", function (value, element) {
        return this.optional(element) || /^([1-9][\d]{0,7}|0)(\.[\d]{1,3})?$/.test(value) ;
    }, "最多可有两位小数");

    // 判断数值类型（最多一位小数）
    _$.validator.addMethod("isNumberFloat1", function (value, element) {
        return this.optional(element) || /^([1-9][\d]{0,}|0)(\.[\d]{1,1})?$/.test(value) ;
    }, "最多可有两位小数");

    // 判断数值类型（最多两位小数）
    _$.validator.addMethod("isNumberFloat", function (value, element, params) {

        return this.optional(element) || new RegExp('^([1-9][\\d]{0,}|0)(\\.[\\d]{1,' + params + '})?$').test(value);
        //return this.optional(element) || /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value) ;
    }, "最多可有两位小数");

    //判断数值类型，整数长度最多params[0]位，小数部分params[1]位
    _$.validator.addMethod("isNumberFloatWithLength", function (value, element, params) {
        return this.optional(element) || new RegExp('^([1-9]\\d{0,'+(params[0]-1)+'}|0)(\\.\\d{1,'+ params[1] +'})?$').test(value) ;
    }, "最多可有两位小数");

    //验证输入文本不能输入某些字符串 params[0]=>不能输入字符  params[1]=>分割字符串
    _$.validator.addMethod("isContainSomeWords", function (value, element, params) {
        var arr=params[0].toString().split(params[1]||',');
        var val = value.split(" ");
        var onoff = false;
        if(value){
            $.each(arr,function(i,e){
                $.each(val,function(j,d){
                    if(e.toLowerCase()==d.toLowerCase()){
                        onoff = true;
                        return false;
                    }
                })
                if(onoff)
                    return false;
            })
        }
        return !onoff;

    }, "");

    //判断数值类型（最多两位小数，params支持数字的定义）
    _$.validator.addMethod("isIntFloat2", function (value, element, params) {
        return this.optional(element) || new RegExp("^(?!0(\\d|\\.0+$|$))\\d{1,"+params+"}(\\.\\d{1,2})?$").test(value);
    }, "最多支持{0}位整数，小数点后两位");

    //元素的值介于params[0]和params[1]之间的整数
    _$.validator.addMethod("reqiredRange", function (value, element, params) {
        //支持[2,20,1] 第三个参数传不同的数字，对应这里的分隔符，第三个参数只能传数字，不能传字符类
        var result =false;
        var reg = /^\d+$/;
        if(value){
            if (params[2]) {
                var splitDotArr = [',', '|', ':'];
                result = value.split(splitDotArr[params[2] - 1]).length >= params[0] && value.split(splitDotArr[params[2] - 1]).length <= params[1];
            }else{
                result = reg.test(value) && value >= params[0] && value <= params[1];
            }
        }
        return result;
    }, "不能小于{0}且不大于{1}");

    //运送时间的区间验证
    _$.validator.addMethod("numberGroup", function (value, element) {
        var min_shipping_time = parseInt($($(element).data('numbergroup')).find('input[name*=min-ship-time]').val());
        var max_shipping_time = parseInt($($(element).data('numbergroup')).find('input[name*=max-ship-time]').val());

        if (min_shipping_time && max_shipping_time && min_shipping_time%1==0 && max_shipping_time%1==0) {
            if (min_shipping_time >= 1 && max_shipping_time < 100) {
                return true;
            }
        }
        return false;
    }, "格式错误，请填写1-99的整数<em></em>");
    //自定义wish属性值
    _$.validator.addMethod("selfDefineWish", function (value, element, params) {
        if(!value.length) return true;
        if(params[0]=='Area'){
            // var area_format_1 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            //var area_format_2 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|X|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            var area_format_1 = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\\'|ft\\.?|feet)\\s*(\\*|x|by)\\s*(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\\'|ft\\.?|feet)$","gi");
            var area_format_2 = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\\'|ft\\.?|feet)\\s*(\\*|x|by)\\s*(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\\'|ft\\.?|feet)\\s*(\\*|x|X|by)\\s*(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\\'|ft\\.?|feet)$","gi");

            if (value.match(area_format_1) || value.match(area_format_2))
                return true;
        }else if(params[0]=='Length'){
            //var length_format_1 = /^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            //var length_format_2 = /^(\d+(\.\d+)?)\s*(ft.?|feet|\')\s*(\d+(\.\d+)?)\s*(in\.?|inche(es)?|\")$/gi;
            var length_format_1 = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mm|cm|m|in\\.?|inch(es)?|\"|\'|ft\.?|feet)$","gi");
            var length_format_2 = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(ft.?|feet|\\')\\s*(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(in\\.?|inche(es)?|\")$","gi");
            if (value.match(length_format_1) || value.match(length_format_2))
                return true;
        }else if(params[0]=='Volume'){
            //var volume_format = /^(\d+(\.\d+)?)\s*(ml|l|oz\.?|m\^3|cm\^3|gallon|quart|cup|qt\.?|pt\.?|litre|liter|pint|fl\.?\s?oz\.?)s?$/gi;
            var volume_format = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(ml|l|oz\\.?|m\\^3|cm\\^3|gallon|quart|cup|qt\\.?|pt\\.?|litre|liter|pint|fl\\.?\\s?oz\\.?)s?$","gi");
            if (value.match(volume_format))
                return true;
        }else if(params[0]=='Voltage'){
            //var voltage_format = /^(\d+(\.\d+)?)\s*v$/gi;
            var voltage_format = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*v$","gi");
            if (value.match(voltage_format))
                return true;
        }else if(params[0]=='Wattage'){
            //var wattage_format = /^(\d+(\.\d+)?)\s*w$/gi;
            var wattage_format = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*w$","gi");
            if (value.match(wattage_format))
                return true;
        }else if(params[0]=='Weight'){
            //var weight_format = /^(\d+(\.\d+))\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
            //var weight_format = /^(\d+(\.\d+)?)\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
            var weight_format = new RegExp("^(\\d{1,"+params[1]+"}(\\.\\d{1,2})?)\\s*(mg|g|kg|oz\\.?|ounce|gram|pound|lb)s?$","gi");
            var weival = parseFloat(value);
            if (value.match(weight_format)){// && new RegExp("^(?!0(\\d|\\.0+$|$))\\d{1,"+params[1]+"}(\\.\\d{1,2})?$").test(weival)){
                return true;
            }
        }else if(params[0]=='Numbers'){
            return !isNaN(parseFloat(value)) && isFinite(value) && new RegExp("^(?!0(\\d|\\.0+$|$))\\d{1,"+params[1]+"}(\\.\\d{1,2})?$").test(value);
        }
        return false;
    }, "请输入1-999999.99之间的数值。<em></em>");


    //wish刊登标题允许的特殊字符
    _$.validator.addMethod("wishAllowedSymbols", function (value, element) {
        return /^[a-z\d\s\'\"\<\>\(\)\-\_\.\/°\&]+$/i.test(value);
    }, "只允许输入空格()&lt;&gt;-_&quot;'./°&特殊字符<em></em>");

    //wish商品标签允许的特殊字符
    _$.validator.addMethod("wishLabel", function (value, element) {
        if(!value) return true;
        return /^[a-z\s\'\,\，\.\d]+$/i.test(value);
    }, "只能包含英文字符、'、空格<em></em>");

    // 最大价格99999.99
    _$.validator.addMethod("isMaxPrice", function (value, element) {
        return this.optional(element) || (value < '9999.99');
    }, "最大价格99999.99");

    // 只能输入[0-9]数字
    _$.validator.addMethod("isDigits", function (value, element) {
        return this.optional(element) || /^\d+$/.test(value);
    }, "只能输入0-9数字");

    //只能输入开头不为0的数字
    _$.validator.addMethod("isDigitsGt0", function (value, element,params) {
        return this.optional(element) || /^[1-9]\d*$/.test(value);
    }, "数字无效");

    //大于某一个选项里的数字
    _$.validator.addMethod("isGtTo", function (value, element,param) {
        var target = $(param);
        return target.val().length&&parseFloat(value) >= parseFloat(target.val());
    }, "结束项必须大于开始项");

    _$.validator.addMethod("isDigitsLen", function (value, element) {
        value = $.trim(value);
        return this.optional(element) || (value.length == 6 && /^\d+$/.test(value));
    }, "只能输入0-9数字");

    _$.validator.addMethod("isLengthN", function (value, element, param) {
        return this.optional(element) || value.length === param;
    }, "长度不符合限制<em></em>");


    // 不包含[0-9]数字
    _$.validator.addMethod("isNoDigits", function (value, element) {
        return this.optional(element) || !/\d+/.test(value);
    }, "不能包含数字");

    // 判断中文字符
    _$.validator.addMethod("isChinese", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "只能包含中文字符。");

    // 只能包含字母、数字、英文横杠
    _$.validator.addMethod("isWordNumBar", function (value, element) {
        return this.optional(element) || /^[A-Za-z\d\-]+$/.test(value);
    }, "只能包含中文字符。");

    // 只能包含字母、下横杠
    _$.validator.addMethod("isWordUnderbar", function (value, element) {
        return this.optional(element) || /^[A-Za-z\_\s]+$/.test(value);
    }, "只能包含中文字符。");
    // 只能包含字母、数字、句号
    _$.validator.addMethod("isWordNumStop", function (value, element) {
        return this.optional(element) || /^[\d\.]+$/.test(value);
    }, "只能包含中文字符。");

    // 手机号码验证
    _$.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(value));
    }, "请输入13/14/15/17/18开头的手机号！");

    // 电话号码验证
    _$.validator.addMethod("isPhone", function (value, element) {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写您的电话号码。");

    // 空格验证
    _$.validator.addMethod("isSpace", function (value, element) {
        var space = /\s+/g;
        return this.optional(element) || (!space.test(value));
    }, "不能输入空格。");

    // 联系电话(手机/电话皆可)验证
    _$.validator.addMethod("isTel", function (value, element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || tel.test(value) || (length == 11 && mobile.test(value));
    }, "请正确填写您的联系方式");

    //字母、数字及“-”，不能以下划线开头
    _$.validator.addMethod("isName", function (value, element) {
        return this.optional(element) || (/^[a-zA-Z0-9]\w{4,20}$/.test(value));
    }, "请正确填写您的用户名。");

    //字母、数字及“-”，只能以字母开头
    _$.validator.addMethod("isFirstName", function (value, element) {
        return this.optional(element) || (/^[a-zA-Z]\w{4,20}$/.test(value));
    }, "请正确填写您的用户名。");

    // 匹配qq
    _$.validator.addMethod("isQq", function (value, element) {
        return this.optional(element) || /^[1-9]\d{4,12}$/;
    }, "匹配QQ");

    // 邮政编码验证
    _$.validator.addMethod("isZipCode", function (value, element) {
        if ($("input[name='country']").attr("index-data") === 'CN') {
            var zip = /^[0-9]{6}$/;
            return this.optional(element) || (zip.test(value));
        } else {
            var zip = /^[0-9A-Za-z]{4,9}$/;
            return this.optional(element) || (zip.test(value));
        }
    }, "请正确填写您的邮政编码。");

    // 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
    _$.validator.addMethod("isPwd", function (value, element) {
        return this.optional(element) || /^[a-zA-Z]\\w{6,12}$/.test(value);
    }, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");

    // 身份证号码验证
    _$.validator.addMethod("isIdCardNo", function (value, element) {
        //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
        return this.optional(element) || isIdCardNo(value);
    }, "请输入正确的身份证号码。");

    // IP地址验证
    _$.validator.addMethod("ip", function (value, element) {
        return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
    }, "请填写正确的IP地址。");

    // 字符验证，只能包含中文、英文、数字、下划线等字符。
    _$.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, "只能包含中文、英文、数字、下划线等字符");

    //匹配英文地址
    _$.validator.addMethod("enAddress", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9]|\s|[,.]+$/.test(value);
    }, "匹配english");

    // 匹配汉字
    _$.validator.addMethod("isChinese", function (value, element) {
        return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
    }, "匹配汉字");

    // 匹配中文(包括汉字和字符)
    _$.validator.addMethod("isChineseChar", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "匹配中文(包括汉字和字符) ");

    // 判断是否为合法字符(a-zA-Z0-9-_)
    _$.validator.addMethod("isRightfulString", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
    }, "判断是否为合法字符(a-zA-Z0-9-_)");

    // 判断是否包含中英文特殊字符，除英文"-_"字符外
    _$.validator.addMethod("isContainsSpecialChar", function (value, element) {
        var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
        return this.optional(element) || !reg.test(value);
    }, "含有中英文特殊字符");

    // 判断是否包含中英文特殊字符，除英文"-_"字符以及空格外
    _$.validator.addMethod("isContainsSpecialCharNotSpace", function (value, element) {
        var reg = RegExp(/[(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
        return this.optional(element) || !reg.test(value);
    }, "含有中英文特殊字符");

    // 判断是否包为SKU格式(包括  英文，数字，-，_)
    _$.validator.addMethod("isSKU", function (value, element) {
        return this.optional(element) || /^[\w\-]+$/.test(value);
    }, "");

    // 判断是否小于某个数值
    _$.validator.addMethod("LessThanNum", function (value, element, params) {
        return this.optional(element) || Number(value) <= Number(params);
    }, "");

    // 匹配中文 字母  空格
    _$.validator.addMethod("isGroupByCnWordsSpace", function (value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5a-zA-Z\s\d]*$/.test(value);
    }, "");

    // 判断SKU是否已存在
    _$.validator.addMethod("isSKUNoUsed", function (value, element) {
        var used = true;
        $('.muiltGuiGeMatch-showAll .muiltGuigeSku ,#singleGuiGeSKUInput').each(function () {
            var skuInput = $(this);
            if (skuInput.val() == value && !$(element).is(skuInput) && value != '') {
                used = false;
            }
        })

        return used;
    }, "该SKU已存在！");

    // 最大输入字符（汉子为两个字符）
    _$.validator.addMethod("maxLengthChar", function (value, element, pramas) {
        var reg = /[\u0391-\uFFE5]/g;
        var newStr = value.replace(reg, '??');
        if (newStr.length > pramas) {
            return false
        } else {
            return true
        }
    }, '');


    // 判断一组数据之和是否大于0(匹配站点编辑数量)
    _$.validator.addMethod("checkIsAllStockZero", function (value, element, pramas) {
        if(typeof pramas ==='string'){
            pramas = $(pramas);
        }
        var totalNum = 0;
        pramas.each(function (i, dom) {
            totalNum += parseInt($(dom).val() || 0);
        });
        return this.optional(element) || totalNum > 0;
    }, '多规格的数量之和不能等于0！');


    // 判断是否重名
    _$.validator.addMethod("isUnique", function (value, element, pramas) {
        var isClone = false;
        pramas.each(function (i, dom) {
            if ($(dom).html() == value) {
                isClone = true;
                return false;
            }
        });
        return this.optional(element) || !isClone;
    }, '已存在，请重新输入');

    // 原价大于销售价
    _$.validator.addMethod("beginPricemoreThanSalePrice", function (value, element, pramas) {


        if ($(element).closest('.matchGuigeItem').length) {
            if ($(element).attr('placeholder') == '销售价') {
                //原价
                var beginPriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigeBeginPrice');
                //销售价
                var salePriceInput = $(element);
            } else if ($(element).attr('placeholder') == '商品原价') {
                //原价
                var beginPriceInput = $(element);
                //销售价
                var salePriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigeSalePrice');
            }
        } else {
            //原价
            var beginPriceInput = $('.site-beginPrice');
            //销售价
            var salePriceInput = $('.site-price');
        }
        ;

        var beginPrice = strToNumber(beginPriceInput.val());
        var salePrice = strToNumber(salePriceInput.val());



        if (beginPrice == null || salePrice == null) {
            return true;
        } else {
            if (!isNaN(beginPrice) && !isNaN(salePrice)) {
                if (beginPrice >= salePrice) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    }, '');



    /*// A小于B
     _$.validator.addMethod("ALessThanB", function (value, element,pramas) {

     var A = pramas.A;
     var B = pramas.B;

     if( isNaN( A ) ){
     A = A.val();
     };

     if( isNaN( B ) ){
     B = B.val();
     };

     A = strToNumber(A);
     B = strToNumber(B);


     if( A == null  ||  B == null ){
     return true;
     };

     if(promotionPrice <= salePrice){
     return true;
     }else{
     return false;
     }

     }, '');*/

    // 促销价小于销售价
    _$.validator.addMethod("promotionPriceLessThanSalePrice", function (value, element, pramas) {




        if ($(element).closest('.matchGuigeItem').length) {
            if ($(element).attr('placeholder') == '销售价') {
                //促销价
                var promotionPriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigePromotionPrice');
                //销售价
                var salePriceInput = $(element);
            } else if ($(element).attr('placeholder') == '促销价') {
                //促销价
                var promotionPriceInput = $(element);
                //销售价
                var salePriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigeSalePrice');
            }
        } else {
            //促销价
            var promotionPriceInput = $('.site-promotionPrice');
            //销售价
            var salePriceInput = $('.site-price');
        }
        var promotionPrice = strToNumber(promotionPriceInput.val());
        var salePrice = strToNumber(salePriceInput.val());


        if (promotionPrice == null || salePrice == null) {
            return true;
        } else {
            if (!isNaN(promotionPrice) && !isNaN(salePrice)) {
                if (promotionPrice <= salePrice) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }, '');

    //验证海外仓无库存
    $.validator.addMethod("WmsLessThan0", function (value, element, pramas) {
        var wmsData = store.get('wmsData').data;
        var skuObj = Xbn().data1.objArrFilter(wmsData, 'sku', value)[0];
        return skuObj.num > 0;
    }, '');

    //验证海外仓是否超出库存
    $.validator.addMethod("WmsmoreThan", function (value, element,pramas) {

        var wmsData = store.get('wmsData').data;
        var skuObj = Xbn().data1.objArrFilter(wmsData,'sku',pramas.compare.val())[0];

        return skuObj.num >= value;
    }, '' );
    //验证海外仓SKU是否已存在
    $.validator.addMethod("WmsSku", function (value, element,pramas) {

        var flag = 0;

        _$.ajax({
            type : "get",
            url : ROOT_PATH + "owms/commodity/infoBySku?sku="+value,
            async : false, //同步方法，如果用异步的话，flag永远为1
            success : function (data) {
                if (data.statusCode == '2000000') {
                    if(!data.data){
                        flag = 1;
                    }
                }
            }
        });

        if (flag) {
            return true;
        } else {
            return false;
        }
    }, '' );



    // 建议售价必须大于销售价格
    _$.validator.addMethod("jianyiPricemoreThanSalePrice", function (value, element, pramas) {

        if ($(element).closest('.matchGuigeItem').length) {
            if ($(element).attr('placeholder') == '销售价') {
                //建议价
                var jianyiPriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigeSuggestPrice');
                //销售价
                var salePriceInput = $(element);
            } else if ($(element).attr('placeholder') == '建议价') {
                //建议价
                var jianyiPriceInput = $(element);
                //销售价
                var salePriceInput = $(element).closest('.matchGuigeItem').find('.muiltGuigeSalePrice');
            }
        } else {
            //建议价
            var jianyiPriceInput = $('.site-jianyiPrice');
            //销售价
            var salePriceInput = $('.site-price');
        }

        if (isNull(jianyiPriceInput) || isNull(salePriceInput)) {
            return true;
        } else {

            var jianyiPrice = Number(jianyiPriceInput.val());
            var salePrice = Number(salePriceInput.val());

            if (!isNaN(jianyiPrice) && !isNaN(salePrice)) {
                if (jianyiPrice > salePrice) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    }, '');

    // 开始时间小于 结束时间
    $.validator.addMethod("startLessEnd", function (value, element) {

        //$.validator.addMethod("isTimeSmaller", function (value,element) {
        if ($(element).is($('[name^=promotionStart]'))) {

            var start = $(element);
            var end = $(element).closest('.matchGuigeItem').find('.muiltGuigePromotionEnd');
            var startValue = value;
            var endValue = end.val();
        } else {
            var start = $(element).closest('.matchGuigeItem').find('.muiltGuigePromotionStart');
            ;
            var end = $(element);
            var startValue = start.val();
            var endValue = value;
        }


        if (!isNull(start) && !isNull(end)) {
            var result = moment(startValue).isBefore(endValue);

            if (result) {


                return true;
            } else {

                return false;
            }
        } else {

            return true;
        }
    });

    //判断提现账单
    $.validator.addMethod("isSelected", function (value, element) {

        var checkboxs = $(element).closest(".orderInfo").find(".bills");
        var res = false;
        checkboxs.each(function (i, ele) {
            if (this.checked) {
                res = true;
            }
        });

        return res;


    });

    //判断数据对于0
    function NumberGtZero(num) {
        var values = parseInt(num);
        return values > 0 && /[0-9]+\.?[0-9]{0,2}/.test(values);
    }

    //身份证号码的验证规则
    function isIdCardNo(num) {
        //if (isNaN(num)) {alert("输入的不是数字！"); return false;}

        var len = num.length,
            re;

        if (len == 15)
            re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
        else if (len == 18)
            re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
        else {
            //alert("输入的数字位数不对。");
            return false;
        }

        var a = num.match(re);

        if (a != null)
        {

            if (len == 15)
            {

                var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);

                var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];

            } else {

                var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);

                var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];

            }
            if (!B) {
                //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。");
                return false;
            }

        }

        if (!re.test(num)) {
            //alert("身份证最后一位只能是数字和字母。");
            return false;
        }

        return true;
    }
    function toStringify(o) {
        return JSON.stringify(o);
    }
    //银行账户
    _$.validator.addMethod("isBank", function (value, element) {
        var notNull = value.replace(/\s+/g, "");
        return this.optional(element) || (/^[0-9]{12,25}$/.test(notNull) && /^\d+$/.test(notNull));
    }, "请输入正确的银行账号<em></em>");

    jQuery.validator.addMethod("bankSelect", function () {
        return $("[name=branchCode]").val() != "" || $("[name=branch]").val() != "" || $("[name=bank]").val() != "";
    }, "此项为必填项！");


    //新增模板名称重复
    _$.validator.addMethod("tempName", function (value, element) {
        var flag = 0;
        _$.ajax({
            type: "Get",
            //type : "POST",
            //url : ROOT_PATH + "api.xbniao.com/template/shippingaddress/create",
            url: ROOT_PATH + "js/custom/data/template/addCreate.json",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.statusCode == '2080101') {
                    flag = 0;
                } else if (data.statusCode == '2000000') {
                    flag = 1;
                }
            }

        });
        if (flag) {
            return true;
        } else {
            return false;
        }
    }, '您的模板名称重复，请尝试其他名称<em></em>');

    // 校验主商品的标题是否已存在
    _$.validator.addMethod("isTitleExist", function (value, element, params) {
        var oldValue = $(element).attr('oldValue');
        var isTitleExist = false;

        if (value != oldValue) {
            _$.ajax({
                url: config.product.uri.product_isTitleExist,
                type: "post",
                async: false,
                data: JSON.stringify({
                    id: params.id,
                    title: value
                }),
                success: function (data) {
                    if (data.statusCode == "2000000") {

                        isTitleExist = data.data;

                    }
                    ;
                }
            });
        }
        ;

        return  !isTitleExist;
    }, "主商品标题已存在！");

    // 校验ebay商品的标题是否已存在
    _$.validator.addMethod("isEbayTitleExist", function (value, element, params) {

        var oldValue = $(element).attr('oldValue');
        var isTitleExist = false;

        if (value != oldValue) {
            /* _$.ajax({
             url : config.product.uri.product_isEbayTitleExist,
             type : "post",
             async : false,
             data : JSON.stringify({
             id: params.id,
             title: value,
             site: params.site
             }),
             success : function (data) {
             if(data.statusCode == "2000000"){
             isTitleExist = data.data;
             };
             }
             });*/



            _$.ajax({
                url: config.product.uri.product_isEbayTitleExist,
                type: "post",
                async: false,
                data: JSON.stringify({
                    xbnCommodityId: params.xbnCommodityId,
                    id: params.id,
                    title: value,
                    site: params.site
                }),
                success: function (data) {
                    if (data.statusCode == "2000000") {
                        isTitleExist = data.data;
                    }
                    ;
                }
            });

        }
        ;
        return  !isTitleExist;
    }, "该商品标题已存在！");

    // 校验Amazon商品的标题是否已存在
    _$.validator.addMethod("isAmazonTitleExist", function (value, element, params) {

        var oldValue = $(element).attr('oldValue');
        var isTitleExist = false;

        if (value != oldValue) {
            _$.ajax({
                url: config.product.uri.product_isAmazonTitleExist,
                type: "post",
                async: false,
                data: JSON.stringify({
                    id: params.id,
                    title: value,
                    site: params.site
                }),
                success: function (data) {
                    if (data.statusCode == "2000000") {
                        isTitleExist = data.data;
                    }
                    ;
                }
            });
        }
        ;

        return  !isTitleExist;
    }, "该商品标题已存在！");

    // 校验Newegg商品的标题是否已存在
    _$.validator.addMethod("isNeweggTitleExist", function (value, element, params) {

        var oldValue = $(element).attr('oldValue');
        var isTitleExist = false;

        if (value != oldValue) {
            _$.ajax({
                url: config.product.uri.product_isNeweggTitleExist,
                type: "post",
                async: false,
                data: JSON.stringify({
                    id: params.id,
                    title: value,
                    site: params.site
                }),
                success: function (data) {
                    if (data.statusCode == "2000000") {
                        isTitleExist = data.data;
                    }
                    ;
                }
            });
        }

        return  !isTitleExist;
    }, "该商品标题已存在！");


    // 校验刊登商品的标题是否已存在,传参规则商品id,siteid,平台名称(须小写)
    _$.validator.addMethod("isTitleCanUse", function (value, element, params) {
        var paramsArr = params.split(','),
            postUrl = config.product.uri.product_isTitleExit_publish.replace(/{\w+}/,paramsArr[1]);
        /**
         ** 新增和编辑传的参数不一样
         ** 新增时需要传站点id和平台名称
         ** 编辑时多传一个参数为刊登商品id
         **/
        var d={title: value,site: paramsArr[0]};
        if(paramsArr.length==3){
            $.extend(d,{id:paramsArr[2]})
        }
        var isCanUse = true;
        if (value != element.defaultValue) {
            _$.ajax({
                url: postUrl,
                type: "post",
                async: false,
                data: JSON.stringify(d),
                success: function (data) {
                    //false是能用 true是不能用
                    if (data.statusCode == "2000000") {
                        isCanUse = !data.data;
                    }
                }
            });
        }
        return isCanUse;

    }, "该商品标题已存在<em></em>！");

    // 根据分类信息判断是否需要EAN
    _$.validator.addMethod("categoryContains", function (value, element, params) {
        var paramsArr = params.split(',');
        if (paramsArr.length!==2) return true;

        var targetCategoryTexts = paramsArr[1].split('|');

        var contains = false;
        for(var i=0; i<targetCategoryTexts.length; i++) {
            if (paramsArr[0].indexOf(targetCategoryTexts[i])>-1) {
                contains = true;
                break;
            }
        }
        if (contains) {
            return value!=="";
        }  else {
            return true;
        }
    }, "EAN码填写错误<em></em>！");


    // 校验违禁词
    _$.validator.addMethod("product_keyword", function (value, element, params) {
        var userName = params.userName;
        var product_keyword = params.keywords;

        if (product_keyword.length) {
            var reg = new RegExp('(' + product_keyword.join('|') + ')', 'g');

            //得到的违禁词
            var valit = value.match(reg);
            //有违禁词
            if (valit) {


                $(element).data('product_keyword', valit.join(','))
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

    }, "");


    // 校验规格SKU是否已被使用
    _$.validator.addMethod("isDataBaseSKUUsed", function (value, element, params) {

        var skuCode = store.get('user').skuCode;
        var value = skuCode + '-' + value;

        var isDataBaseSKUUsed = false;
        var oldValue = $(element).attr('oldValue');
        if (value != oldValue) {
            //数据库内SKU是否已被使用
            isDataBaseSKUUsed = isDataBaseSKUUsed1(params.id/*商品Id*/, value);
            //isDataBaseSKUUsed为false时sku没有占用
        }

        return  !isDataBaseSKUUsed;

    }, "该SKU已被使用！");




    //产品编码  是否页面重复
    _$.validator.addMethod("FactoryCodeIsUsedOnPage", function (value, element, params) {
        var used = true;
        $('.muiltGuiGeMatch-showAll .muiltGuigeProductCode ,.factoryCode-input').each(function () {
            var productCodeInput = $(this);
            if (productCodeInput.val() == value && !$(element).is(productCodeInput) && value != '') {
                used = false;
            }
        })

        return used;
    }, "该产品编码已存在！");


    // 校验产品编码 数据库重复
    _$.validator.addMethod("FactoryCodeIsUsedInDataBase", function (value, element, params) {
        var isUsed = false;
        if(element.isProductCodeChecked){
            return true;
        }
        $.ajax({
            url: config.product.uri.product_isFactoryCodeUsed,
            type: "post",
            async: false,
            data: JSON.stringify({
                "commodityCode": delPrefixSku(value, 'add')
            }),
            success: function (data) {
                if (data.statusCode == "2000000") {
                    isUsed = data.data.validateFlag;
                };
            }
        });
        element.isProductCodeChecked=isUsed;
        return isUsed;

    }, "该产品编码已存在！");





    // 判断数值类型，包括整数和浮点数
    _$.validator.addMethod("isPlusNumber", function (value, element) {
        if (value.indexOf(".") != -1) {
            var str = value.substring(0, value.indexOf(".") + 3);
        } else {
            var str = value;
        }
        $(element).val(str);
        return this.optional(element) || /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(str);
    }, "请正确输入<em></em>");


    // 校验规格SKU是否已被使用
    _$.validator.addMethod("not0", function (value, element, params) {
        if ($.trim(value) != '') {
            return  !(Number($.trim(value)) == 0)
        } else {
            return  true;
        }


    }, "可售数量为正整数！");

    //邮箱验证
    _$.validator.addMethod("emailNew", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(value);
    }, "您的邮箱格式填写有误，请重新输入<em></em>");

    //此邮箱验证允许点开头
    _$.validator.addMethod("email", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
    }, "您的邮箱格式填写有误，请重新输入<em></em>");

    //此邮箱验证不允许点开头
    _$.validator.addMethod("emailTrue", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value) && /[_a-z\d\-\./]+@[_a-z\d\-]+(\.[_a-z\d\-]+)*(\.(info|biz|com|edu|gov|net|am|bz|cn|cx|hk|jp|tw|vc|vn))$/.test(value);
    }, "您的邮箱格式填写有误，请重新输入<em></em>");

    //注册资金不允许为0
    _$.validator.addMethod("firstNozero", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /^(?=.*[^0.])(0|[1-9]\d*)(\.\d+)?/.test(value);
    }, "注册资金不允许为0，请重新输入<em></em>");

    // 匹配汉字、字母、数字
    _$.validator.addMethod("isChineseAndWords", function (value, element) {

        return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
    }, "只能输入汉字、字母、数字 ");


    //添加库存不能超过刊登量
    _$.validator.addMethod("lessThanEbayLimit", function (value, element, params) {


        var ebayLimit = params.ebayLimit;


        //主库存
        if (!params.isVariationStock) {

            var oldValue = Number($(element).attr('oldValue'));
            var currentValue = Number(value);

            if(ebayLimit==0 && oldValue>=currentValue){
                return true;
            }else{
                if( params.status == "在线" || params.status == "在线(编辑驳回)" ){
                    if( oldValue + ebayLimit < currentValue ){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    if( ebayLimit < currentValue ){
                        return false;
                    }else{
                        return true;
                    }
                }
            }
        }
        //多规格库存
        else {

            //多规格历史库存总和
            var totalOldValue = 0;
            //多规格当前库存总和
            var totalCurrentValue = 0;

            var stockInputs = $(element).closest('.muiltGuiGeMatch-showAll').find('.matchGuigeItem').not('.flag-deleted').find('.vali-lessThanEbayLimit');
            stockInputs.each(function (i, input) {
                var oldValue = Number($(input).attr('oldValue'));
                var currentValue = Number($(input).val());

                totalOldValue += oldValue;
                totalCurrentValue += currentValue;
            });

            if(ebayLimit==0 && totalOldValue>=totalCurrentValue){
                return true;
            }else{

                if (params.status == "在线" || params.status == "在线(编辑驳回)") {
                    if (totalOldValue + ebayLimit < totalCurrentValue) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (ebayLimit < totalCurrentValue) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    }, "库存不能超过刊登限量");

    //规格值是否重名
    _$.validator.addMethod("isSameGuigeValue", function (value, element, params) {

        //主商品
        if ($('#addProductInfoTemlWrap').length) {
            //除了自身
            //var guigeValueInputs = $(element).closest('.stand_top_name').find('.good_input').not($(element));

            var allValues = $.map($(element).closest('.stand_top_name').find('.good_input').not($(element)), function (ele, i) {
                return $(ele).val();
            });

        }
        //站点商品
        else {
            //除了自身
            //var guigeValueInputs = $(element).closest('.item-muiltGuigeValue').find('.good_input').not($(element));
            var inputValues = $.map($(element).closest('.item-muiltGuigeValue').find('.good_input').not($(element)), function (ele, i) {
                return $(ele).val();
            });
            var selectValues = $.map($(element).closest('.item-muiltGuigeValue').find('.site-GuigeValue'), function (ele, i) {
                return $(ele).text();
            });

            var allValues = inputValues.concat(selectValues);
        }
        ;


        var res = true;
        if (!isNull($(element))) {

            $.each(allValues, function (i, ele) {
                if ($.trim(ele) == $.trim(value)) {
                    res = false;
                }
            })

            /*allValues.each(function(i,ele){
             if( $.trim( ele ) == $.trim(value) ){
             res = false;
             }
             });*/
        }
        return res;


    }, "规格值不能重名");

    //规格名是否重名
    _$.validator.addMethod("isSameGuigeName", function (value, element, params) {

        //除了自身
        var guigeNameInputs = $(element).closest('.stand_main_bg').find('.good_input').not($(element));
        var res = true;

        if (!isNull($(element))) {
            guigeNameInputs.each(function (i, ele) {
                if ($.trim($(ele).val()) == $.trim(value)) {
                    res = false;
                }
            });
        }
        return res;

    }, "规格名不能重名");


    //库存总和不能为0
    _$.validator.addMethod("stock0", function (value, element, params) {

        //多规格
        if ($('.matchGuigeItem:visible').length) {
            var aInputs = $(element).closest('.muiltGuiGeMatch-showAll').find('.matchGuigeItem').not('.flag-deleted').find('.vali-stock0');
        } else {
            var aInputs = $('.site-stock');
        }

        //验证都填了
        var isAllFilled = true;
        aInputs.each(function (i, ele) {
            if ($.trim($(ele).val()) == '') {
                isAllFilled = false;
            }
        });

        //都填了
        if (isAllFilled) {
            var res = 0;
            aInputs.each(function (i, ele) {
                res += Number($.trim($(ele).val()));
            });

            //库存总和为0，提示
            if (res == 0) {
                return false;
            } else {
                $('.validateErrorTip:contains(库存总和不能为0)').remove();
                return true;
            }
        }
        //没都填，不验证
        else {
            return true;
        }

    }, "库存总和不能为0");

    // 判断value是否大于0,大于最低提现金额
    _$.validator.addMethod("isGtCash", function (value, element, params) {
        var values = Number(value);
        var cash = params;
        return this.optional(element) || values > 0 && value > cash;
    });
    //只能包含字母、数字、英文横杠(用逗号分隔,空格,换行)
    _$.validator.addMethod("skus", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /^[0-9a-zA-Z-\s,]+$/.test(value);
    });

    //校验Wish商品颜色是否可用
    _$.validator.addMethod("colorAvailableWish", function (value, element, params) {
        var isCanUse = true, matchs, matche;
        value = value.replace(/^\s+|\+s$/,'').replace(/\s*\&\s*/,'&');
        //if(!value){return false;}
        if(value && value.match(/(\&)/g) && value.match(/(\&)/g).length > 2){ //验证只能有一个&
            return false;
        }

        if(value && !/^[a-zA-Z](.*)[a-zA-Z]$/.test(value)){ //开头结尾只能为字母
            return false;
        }

        //如果有&号，验证两边色值是不是一样
        if(value && value.indexOf("&") > 0){
            matchs = value.match(/(([a-zA-Z\s])+)\&/);
            matche = value.match(/\&(([a-zA-Z\s])+)/);
            if(matchs && matche && matchs.length > 1 && matche.length > 1 && matchs[1].toLowerCase() == matche[1].toLowerCase()){
                return false;
            }
        }
        if (value != element.defaultValue) {
            _$.ajax({
                url: config.product.uri.procuct_colorAvailable,
                type: "post",
                async: false,
                data: JSON.stringify({color:value}),
                success: function (data) {
                    if (data.statusCode == "2000000") {
                        isCanUse = data.data;
                    }
                }
            });
        }
        return isCanUse;
    }, "该商品颜色不可用<em></em>");
    //运送时间的区间验证间隔大于2
    _$.validator.addMethod("numberGroup2", function (value, element) {
        var min_shipping_time = parseInt($($(element).data('numbergroup2')).find('input[name*=min-ship-time]').val());
        var max_shipping_time = parseInt($($(element).data('numbergroup2')).find('input[name*=max-ship-time]').val());

        if (min_shipping_time && max_shipping_time && min_shipping_time%1==0 && max_shipping_time%1==0) {
            if (max_shipping_time - min_shipping_time >= 2) {
                return true;
            }
        }
        return false;
    }, "时间间隔不少于两天<em></em>");

    //sku海外仓是否有可售数量验证，没有没有可售数量提示该sku不可用/使用情况，多规格自有仓选完切换到海外仓
    _$.validator.addMethod("isownsSkuAvailable", function(value,element,params){
        return !!($(element).attr("data-isownsskuavaliabel") == "true");
    }, "该sku不可用！<em></em> ");


    //只能包含字母、数字、英文横杠(用逗号分隔,空格,换行)
    _$.validator.addMethod("skus", function (value, element) {
        $(element).val(value);
        return this.optional(element) || /^[0-9a-zA-Z-\s,]+$/.test(value);
    });


    ////海外仓验证可刊登数量
    //_$.validator.addMethod("lessthanstock", function(value, element, params){
    //    var val = $(element).val(),
    //        stock = $(element).attr("data-stock"), flag;
    //    /*if(parseInt(stock) < parseInt(val)){
    //        return false;
    //    }else{
    //        return true;
    //    }*/
    //    if(!parseInt(val) && parseInt(val) != 0){return;}
    //    return (parseInt(val) <= parseInt(stock));
    //
    //}, $.validator.format("数量超出可用库存上限"));

    //wish按照新的验证添加规则做违禁词验证
    _$.validator.addMethod("blackwords", function (value, element, params) {
        var product_keyword = $(element).data("blackwords");

        if (product_keyword.length) {
            var reg = new RegExp('(' + product_keyword.join('|') + ')', 'g');
            //得到的违禁词
            var valit = value.match(reg);
            //有违禁词
            if (valit) {
                $(element).data('black_words', valit.join(','))
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }

    }, "");

    //多规格库存至少有一款产品销售数量不为零
    _$.validator.addMethod("leastoneisnotzero",function(value, element, params){
        var allstockinput = $(element).closest("#multiTbody").find("input[name$='[variationStock]']");
        var istrue = false;
        $.each(allstockinput, function(i,ele){
            if(parseInt($(ele).val()) > 0){
                istrue = true;
            }
        });

        if(istrue){
            $.each(allstockinput, function(i,ele){
                $(ele).siblings(".validateErrorTipWrap").find("label").hide();
                //console.log("xxx");
            });
        }

        return istrue;
    },"可售数量至少有1个不能为0<em></em>");
})(jQuery);

//数据库内SKU是否已被使用
function isDataBaseSKUUsed1(id/*商品Id*/, sku) {

    var isSKUUsed = "";
    $.ajax({
        url: config.product.uri.product_isSKUUsed,
        type: "post",
        async: false,
        data: JSON.stringify({
            "id": id,
            "sku": sku
        }),
        success: function (data) {
            if (data.statusCode == "2000000") {
                isSKUUsed = data.data;
            }
            ;
        }
    });
    return  isSKUUsed;
}

