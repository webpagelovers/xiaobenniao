require.config({
    baseUrl: 'js'
});

require(['modules/common/contact'], function (contact){

    $(".icon-BlogLine").removeClass("icon-BlogLine").addClass("icon-BlogGreen colGreen").siblings("p").addClass("colGreen")
    var _heigt = $(".page-index")[0].clientWidth * 0.3 * 0.754
    //$(".js-list-img").css({"height":, _width*0.754},{"width": _width});
    $('.list-right-box').css('height', _heigt)
});

