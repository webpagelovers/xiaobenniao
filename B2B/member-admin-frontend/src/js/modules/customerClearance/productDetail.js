X.define("modules.customerClearance.productDetail", ["model.productManageModel", "common.layer"], function (model, popLayer) {

    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.customerClearance.tpl.productDetail
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    var events = {
        init: function(data) {
            var me = this

            this.renderImg()

            $('.goBack', view.el).on('click', function() {
                history.go(-1)
            })

            var submitBtn = $('.submitBtn', view.el),
                proStatus = $('.proStatus', view.el),
                addCont   = $('.additionalContent', view.el),
                detailImg = $('.proManDetailImg', view.el)

            if (_para.status == 1) {
                submitBtn.removeClass('none')
                proStatus.addClass('none')
                data.additionalContent && addCont.removeClass('none')
            }

            if (_para.status == 2) {
                proStatus.children().eq(0).addClass('active')
            }

            submitBtn.on('click', '> input', me.submit)
            detailImg.on('click', me.showImg)
        },
        submit: function() {
            var me    = $(this),
                index = me.index(),
                data  = {
                  additionalRequirement: '',
                  productId: _para.id,
                  refuseReason: '',
                  status: me.attr('status')
                }

            var title   = '',
                content = '',
                key     = ''

            switch (index) {
                case 0:
                    events._submit(data, index)
                    break
                case 1:
                    title   = '驳回说明'
                    content = [
                                '<form class="submitForm por">',
                                '   <span>原因：</span>',
                                '   <textarea class="sub-teaxa" name="submitContent"></textarea>',
                                '</form>',
                                '<p class="fr f12">请输入10-50个字符</p>'
                               ].join('')
                    key     = 'refuseReason'
                    addAlert()
                    break
                case 2:
                    title   = '完善资料说明'
                    content = [
                                '<form class="submitForm por">',
                                '   <span>补充说明：</span>',
                                '   <textarea class="sub-teaxa" name="submitContent"></textarea>',
                                '</form>',
                                '<p class="fr f12">请输入10-50个字符</p>'
                               ].join('')
                    key     = 'additionalRequirement'
                    addAlert()
                    break
            }

            function addAlert() {
                layer.open({
                    title: title,
                    content: content,
                    btn: ['确认'],
                    yes: function(ii, ele) {
                        var text = ele.find('.sub-teaxa')
                        if (text.valid()) { 
                            data[key] = text.val()
                            layer.close(ii)
                            events._submit(data, index)  
                        }
                    }
                })
            }
            events.doValidate()
        },
        doValidate: function() {
            $(".submitForm").validate({
                rules: {
                    submitContent: {
                        required: true,
                        rangelength: [10, 50]
                    }
                },
                messages: {
                    submitContent: {
                        required: "请填写内容",
                        rangelength: "字数在10-50内"
                    }
                },
                onkeyup: false,
                onfocusout: function (element) {
                    var elem = $(element);
                    elem.valid();
                },
                errorPlacement: function (error, element) {
                    element.hasClass('sub-teaxa') && error.css({top: '126px', left: '64px'})
                    element.after(error);
                }
            })
        },
        _submit: function(data, index) {
            model.submit(data, model.submitType[index], function(res) {
                res.statusCode == X.constant.statusCode.SUCCESS
                    ? popLayer.successMsg('提交成功', function() {
                        history.go(-1)
                    })
                    : popLayer.successMsg(res.messages, function() {
                        history.go(-1)
                    })
            })
        },
        renderImg: function() {
            var me   = this,
                data = []

            model.attachTypes.forEach(function(item, i) {
                var obj = {
                    title: item,
                    attachs: me._renderImg(i)
                }
                data.push(obj)
            })


            $('#attachBox', view.el).loadTemplate($('#attachItemTem', view.el), data)
        },
        _renderImg: function(i) {
          var html = ''

          attachs.forEach(function(item) {
            item.attachmentType == i && addHtml(item)
          })  

          function addHtml(a) {
            html += [
                '<div class="wrapUpload">',
                (
                    a.url
                    ?'<a href="'+X.config.PATH_FILE.path.rootUploadUrl+'?fileType=0&filePath='+a.filePath+'&fileName='+a.fileName+'" class="accessory orange-font">'+a.filename+'</a>'
                    :'<img src="'+a.filePath+'" class="proManDetailImg"><p>'+ a.filename +'</p>'
                ),
                '</div>'
            ].join('')
          }

          return html
        },
        showImg: function() {
            var opt = {
                "shadeClose": !0,
                "content": "<img src='" + this.getAttribute('src') + "' style='max-width:1200px;'/>"
            }
            popLayer.layerOpen(opt)
        }
    }

    var attachs,
        _para

    ctrl.load = function(para) {
        model.query(para.id, function(res){
            var data = res.data[0]

            _para = para
            attachs = data.productAttachmentList
            data.proStatus = model.productStatus[data.status]
            data.pass = ''
            data.proStatusNotice = (model.statusRefPre[data.status] || '') + (data[model.statusRef[data.status]] || '')

            view.render(data, function() {
                events.init(data)
            })
        })
        
    }

    return ctrl
})