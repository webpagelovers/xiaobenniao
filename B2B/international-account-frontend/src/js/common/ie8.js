;(function(){
	var isIe8 = navigator.userAgent.indexOf('MSIE 8.0') !== -1

	setTimeout(function(){

		//用于解决 ie8 不支持css3 :checked, radio中有用
		!function ie8CssCheckIssue() {
		    if (isIe8) {
		        $('input[type=radio]+label').on('click', function() {
		        	var me = $(this).prev()
		        	me.parent().parent().find('.radioChecked').removeClass('radioChecked')
		        	me.addClass('radioChecked')
		        })
		    }
		}()

	}, 2400)
	
})()

