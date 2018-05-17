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

    //密码重置，设置新密码
    model.resetPassword = function(data,callback) {
        var option = {
            url:  api.resetPassword,
            data: data,
            type: 'POST',
            callback: callback
        }

        X.loadData(option)
    }

    //密码重置链接，发送邮箱
    model.resetRequest = function(data,callback) {
        var option = {
            url:  api.resetRequest,
            data: data,
            type: 'POST',
            callback: callback
        }

        X.loadData(option)
    }

    //密码重置链接，验证连接是否有效
    model.resetCheck = function(resetCode,callback) {
        var option = {
            url:  api.resetCheck + resetCode,
            type: 'GET',
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