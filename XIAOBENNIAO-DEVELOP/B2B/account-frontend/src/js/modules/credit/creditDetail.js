X.define('modules.credit.creditDetail', ['model.creditModel', 'data.currencyEntireData', 'data.countryData'], function(model, currencyData, countryData) {
	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.credit.tpl.creditDetail
    })

    var ctrl = X.controller.newOne({
        view: view
    })

    var events = {
        changeValue: function(data) {
            $('[data-control-type]', view.el).each(function(i, item) {
                var ele = $(item)
                switch (ele.attr('data-control-type')) {
                    case 'ComboBox':
                        var name   = ele.attr('name'),
                            source = eval(name + 'Data'),
                            index  = parseInt(data[name])
                        ele.html(source.source[index].value)
                        break
                    case 'WebUpload':
                        //var file = data[ele.attr('name')]
                        //ele.html('<span>'+ file.filename +'</span>')
                        var file    = data[ele.attr('name')],
                            newFile = {
                                filename: file.filename,
                                href:     X.config.PATH_FILE.path.rootUploadUrl + '?fileType=1&filePath='+ file.filePath +'&fileName='+ file.filename
                            }
                        ele.loadTemplate($('#creditDetailFiles', view.el), [newFile])
                        break
                }
            })
            
            this.addProducts(data.productInfoList)
            
        },
        addProducts: function(data) {
            var html = ''
            for (var i in data) {
                var pro = data[i]
                html += [
                    '<div class="'+ (i % 2? 'even-row': '') +'">',
                        '<span>'+ (parseInt(i) + 1)+'</span>',
                        '<span>'+ pro.nameCn +'</span>',
                        //'<span class="deleteProduct curp">删除</span>',
                    '</div>'
                ].join('')
            }
            $('#productsHtmlList').html(html)
        }
    }

    ctrl.load = function(para) {
    	model.getCredit(para.id, function(result) {
            var data = result.data[0]
    		view.render(data, function() {
                if (!model.creditStatus) $('.original-input', view.el).addClass('none')
                events.changeValue(data)
    		})
    	})
    }

    return ctrl
})