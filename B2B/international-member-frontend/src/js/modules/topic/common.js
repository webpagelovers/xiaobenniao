X.define('modules.topic.common', [], function () {
    var jumpToRfq = function () {
        $('html, body').animate({
            scrollTop: $("#rfq").offset().top - 20
        },100);
        return false;
    };

    var myAnchorPonit = function () {
        var url = location.href;
        var index = url.indexOf('#');
        url = url.slice(index + 1);
        if (url == 'rfq') {
            setTimeout(jumpToRfq, 10);
        } else if (url == 'product') {
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: $("#porduct").offset().top
                },100);
            }, 10);
        } else if (url == 'service') {
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: $("#service").offset().top
                },100);
            }, 10);
        }
    };

	var common = {
        anchorPoint: function() {
            myAnchorPonit();
            $('#enquiry').click(function(){
                jumpToRfq();
            });
            document.onkeydown = function(e) {
                //捕捉回车事件
                var ev = (typeof event!= 'undefined') ? window.event : e;
                if(ev.keyCode == 13) {
                    myAnchorPonit();
                }
            }
            //为了减少改动，放在这里了
            //loadRealImg(/*$('.js-firstPage').children('div').children('img')*/)
        },
	};

    //用户优化 slider展示慢的问题
    if (X.config.env.production) {
        $('.js-flexslider2').flexslider({
            animation: "slide",
            slideshow: false,
            animationLoop: false,
            itemWidth: 340,
            itemMargin: 5,
            manualControls: true,
            minItems: 3
        });
    }
    
	return common;
})