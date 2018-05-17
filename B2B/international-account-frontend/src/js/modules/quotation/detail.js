X.define("modules.quotation.detail", ['model.quotationModel'], function () {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.quotation.tpl.detail
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    var events = {
        init: function() {
            this.renderData()
        },
        renderData: function() {
            releaseSource(id, ctrl, model)
        },
        showUser: function() {
            
        }
    }

    var id
    ctrl.load = function(param) {
        id = param.id
    	view.render(function() {
    	   events.init()	
    	})
    }

    return ctrl
})