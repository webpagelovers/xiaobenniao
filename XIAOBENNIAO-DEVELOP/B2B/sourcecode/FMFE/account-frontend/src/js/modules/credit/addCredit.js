X.define('modules.credit.addCredit', ['model.creditModel', 'model.userModel', 'modules.common.InitHelper', 'data.currencyEntireData', 'data.countryData', 'adapter.webuploader', 'adapter.laydate'], function(model, userModel, InitHelper, currencyEntireData, countryData) {
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.credit.tpl.addCredit
    })

    var ctrl = X.controller.newOne({
        view: view
    })

    var validate = {
        ignore: ".ignore",
        rules: {
            contactsName:           { required: true, rangelength: [2, 4], isChinese:true },           //联系人姓名
            contactsMobile:         { required: true, isMobile: true },                  //联系人手机号
            contactsEmail:          { required: true, email: true, rangelength: [5, 50]},                     //联系人邮箱
            accountee:              { required: true, rangelength: [2, 20], isGroupByCnWordsSpace: true, isNoDigits: true },           //开证申请人
            country:                { required: true},                                  //开证国家
            currency:               { required: true},                                  //信用证币种
            amount:                 { required: true,  isNumberFloat2: true, isIntGtZero: true},         //信用证金额
            latestShippingDate:     { required: true},                                  //最迟装运日期
            effectiveDate:          { required: true},                                  //交单日期
            validityCreditDate:     { required: true},                                  //信用证有效期
            letterCreditNumber:     { required: true, bigCharOrNum: true, rangelength: [1, 50] },         //信用证号码
            letterCreditAttachment: { required: true, },                                  //信用证附件
            remark:                 { required: false, rangelength: [1, 100] },          //备注
            productsList:           { required: true, rangelength: [1, 20] }
        },
        messages: {
            contactsName:           { required: '请输入联系人姓名', rangelength: '请输入2-4位姓名', isChinese: '姓名只能为中文' },           //联系人姓名
            contactsMobile:         { required: '请输入联系人手机号', isMobile: '请输入正确的手机号码' },           //联系人手机号
            contactsEmail:          { required: '请输入联系人邮箱', email: '请输入正确格式的邮箱', rangelength: '邮箱长度5-50位'},                     //联系人邮箱
            accountee:              { required: '请输入开证申请人', rangelength: '2-20个汉字或英文', isGroupByCnWordsSpace: '申请人只能汉字或英文', isNoDigits: '申请人只能汉字或英文' },  //开证申请人
            country:                { required: '请添加开证国家'},                                  //开证国家
            currency:               { required: '请添加信用证币种'},                                  //信用证币种
            amount:                 { required: '请输入信用证金额', isNumberFloat2: '最多两位小数的正数', isIntGtZero: '信用证金额不能为0' },         //信用证金额
            latestShippingDate:     { required: '请输入最迟装运日期'},                                  //最迟装运日期
            effectiveDate:          { required: '请输入交单日期'},                                  //交单日期
            validityCreditDate:     { required: '请输入信用证有效期'},                                  //信用证有效期
            letterCreditNumber:     { required: '请输入信用证号码', bigCharOrNum: '大写英文或数字', rangelength: '最多50字符' },         //信用证号码
            letterCreditAttachment: { required: '请添加信用证附件'},                                  //信用证附件
            remark:                 { rangelength: '字数在100字以内' },          //备注
            productsList:           { required: '请添加出货产品清单', rangelength: '出货产品清单在20条内'}
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

    var events = {
        init: function() {
            attrs.productList               = $('#productList', view.el)
            attrs.productsHtmlList          = $('#productsHtmlList', view.el)
            attrs.productsHtmlListTemplate  = $('#productsHtmlListTemplate', view.el)
            attrs.originalInput             = $('.original-input', view.el)
            attrs.letterCreditStatus        = $('[name=letterCreditStatus]', view.el)
            attrs.productsListInput         = $('[name=productsList]', view.el)
            attrs.creditUserInfo            = $('.credit-user-info', view.el)

            this.eventsBind()
            this.addFilePicker()
            this.switchType()
            this.fillData()
            this.addUserInfo()

        },
        addUserInfo: function() {
            userModel.userInfo &&
            attrs.creditUserInfo.find('[user-info-ref]').each(function(i, item) {
                item.value = item.innerHTML = userModel.userInfo[item.getAttribute('user-info-ref')]
            })
        },
        eventsBind: function() {
            var me = this

            $('.addProduct', view.el).on('click', function() {
                attrs.productList.toggleClass('none')
            })

            /*$('#addProduct', view.el).on('click', function() {
             attrs.produts = []
             attrs.productList.find('[type=checkBox]:checked').each(function(i, item) {
             attrs.produts.push({nameCn: item.value})
             })
             me.renderProduct()
             })*/

            attrs.productList.on('click', 'input[type=checkBox]', function() {
                var key = this.value
                this.checked
                    ? attrs.produts.push({nameCn: key})
                    : attrs.produts.forEach(function(item, index) {
                    item.nameCn === key && attrs.produts.splice(index, 1)
                })
                me.renderProduct()
            })

            $('.credit-submit', view.el).on('click', function() {
                attrs.letterCreditStatus.val(this.getAttribute('status'))
                me.submit()
            })

            $('#addNewProduct').on('click', function() {
                var newProduct = 'newProductName'

                open(X.config.PATH_FILE.path.root + '/' + '?m=customerClearance.addDeclareProduct&fromCredit=' + newProduct)
                var code = setInterval(function() {
                    var nameCn = document.cookie.match(new RegExp(newProduct +'=.*'))
                    if ( nameCn && (nameCn = nameCn[0].split(';')[0].split('=')[1]) && nameCn !== '0') {
                        attrs.produts.push({nameCn: nameCn})
                        document.cookie = newProduct + '=0'
                        page.listIntances.productListObj.loadData()
                        me.renderProduct()
                        clearInterval(code)
                    }
                }, 2000)
            })

            attrs.productsHtmlList.on('click', '.deleteProduct', function() {
                var self = $(this),
                    id = self.prev().html()

                attrs.produts.forEach(function(item, index) {
                    item.nameCn === id && attrs.produts.splice(index, 1)
                })

                $('input[value="'+ id +'"]', attrs.productList).attr('checked', false)
                /*me.parent().remove()*/
                me.renderProduct()

            })
        },
        //将添加的数据生成表格
        renderProduct: function() {
            var html = '',
                val  = ''
            for (var i in attrs.produts) {
                var pro = attrs.produts[i]
                html += [
                    '<div class="'+ (i % 2? 'even-row': '') +'">',
                    '<span>'+ (parseInt(i) + 1)+'</span>',
                    '<span>'+ pro.nameCn +'</span>',
                    '<span class="deleteProduct curp">删除</span>',
                    '</div>'
                ].join('')
                val += 'a'
            }
            attrs.productsHtmlList.html(html).parent().removeClass('none')
            attrs.productsListInput.val(val).valid()

        },
        addAddedProduct: function() {
            var code = setInterval(function() {
                if (attrs.produts.length) {
                    attrs.produts.forEach(function(item, index) {
                        attrs.productList.find('input[value='+ item.nameCn +']').attr('checked', true)
                    })
                    clearInterval(code)
                }
            }, 50)
        },
        //切换类型
        switchType: function() {
            attrs.isDraf = !model.creditStatus
            attrs.isDraf? attrs.originalInput.addClass('none').children('input').addClass('ignore'):attrs.originalInput.removeClass('none').children('input').removeClass('ignore')

        },
        submit: function() {
            if (page.forms.form.valid()) {
                var data = ctrl.viewModel.collectData()
                data.letterCreditAttachment = attrs.upload.files()[0]
                //attrs.produts.forEach(function(item) { delete item.proId })
                data.productInfoList = attrs.produts
                if (attrs.para && attrs.para.id) data.letterCreditId = attrs.para.id

                if (attrs.isDraf)
                    attrs.originalInput.children('input').each(function(i, item) {
                        delete data[item.getAttribute('name')]
                    })

                model.createCredit(data, function(result) {
                    if (result.statusCode === X.CONSTANTS.statusCode.SUCCESS) {
                        var title = '<i class="iconfont icon-bgcDuiguo" style="color: #00b904;margin-right: 10px"></i>'
                        var index2 = layer.alert(title + '信用证上传成功', function() {
                            layer.close(index2)
                            setTimeout( function() { X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.creditList"})  }, 600)
                        })
                        $('.layui-layer-close').hide()
                    } else {
                        var index2 = layer.alert(result.message, function() {
                            layer.close(index2)
                            if (result.statusCode == '2000800') {
                                setTimeout( function() { X.publish(X.CONSTANTS.channel.menuCall,{m:"credit.creditList"})  }, 600)
                            }
                        })
                    }
                })
            }
        },
        addFilePicker: function() {
            var uploadTarget = $('#js-webUpload', view.el)
            attrs.upload =  X.controls.getControl("WebUpload", uploadTarget, {
                size: 1,
                type: 3,
                downloadType: 1,
                filePicker: $(".filePicker", uploadTarget),
                filePickerLabel: '<span class="upload-plus-icon">+</span>上传',
                fileChanged: function() {
                    var input = uploadTarget.children('input'),
                        len   = $('.js-wrapData > div', uploadTarget).length,
                        val   = ''

                    if (len && input.next('label.error').length) input.next('label.error').remove()

                    while (len--) {
                        val += 'a'
                    }

                    input.val(val).valid()
                }
            })

            attrs.upload.files = function() {
                var arr = []
                attrs.upload.getValue().forEach(function(item){
                    arr.push({
                        filePath: item.filePath,
                        filename: item.fileName
                    })
                })
                return arr
            }
        },
        fillData: function() {
            //清空之前产品的数据
            attrs.produts = []
            var para = attrs.para
            para && para.id &&
            model.getCredit(para.id, function(result) {
                var data = result.data[0]
                for (var i in data) {
                    var ele = $('[data-property-name='+ i +']', view.el)
                    if (ele.length) {
                        switch (ele.attr('data-control-type')) {
                            case 'TextBox':
                                ele.val(data[i])
                                break
                            case 'DatePicker':
                                ele.val(data[i])
                                break
                            case 'ComboBox':
                                ele.find('ul > [index-data='+ data[i]+']').click()
                                //ele.val(data[i])
                                break
                            /* case '':
                             ele.val(data[i])
                             break*/
                        }
                    }
                }
                //添加出货产品清单
                attrs.produts = data.productInfoList
                events.renderProduct()
                //添加信用证附件
                var newFile = {
                    filePath: data.letterCreditAttachment.filePath,
                    fileName: data.letterCreditAttachment.filename
                }
                attrs.upload.setValue([newFile])

                model.addOrMerge = 'PUT'
            })
        }
    }

    var productListObj = {
        searchMeta: {
            schema: {
                simple: [
                    {
                        name: "nameCn",
                        inputName: "nameCn",
                        title: "产品名称",
                        ctrlType: "TextBox",
                        placeholder: "请输入产品名称"
                    }
                ]
            },
            search: {
                onSearch: function (data, searcher, click) {
                    return data;
                }
            },
            reset: {
                show: false
            },
            selector: "contacts"
        },
        gridMeta: {
            columns: [
                {
                    field: {
                        name: "productId",
                        title: ""
                    },
                    itemRenderer: {
                        render: function (data, field, index, grid) {
                            return '<input type="checkBox" name="productCheckbox" value="'+ data.nameCn +'">'
                        }
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "",
                        title: "序号"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "nameCn",
                        title: "产品名称"
                    },
                    width: "12%"
                },
                {
                    field: {
                        name: "nameEn",
                        title: "产品英文名称"
                    },
                    width: "16%"
                },
                {
                    field: {
                        name: "hsCode",
                        title: "HSCode"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "brand",
                        title: "品牌"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "texture",
                        title: "材质"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "model",
                        title: "型号"
                    },
                    width: "10%"
                },
                {
                    field: {
                        name: "usage",
                        title: "用途"
                    },
                    width: "10%"
                }
            ],
            afterRowRender: function (row, data, index) {
                $(row.dom).find("td").eq(1).html(index + 1);
            },
            afterTableRender: events.addAddedProduct
        },
        pageInfo: {
            pageSize: '5',
            pageNo: '1',
            smallPapogation: {
                isShow: false,
                elem: '.js_small_papogation1'
            }
        },
        //type: "GET",
        url: X.config.products.api.productList
    }

    var attrs = {
        upload:     null,
        produts:    [],
        isDraf:     false,
        para:       null
    }

    var page = {
        el: view.el,
        validate: validate,
        list: {
            productListObj: productListObj
        }
    }

    ctrl.load = function(para) {
        attrs.para = para
        model.creditStatus = location.search.indexOf('addCreditDraft') === -1? 1: 0
        view.render(function() {
            events.init()

            var init = new InitHelper(page)
            page = init.data

            var meta = {
                "country": {
                    dataSource: countryData.source
                },
                "currency": {
                    dataSource: currencyEntireData.source
                },
                "latestShippingDate" : {
                    afterDateChange: function(that, date) {
                        $(that.elem).valid();
                    }
                },
                "effectiveDate" : {
                    afterDateChange: function(that, date) {
                        $(that.elem).valid();
                    }
                },
                "validityCreditDate" : {
                    afterDateChange: function(that, date) {
                        $(that.elem).valid();
                    }
                }
            
            }

            ctrl.viewModel = ctrl.getViewModel(view.el.find("form"),{meta: meta})
            ctrl.viewModel.initControl()
        })
    }

    return ctrl

})