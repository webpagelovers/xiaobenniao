(function ($,X) { 

    function ViewModel() {
        this.props()
        this.genModelMethod()
        this.initControl()
        this.fillData()
        this.eventsBind()
    }

    var config = {
        sources: [
            'id', 
            'ctrl', 
            'model'
        ],
        doms:    [
            'view',
            'ele',
            'form'
        ],
        hooks:   [
            'collectData', 
            'afterSubmitSuccess',
            'afterSubmitError'
        ]
    }

    /**
     @method props 获取被释放的资源 id && ctrl && model
    */
    ViewModel.prototype.props = function() {
        this._addSources()
        this._addDoms()
        this._addHooks()
    }

    /**
     @method _addHooks 添加sources到当前vm, 并销毁被释放的资源
    */
    ViewModel.prototype._addSources = function() {
        var me  = this
        config.sources.forEach(function(i) {
            me[i] = window[i]
            window[i] = null
        })
    }

    /**
     @method _addHooks 添加钩子方法
    */
    ViewModel.prototype._addDoms = function() {
        this.view  = this.ctrl && this.ctrl.view
        this.ele   = this.view && this.view.el
        this.form  = this.ele  && this.ele.find('form')
    }

    /**
     @method _addHooks 添加钩子方法
    */
    ViewModel.prototype._addHooks = function() {
        var me = this
        this.ctrl && config.hooks.forEach(function(i) {
            me[i] = me.ctrl[i]
        })
    }

    /**
     @method genModelMethod 将model中的方法提取到vm中
    */
    ViewModel.prototype.genModelMethod = function() {
        var model,
            me   = this,
            refs = [
                ['query', 'queryById'],//the first index is model method
                ['submit', 'save']
            ]

        if (model = this.model) {
            refs.forEach(function(item) {
                for (var i = 0; i < item.length; i++) {
                    var ii = item[i]
                    if (model[ii]) {
                        me[item[0]] = model[ii]
                        break
                    }
                }
            })
        }
    }

    /**
     @method initControl 初始化controls
    */
    ViewModel.prototype.initControl = function() {
        var ctrl
        if (ctrl = this.ctrl) {
            this.vm = ctrl.vm = ctrl.getViewModel(ctrl.view.el, { meta: this.generateMeta()})
            ctrl.vm.initControl()
            this._validate()
        }
    }

    /**
     @method generateMeta 根据model来生成meta
    */
    ViewModel.prototype.generateMeta = function() {
        var model
        if (model = this.model) {

            var meta  = {},
                check = Object.prototype.toString,
                not   = ['option', 'validate']

            for (var i in model) {
                var type = check.call(model[i])
                if (model.hasOwnProperty(i) && not.indexOf(i) === -1) {

                    (type === '[object Object]' || type === '[object Array]') && (meta[i] = {dataSource: model[i]})
                    /*switch (type) {
                        case '[object Object]':
                            meta[i] = {dataSource: model[i]}
                            break
                        case '[object Array]':
                            meta[i] = {dataSource: model[i]}
                            break
                    }*/
                }
            }
        }

        return meta
    }

    /**
     @method fillData 回显数据
    */
    ViewModel.prototype.fillData = function() {
        var me = this
        if (this.id && this.query) {
            this.query(this.id, function(res) {
                var data = res.data[0],
                    cons = me.vm.getControls()

                for (var i in cons) {
                    cons[i].setValue(data[i])
                }
            })
        }
    }

    /**
     @method submit 提交表单数据
    */
    ViewModel.prototype._submit = function(tar) {
        var form
        if ((form = this.form) && form.valid()) {
            var data = this._collectData(this.vm.collectData(), tar)

            this.submit && this.submit(data, function(res) {
                if (res.statusCode === window.X.CONSTANTS.statusCode.SUCCESS) {
                    layer.msg('<span style="margin-left:20px;">提交成功</span>', {
                        icon: 1,
                        time: 2000
                    },function(){
                        history.go(-1)
                    })
                } else {
                    layer.alert('提交失败, 请联系服务人员')
                }
            })
        }
    }

    /**
     @method submit 用户自定义组装数据
    */
    ViewModel.prototype._collectData = function(data, tar) {
        var collect
        (collect = this.collectData) && (data = collect(data, tar))

        return data
    }

    /**
     @method eventsBind 绑定事件
    */
    ViewModel.prototype.eventsBind = function() {
        //default events
        var me = this
        $('.js-submit', this.ele).on('click', function() {
            me._submit(this)
        })
    }

    /**
     @method validate validate验证
    */
    ViewModel.prototype._validate = function() {
        this.form && this.model.validate && this.form.validate(this.model.validate)
    }
    
    ViewModel.prototype.dataConvert = function() {
        for (var i in data) {
            var dd = model[i]
            if (dd && dd instanceof Array && dd.length) {
                if (Object.prototype.toString.call(dd[0]) === '[object Object]') {
                    aa:for (var j = dd.length;j--;) {
                        if (dd[j]['key'] == data[i]) {
                            data[i] = dd[j]['value']
                            break aa
                        }
                    }
                } else {
                    data[i] = dd[i]
                }
                
            }
        }

        return data
    }

    window.XbnViewModel = ViewModel


})(jQuery,this.Xbn);