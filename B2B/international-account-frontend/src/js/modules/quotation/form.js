X.define("modules.quotation.form", function () {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.quotation.tpl.form
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    var events = {
        init: function() {

        },
        
    }

    ctrl.load = function() {
    	view.render(function() {
    	   events.init()	
    	})
    }

    return ctrl
})