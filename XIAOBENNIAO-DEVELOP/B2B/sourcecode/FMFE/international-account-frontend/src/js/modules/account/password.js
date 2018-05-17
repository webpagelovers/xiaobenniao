X.define("modules.account.password", function () {

    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.account.tpl.password
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function() {
        view.render(function() {

        })
    }

    return ctrl
})