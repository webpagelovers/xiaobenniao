var exp 	= 	require('../app-weintrade/app'),
	model   = 	require('../common/model'),
	gulp    =   require('gulp')

//在重新部署国际站时，将blog详情页&列表页 静态化
gulp.task('staticBlog', () => {
	exp.reloadBlogList({url: '/blog/index.html'}, null, json => {
		var list = json.data.list
		list.forEach(item => {
			exp.createBlogDetail({url: '/blog/' + item.postId + '.html'}, null)
		})
	})
})

gulp.task('default', ['staticBlog'])

