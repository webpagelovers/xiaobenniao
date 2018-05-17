require.config({
    baseUrl: 'js'
});

require(['xbn.config', 'modules/common/contact'], function (config,contact){

    $(".icon-HomeLine").removeClass("icon-HomeLine").addClass("icon-HomeGreen colGreen").siblings("p").addClass("colGreen")

    //google-analytics-click
    $(".js-try-now").on("click",function(){
        ga("send", {
            "hitType": "event",
            "eventCategory": "Button",
            "eventAction": "Click Try Now Button",
            "eventLabel": "Try Now Button"
        })
    })
    $(".js-learn-more").on("click",function(){
        ga("send", {
            "hitType": "event",
            "eventCategory": "Button",
            "eventAction": "Click Learn More Button",
            "eventLabel": "Learn More Button"
        })
    })

    var ipinfo = function () {
        var url = config.index.api.ipinfo;

        var myAjax = {
            url: url,
            async: true,
            crossDomain: true,
            type: "GET",
            cache: false,
            xhrFields: {withCredentials: true},
            data: '',
            dataType: 'json',
            contentType: "application/json",
            success: function (resp) {
                    var countryCode = (resp && resp.data.country) ? resp.data.country : "";
                    countryCode = countryCode.toLowerCase();
                    if (countryCode == 'undefined') {
                        localStorage.setItem('countryCode', 'cn');
                    } else {
                        localStorage.setItem('countryCode', countryCode);
                    }
            }
        }
        $.ajax(myAjax);
    };

    $(document).ready(function(){
        var countryCode = localStorage.getItem('countryCode');
        if (!countryCode) {
            setTimeout(function () {
                // $.get('https://ipinfo.io', function (resp) {
                //     var countryCode = (resp && resp.country) ? resp.country : "";
                //     countryCode = countryCode.toLowerCase();
                //     localStorage.setItem('countryCode', countryCode);
                // }, "jsonp");
                ipinfo();
            }, 200);
        }
    });
    require(['modules/common/loadingTime'])
});
