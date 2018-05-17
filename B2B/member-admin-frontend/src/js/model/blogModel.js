X.define("model.blogModel",function () {

	var api = X.config.blog.api,
		model =	X.model.create("model.blogModel");


	//删除某个文章
	model.del = function(data, callback) {
		var option = {
			url: api.articleEdit + data.postId,
			type: 'DELETE',
			callback: callback
		};

		X.loadData(option)
	};

	//获取id文章数据
	model.getIdArticle = function(data, callback) {
		var option = {
			url: api.articleEdit + data.postId,
			type: 'GET',
			callback: callback
		};

		X.loadData(option)
	};

	//保存/发布文章数据
	model.postIdArticle = function(data, callback) {
		var option = {
			url: api.articleEdit,
			type: 'POST',
			data: data,
			callback: callback
		};

		X.loadData(option)
	};

	//更新文章数据
	model.putIdArticle = function(data, callback) {
		var option = {
			url: api.articleEdit,
			type: 'PUT',
			data: data,
			callback: callback
		};

		X.loadData(option)
	};

	model.renderStaticPage = function(id) {
		$.ajax({
			url: X.config.PATH_FILE.path.weInTdUrl + 'blog/create/' + id + '.html',
			dataType: 'jsonp',
			type: 'GET'
		})
	}

	model.statusconst = {
		postStatus: {
			SAVE:          {key: "0", text: "未发布"},
			PUBLISH:        {key: "1", text: "已发布"}
		}
	};

	return model;
});