require.config({
    baseUrl: 'js' 
});

require(['modules/common/contact', 'modules/common/share'], function (contact, share){

    var _url    = location.href.indexOf('test') > -1 ? location.href.replace('//m.test.', '//test.'): location.href.replace('//m.', '//www.'),
        _title  = document.getElementsByTagName('title')[0].innerHTML

    share($('#sharebox'), _url, _title)


    $(".icon-BlogLine").removeClass("icon-BlogLine").addClass("icon-BlogGreen colGreen").siblings("p").addClass("colGreen")

    $(".js-canonical-link").attr("href","https://www.weintrade.com"+location.pathname);

});

