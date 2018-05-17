X.define('modules.user.regist', ['model.userModel', 'modules.user.common'], function (userModel, common) {

    var view = X.view.newOne({
        el: common.jsRegist,
        url: X.config.user.tpl.regist,
        res : X.config.user.res.regist
    })

    var ctrl = X.controller.newOne({
        view: view
    })

    ctrl.name = 'regist'

    var events = {
        init: function() {
            var me = this,
                registSubmit = $('#regist-submit', view.el),
                registTerms  = $('#regist-terms', view.el),
                jsChangeCode = $('.js-changeCode', view.el)

            registSubmit.on('click', me.submit)
            jsChangeCode.on('click', function(){common.showCode(view.el);})
            ctrl.form.validate(common.generateValidate('regist','true'))
            common.showCode(view.el);
            ctrl.bindShowView($('.js-joinFree', view.el))

            $('.termsUse', view.el).attr('href', X.config.common.link.termOfUse)
            common.switchLoginRegist(view.el)
            userModel.createConstants()
        },
        submit: function() {
            if (!$(this).hasClass('disabled') && ctrl.form.valid()) {
              var data = ctrl.viewModel.collectData()
              userModel.regist(data, function(res) {
                  if (res.statusCode == X.CONSTANT.statusCode.SUCCESS){
                      common.registrationSuccessful();
                      ctrl.success()
                      ga('send', {
                          hitType: 'event',
                          eventCategory: 'Sign Up',
                          eventAction: 'Submit Join Now Button',
                          eventLabel: 'Submit Join Now'
                      });
                  }else{
                      common.serverError()
                  }
              })
            }
        }

    }

    ctrl.google_analytics = function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'Sign Up',
            eventAction: 'Click Social Button',
            eventLabel: 'Click Social'
        });
    };

    ctrl.load = function() {
        common.addInterface(ctrl)
        view.render(function() {
            ctrl.form = view.el.find("form")
            var meta =  {}
            ctrl.viewModel  = ctrl.getViewModel(ctrl.form, {meta: meta})
            ctrl.viewModel.initControl()
            events.init()

            ctrl.addEvent("click", ".js-google-analytics", "google_analytics");
        })
    }

    ctrl.load()

    return ctrl
})