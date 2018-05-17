 (function () {
    var base = document.getElementsByTagName('base');
    if(base && base[0]){
        var href = window.location.protocol+"//"+window.location.host + "//" + base[0].getAttribute("href");
        base[0].setAttribute("href",href);
    }

    
    onload = function() {
    	//用于解决ie :checked 不支持
        if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
            var code = setInterval(function() {
                if ($('[ie-remCheckbox]').length) {
                    $('[ie-remCheckbox]').addClass('remCheckbox')
                    clearInterval(code)
                }
            }, 1000)
        	$('body').on('click', '[ie-remCheckbox]', function() {
        		var me = $(this)
        		me.prev()[0].checked = !me.prev()[0].checked 
                me.toggleClass('remCheckbox')
        	})
        }
    }

 }()); 