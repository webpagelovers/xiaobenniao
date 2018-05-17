;require(['modules/common/cookies']);
define(function () {
    var itemHtml;
    $(".js-contact").on("click", function () {
        $(".js-contact-panel").toggleClass("active")
        itemHtml = $(".icon-ContactLine").parent().parent().find(".colGreen");
        if (itemHtml) {
            itemHtml.removeClass("colGreen");
        }
        $(".icon-ContactLine").removeClass("icon-ContactLine").addClass("icon-contactGreen colGreen").siblings("p").addClass("colGreen");
        return false;
    });

    $(document).on("click", (function (e) {
        e = e || window.event;
        if (e.target != $('.js-contact')[0] && e.target != $('.js-contact-panel')[0]) {
            $('.js-contact-panel').removeClass("active");
            if (itemHtml) {
                itemHtml.addClass("colGreen");
            }

            $(".icon-contactGreen").removeClass("icon-contactGreen colGreen").addClass("icon-ContactLine").siblings("p").removeClass("colGreen")
        }
    }));

    $('html,body').on("touchmove", (function () {
        $('.js-contact-panel').removeClass("active");
        if (itemHtml) {
            itemHtml.addClass("colGreen");
        }
        $(".icon-contactGreen").removeClass("icon-contactGreen colGreen").addClass("icon-ContactLine").siblings("p").removeClass("colGreen")
    }))




    /*var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    if(isiOS){
        $(".js-skype-item").attr("href","skype:+8613240020366?chat");
    }else if(isAndroid){
        $(".js-skype-item").bind("click", function () {
            testApp("skype:+8613240020366?chat");
        })
    }

    function testApp(url) {
        var timeout, t = 100, hasApp = true;
        setTimeout(function () {
            if (hasApp) {//alert('安装了app');
            } else {
                //$.alert("Sorry, this application can not be found, please try the other options.", function () {});
            }
            document.body.removeChild(ifr);
        }, 400)
        var t1 = Date.now();
        var ifr = document.createElement("iframe");
        ifr.setAttribute('src', url);
        ifr.setAttribute('style', 'display:none');
        document.body.appendChild(ifr);
        timeout = setTimeout(function () {
            var t2 = Date.now();
            if (!t1 || t2 - t1 < t + 50) {
                hasApp = false;
            }
        }, t);
    }*/

    return {}
});


if ($.init) {
    $.init();
}
