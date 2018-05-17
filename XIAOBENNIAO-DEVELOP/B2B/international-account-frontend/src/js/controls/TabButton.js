(function ($,X) { 

X.prototype.controls.widget("TabButton", function(controlType) {      
    
    function TabButton(elem,options) {
        this.elem = elem;
        this.option = options;

        this.addEvents()
    }

    X.prototype.controls.extend(TabButton,"BaseControl");    
    TabButton.prototype.constructor = TabButton;

    TabButton.getTemplate = function (item) {
        var data = item.dataSource,
            html = '<div>'

        data.forEach(function(dd, i) {
            html += [
                '<span class="tabButton '+ (i? '': 'active mr40')+'">'+ dd +'</span>'
            ].join('')
        })

        html += '</div>'

        return html
    }

    TabButton.prototype.addEvents = function (target) {
        $('body').on('click', '.tabButton', function() {
            var me = $(this)
            !me.hasClass('active') && (me.siblings('.active').removeClass('active'), me.addClass('active'))
        })

        return target
    }

    TabButton.prototype.getValue = function () {

    }

    TabButton.prototype.setValue = function () {

    }

    return TabButton;
});


})(jQuery,this.Xbn);