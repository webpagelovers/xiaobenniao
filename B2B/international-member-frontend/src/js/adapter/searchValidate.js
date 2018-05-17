X.define("adapter.searchValidate",["common.layer"],function (popLayer) {


    var view = X.view.newOne({
        //res : X.config.index.res.index
    });

    var searchValidate = X.controller.newOne({
        view: view
    });

    searchValidate.keyValidate = function(item,position){
        var flag = location.href.indexOf('search-list.html') > -1? 0: 1;
        var key = item.replace(/(^\s*)|(\s*$)/g,"");

        if (key.length>0){
            if (flag){
                key = escape(key);
                open(X.config.common.link.searchList+'?key=' + key);
            }else{
                position.click();
            }
        }else{
           var layerpopLayer  = popLayer.prompt($.i18n.prop("searchValidate_warning"),
                            $.i18n.prop("searchValidate_warningContent"),
                            [$.i18n.prop("common_yes")],
                            popLayer.close(layerpopLayer))

        }

    };

    return searchValidate;


});