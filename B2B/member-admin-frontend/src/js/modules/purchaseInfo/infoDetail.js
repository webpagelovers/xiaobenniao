X.define('modules.purchaseInfo.infoDetail', ['model.purchaseInfoModel', 'data.currencyData'], function(model, currencyData) {
	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.purchaseInfo.tpl.infoDetail
    })

    var ctrl = X.controller.newOne({
        view: view
    })

    var events = {
    	init: function() {
            $('.goBack', view.el).on('click', function() {
                history.go(-1)
            })

            $('.purchaseInfoDetail > .none', view.el).each(function(i, item) {
                var me = $(item)
                me.children('span').last().html() && me.removeClass('none')
            })

            this.renderAttach()
            
            var attachBox = $('#attachBox', view.el)
            attachBox.html() && attachBox.parent().prev().removeClass('none')
            
    	},
        renderAttach: function() {
            //purchaseInfoAttachmentList
            var uploadUrl = X.config.PATH_FILE.path.rootUploadUrl,
                attchHtml = ''

            attch && attch.forEach(function(item) {
                var a = [
                    '<div class="wrapUpload">',
                    '   <a href="'+uploadUrl+'?fileType=6&filePath='+item.filePath+'&fileName='+item.fileName+'" class="accessory">'+item.filePath+'</a>',
                    //'   <span class="redFont cancel curp">X</span>',
                    '</div>'
                ].join('')

                attchHtml += a
            })
            $('#attachBox', view.el).html(attchHtml)
        }
    }

    var attch
    ctrl.load = function(para) {
    	model.query(para.id, function(result) {
            var data = result.data[0]

            data.dueDate    && ( data.dueDate = data.dueDate.split(' ')[0] )
            data.createDate && ( data.createDate = data.createDate.split(' ')[0] )
            //data.currency   =  currencyData.getCurrency(data.currency)
            data.infoType   =  model.infoTypeArr[data.infoType]
        	
            view.render(data, function() {
                attch = data.purchaseInfoAttachmentList
                events.init()
            })
        })
    }

    return ctrl
})
