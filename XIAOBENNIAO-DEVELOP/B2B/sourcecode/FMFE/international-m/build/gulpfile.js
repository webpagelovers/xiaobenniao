var config = {
	src:  '../src/',
	dist: '../dist/'
}

var gulp 			= 		require('gulp'),
	minifycss 		= 		require('gulp-minify-css'),
	concat 			= 		require('gulp-concat'),
	rev 			= 		require('gulp-rev'),
	revCollector 	= 		require('gulp-rev-collector'),
	changed			= 		require('gulp-changed'),
	htmlReplace 	= 		require('gulp-html-replace'),
	fs 				=  		require('fs')


/**
 * 当前项目js内容比较少，我就打算简化gulp处理:
 * 
 * 1、 做一个copy
 * 2、 公共html替换
 * 3、 CSS压缩合并
 */



gulp.task('copy', () => {
	var exclode = '!' + config.src+'/css/**/*.*';
	return gulp.src([config.src + '**/*.*', exclode])
			.pipe(gulp.dest(config.dist))
})

 //将css文件夹下的css压缩且合并
gulp.task('css', function() {
    return gulp.src(config.src + 'css/**/*.css')
            .pipe(concat('style.css'))
            .pipe(minifycss())            
            .pipe(gulp.dest(config.dist+"css"));
});

gulp.task('htmlReplace', ['copy','css'], () => {
	let folds = 'blog request service'.split(' ')

	let options = {		
		header: 'tpl/common/header.tpl',
		nav:    'tpl/common/nav.tpl',
		footer: 'tpl/common/footer.tpl',
		contact:'tpl/common/contact.tpl',
	}

	for (var i in options) {
		options[i] = fs.readFileSync(config.src + options[i], 'utf-8')
	}

	folds.forEach(fold => {
		let files = fs.readdirSync(config.src + fold)
		files.every(file => {
			if (file.indexOf('.html') > -1) {
				var fileName =  file.replace('.html', ''),
					key      =  fold + '-' + fileName,
					filePath =  config.src + 'tpl/' + fold + '/' + fileName + '.tpl'

				fs.stat(filePath, err => {
                    err.code !== 'ENOENT' && (options[key] = fs.readFileSync(filePath))
				})

			}
		})
	})

	options["css"] = 'css/style.css';

	'html tpl'.split(' ').every(item => {
		return gulp.src(config.src + '**/*.' + item)
				.pipe(htmlReplace(options))
				.pipe(gulp.dest(config.dist))
	})

	//renderBlog()
})

//监听文件是否修改
gulp.task('watch', () => {
    gulp.watch(config.src + '**/*.*', ['default'])
})

// ------------- [ 临时给测试用的 ] -------------
const https = require("http"),
      url = require('url')

//在构建完之后，生成blog详情页
function renderBlog(){
    const href = 'http://dev.weintrade.com:8080/blogs/create/all',
          res  = https.request(url.parse(href), result => {})

    res.on('error', err => {
        console.log('has error', err)
    })

    res.on('data', chunk => {
        console.log('request get data', chunk)
    })

    res.on('end', () => {
        console.log('request end')
    })
    res.end()
}
// ------------- [ 临时给测试用的 ] -------------

gulp.task('default', ['htmlReplace'])