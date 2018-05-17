X.define("model.userModel",function () {
    var model =	X.model.create("model.userModel"),
    	api   = X.config.user.api

    model.login = function(data, callback) {
    	var option = {
    		url:  api.login,
    		data: data,
    		type: 'POST',
    		callback: callback
    	}

    	X.loadData(option)
    }

    model.regist = function(data, callback) {
    	var option = {
    		url:  api.regist,
    		data: data,
    		type: 'POST',
    		callback: callback
    	}

    	X.loadData(option)
    }

    model.signOut = function(callback) {
        var option = {
            url:  api.logout,
            type: 'POST',
            callback: callback
        }

        X.loadData(option)
    }

    model.userInfo = function(callback) {
        var option = {
            url:  api.userInfo,
            type: 'GET',
            callback: callback
        }

        X.loadData(option)
    }

    model.createConstants = function() {
        var statusCode = {
            '2000312': "Your login name or password is incorrect"
        }
        
        model.statusCode = statusCode
    }
    model.createConstants = function() {
        var statusCode = {
            '2000312': "Your login name or password is incorrect"
        }

        model.statusCode = statusCode
    }

    return model
})