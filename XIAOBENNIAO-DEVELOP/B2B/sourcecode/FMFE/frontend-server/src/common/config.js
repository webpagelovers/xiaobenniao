var config = (function(){
	function config(){		
		var config;
		return{
			getVhost : function(){
				var result = [];
				var config = this.getConfig();
				for(var key in config){
					result.push(config[key]);
				}
				return result;
			},
			getConfig : function(){
				if(!config){
					config = require("../config.json");
				}
				return config;
			}
		};
	}

	var instance ;
	return {
		getInstance : function(){
			if(!instance){
				instance = config();
			}
			return instance;
		}
	};
})();


module.exports = config;