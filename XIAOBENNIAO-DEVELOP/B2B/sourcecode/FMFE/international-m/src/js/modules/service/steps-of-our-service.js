require.config({
    baseUrl: 'js'
});

require(['modules/common/contact'], function (contact){


    $(".icon-ServiceLine").removeClass("icon-ServiceLine").addClass("icon-ServiceGreen colGreen").siblings("p").addClass("colGreen")

    $(".js-guar-learn").bind("click",function(){
        ga("send", {
            "hitType": "event",
            "eventCategory": "Button",
            "eventAction": "Service Click Learn More",
            "eventLabel": "Service Learn More"
        })
    })

});
