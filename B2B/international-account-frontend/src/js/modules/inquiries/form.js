X.define("modules.inquiries.form", ["model.inquiryModel"], function (model) {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiries.tpl.form
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    


    var events = {
        init: function() {
            var me = this
            releaseSource(ctrl, model)
        }
    }

    ctrl.load = function() {
    	view.render(function() {
    		events.init()
    	})
    }

    return ctrl
})