require.config({
    baseUrl: 'js'
});

require(['modules/common/contact'], function (contact){

    $(".icon-ServiceLine").removeClass("icon-ServiceLine").addClass("icon-ServiceGreen colGreen").siblings("p").addClass("colGreen")


});
