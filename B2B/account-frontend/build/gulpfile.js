var config = {
    src :  '../src/',
    dest : '../dist/',  
    manifest: '../dist/rev/manifest.json'
}

var develop = 0

var gulp            =   require('gulp'),
    minifycss       =   require('gulp-minify-css'),
    concat          =   require('gulp-concat'),
    uglify          =   require('gulp-uglify'),
    gulpif          =   require('gulp-if'),
    rev             =   require('gulp-rev'),
    revCollector    =   require('gulp-rev-collector'),
    clean           =   require('gulp-clean'),
    changed         =   require("gulp-changed"),
    htmlReplace     =   require("gulp-html-replace"),
    minimist        =   require('minimist');

//将controls文件夹下的所有js合并controls.js
gulp.task('concat-js', function() {
    return gulp.src([config.src + 'js/controls/Base.js', config.src + 'js/controls/*.js'])
        .pipe(concat('controls.js'))
        .pipe(gulp.dest(config.src + 'js/controls/js'))
})

//将js文件夹下的js压缩
gulp.task('js', ['concat-js'], function() {
    return gulp.src(config.src + 'js/**/*.js')
            .pipe(uglify({mangle: false, compress: {properties: false}, output: {quote_keys: true}}))
            .pipe(rev())
            .pipe(gulpif(!develop, changed(config.dest + 'js')))
            .pipe(gulp.dest(config.dest + 'js'))
            .pipe(rev.manifest({path: config.manifest, merge: true}))
            .pipe(gulp.dest(config.dest))
})

//将css文件夹下的css压缩且合并
gulp.task('css', function() {
    return gulp.src(config.src + 'css/**/*.css')
            .pipe(concat('style.css'))
            .pipe(minifycss())
            .pipe(rev())
            .pipe(gulpif(!develop, changed(config.dest + 'css')))
            .pipe(gulp.dest(config.dest + 'css'))
            .pipe(rev.manifest({path: config.manifest, merge: true}))
            .pipe(gulp.dest(config.dest))
})

//删除暂时生成的controls/js文件
gulp.task('clean', ['js', 'css'], function() {
    gulp.src(config.src + 'js/controls/js')
        .pipe(clean({force: true}))
    gulp.src(config.dest + 'js/controls/*.js')
        .pipe(clean({force: true}))
})

//这些只需要copy
var justCopy = 'js.lib js.data fonts images installPackage'.split(' ')

justCopy.forEach(function(item) {
    gulp.task(item, function() {

        item = item.replace('.', '/')
        return gulp.src(config.src + item + '/**/*.*')
            .pipe(gulpif(!develop, changed(config.dest + item + '/')))
            .pipe(gulp.dest(config.dest + item + '/'))
    })
})

gulp.task('js.data', function() {
    return gulp.src(config.src + 'js/data/*.json')
                .pipe(gulpif(!develop, changed(config.dest + 'js/data/')))
                .pipe(gulp.dest(config.dest + 'js/data/'))
})

gulp.task('js.lib', function() {
    return gulp.src(config.src + 'js/lib/**/*.*')
                .pipe(gulpif(!develop, changed(config.dest + 'js/lib/')))
                .pipe(gulp.dest(config.dest + 'js/lib/'))
})

gulp.task('justCopy', justCopy)

gulp.task('default', ['clean', 'justCopy'], function() {
    //这些html需要copy 还需要替换css js
    ['html', 'tpl'].forEach(function(item) {
        gulp.src([config.manifest, config.src + '**/*.' + item])
            .pipe(
                htmlReplace({
                    'css': 'css/style.css',
                    'js-controls': 'js/controls/js/controls.js'
                })
            )
            .pipe(revCollector())
            .pipe(gulpif(!develop, changed(config.dest)))
            .pipe(gulp.dest(config.dest))
    })
})
