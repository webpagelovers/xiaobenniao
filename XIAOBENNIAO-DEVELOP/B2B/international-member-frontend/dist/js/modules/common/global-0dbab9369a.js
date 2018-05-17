/**
 * Created by Administrator on 2016/9/20.
 */
X.define("modules.common.global",["modules.common.config","modules.common.header","modules.common.nav","modules.common.footer", "modules.common.cookies"],function (config,header,nav,footer,cookies) {
	var imageLoader = {
		load : function (option) {

			option =  X.isArray(option) ? option : [];
			option.forEach(function (value, index, array) {
				$.ajax({
					url : value["src"],
					beforeSned:function (xhr) {
						xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
					}
				}).done(function (argument) {

					var isBg = value["isBg"];

					if(isBg){
						$(value["selector"]).animate({opacity: 0.9}, 'fast', function() {
							$(this)
					            .css({'background-image': 'url('+value["src"]+')'})
					            .animate({opacity: 1});
					    });
					}
					else{
						$(value["selector"]).attr("src",value["src"]);
					}					
				});			
			});
		}
	};

    //为了方便，剩的在所以页面都写analytics.js, 就将谷歌统计写在revision中
    ;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-100335941-1', 'auto');
    if(location.pathname == '/request/sourcing-request.html'){
        ga('set','userId',cookies.getCookies('userId') || 'null');
    }
    ga('send', 'pageview');


	// $(document).ready(function(){
	// 	var links = $(document.body).find("a");
	// 	links.each(function(index,element){
	// 		var request = X.getRequest();
	// 		if(request["lang"]){
	// 			var href = $(this).attr("href");
	// 			if(href){
	// 				href = (href.indexOf("?")===-1) ?  (href + "?lang=" + request["lang"]) : (href+"&lang="+request["lang"]);
	// 				$(this).attr("href",href) ;	
	// 			}				
	// 		}
	// 	});
	// });


	return imageLoader;  
    
});