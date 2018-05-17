/**
 * Created by Administrator on 2016/9/20.
 */
X.define("modules.common.global",["modules.common.config","modules.common.header","modules.common.nav","modules.common.footer"],function () {
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