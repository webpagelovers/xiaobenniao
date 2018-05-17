var language = require('./languageConfig');

var config = language.default;


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
    minimist        =   require('minimist'),
    fs = require("fs");


var develop = (function(){
    var knownOptions = {
      string: 'env',
      default: { env: process.env.NODE_ENV || 'development' }
    };

    var options = minimist(process.argv.slice(2), knownOptions);

    var isDev = options.env === 'development';

    console.log("develop="+ isDev);

    return isDev;

})();

//将controls文件夹下的所有js合并controls.js
gulp.task('concat-js', function() {
    return gulp.src([config.src + 'js/controls/Base.js', config.src + 'js/controls/*.js'])
        .pipe(concat('controls.js'))
        .pipe(gulp.dest(config.src + 'js/controls/js'))
})

//将js文件夹下的js压缩
gulp.task('js', ['concat-js'], function() {
    return gulp.src(config.src + 'js/**/*.js')
            .pipe(gulpif(!develop,uglify({mangle: false, compress: {properties: false}, output: {quote_keys: true}})))
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
var justCopy = 'js.lib js.data fonts images installPackage tpl'.split(' '),
    copyFile = 'robots.txt sitemap.xml favicon.ico'.split(' ')

justCopy.forEach(function(item) {
    gulp.task(item, function() {

        item = item.replace('.', '/')
        return gulp.src(config.src + item + '/**/*.*')
            .pipe(gulpif(!develop, changed(config.dest + item + '/')))
            .pipe(gulp.dest(config.dest + item + '/'))
    })
})

copyFile.forEach(function(item) {
    gulp.task(item, function() {
        return gulp.src(config.src + item)
                    .pipe(gulpif(!develop, changed(config.dest)))
                    .pipe(gulp.dest(config.dest));
    });
});

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

gulp.task('justCopy', justCopy.concat(copyFile))

gulp.task("i18n", function () {
    return gulp.src([config.src + 'i18n/**/*' + config.i18n])
        .pipe(concat(config.i18n))
        .pipe(gulp.dest(config.dest + 'i18n'))
})

gulp.task('rev', ['clean', 'justCopy'], function() {
    //这些html需要copy 还需要替换css js
    var option = staticize.getExtendReplaceOption();

    return gulp.src([config.manifest, config.src + '**/*.html'])
        .pipe(htmlReplace(option))
        .pipe(revCollector())
        .pipe(gulpif(!develop, changed(config.dest)))
        .pipe(gulp.dest(config.dest));   
 
});

//{{遍历每一个语言的task任务
var languageArr = [];
for (var i in language){
    languageArr.push(language[i]);
}

languageArr.forEach(function (item,index) {
    gulp.task('change-config-' + index, function () {
        return config = item;
    })

    gulp.task(item.taskName, ['change-config-' + index, 'default'], function () {

    })
});
//遍历每一个语言的task任务}}


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

gulp.task('default',['rev','i18n'],function () {
    // body...
    i18n();

    //renderBlog()
})


//完成对头，尾和导航的替换，实现这些内容的静态化，方便SEO。
var staticize = {
    getHeader : function(){
        return this.getFileContent("tpl/common/header.tpl");
    },
    getNav : function(){
        return this.getFileContent("tpl/common/nav.tpl");
    },   
    getFooter : function(){
        return this.getFileContent("tpl/common/footer.tpl");
    },
    getrRfq : function(){
        return this.getFileContent("tpl/common/commonRequest.tpl");
    },
    getFileContent : function(tplPathName){
        let filePath = config.src+tplPathName
        try {
            fs.accessSync(filePath)
            return fs.readFileSync(config.src+tplPathName,"utf8")
        } catch (err) {
            console.log(filePath + ' is not exit ')
            return ''
        }
    },
    getReplaceOption : function(){      
        var header = this.getHeader();
        var nav = this.getNav();
        var footer  = this.getFooter();
        var commonRequest = this.getrRfq();
        return {
            "header" : header,
            "nav" : nav,
            "footer" : footer,
            "commonRequest" :commonRequest,
            "css" : 'css/style.css',
            'js-controls' :  'js/controls/js/controls.js'
        };
    } 
};

gulp.task('default2',function(){
    staticize.getExtendReplaceOption();
});

staticize.getExtendReplaceOption = function(option){
    var that = this;
    option = staticize.getReplaceOption();
    var directory = ["about","product","request","blog","service","topic","user"];
    //var files = {};
    directory.forEach(function(item){
        var files = fs.readdirSync(config.src+item);
        files.forEach( function (file){
            if(file.indexOf(".html")>0){
                var fileName = file.replace(".html","");
                var key = item+"-"+fileName;
                var value = "tpl/"+item+ "/" + fileName+".tpl";
                option[key]= that.getFileContent(value);
                /*console.log(key);
                console.log(value);*/
            }
        });
    });
    option["index-index"] = that.getFileContent("tpl/index/index.tpl");
    return option;
}


/* i18n 资源文件静态化 begin*/

var i18n = function(){
    var i18n = require("./i18n.js");
    var map = require('map-stream');
    var vfs = require('vinyl-fs');

    i18n.loadAndParseFile(config.dest + 'i18n/' + config.i18n);

    var i18nReplace = function (src,dest,handler) {
        var replace= function(file, cb) {
            //console.log(file.path);
            file.contents = new Buffer(handler(file))
            cb(null, file);
        };

        vfs.src(src)
            .pipe(map(replace))
            .pipe(gulp.dest(dest));
    }
    var replaceScript  = function (file) {
        var fileData = file.contents.toString();
        var temp = fileData;
        for(var key in i18n.map) {
            var tkey = new RegExp("\\$\\.i18n\.prop\\((\"|\')"+ key +"(\"|\')\\)", 'g');
            var tValue = "\"" +  i18n.map[key] + "\"";
            //temp = temp.replace(tkey,tValue);
            //tkey = /"$.i18n.prop('"+key+"')"/g;
            temp = temp.replace(tkey,tValue);
        }
        return temp;
    }
    var cheerio = require("cheerio");
    var replaceHtml = function (file) {
        var fileData = file.contents.toString();
        var temp = fileData;
        var $ = cheerio.load(temp, {decodeEntities: false});

        $("[data-i18n]").each(function(index,elem){
            var that = $(this);
            var key = that.attr("data-i18n");
            var text = i18n.map[key] || "!!!Error!!!";
            that.removeAttr("data-i18n");
            var type = elem.name.toLowerCase();
            switch(type){
                case "input":
                    if(that.attr("type")=="button"){
                        that.val(text);
                    }
                    break;
                default:
                    that.html(text);
                    break;
            }
        });

        $("[placeholder]").each(function (index,elem) {
            var that = $(this);
            var key = that.attr("placeholder");
            var text = i18n.map[key] || "!!!Error!!!";
            that.attr("placeholder",text);
        });
        temp= $.html();
        return temp;
    }

    //第一步处理脚本
    i18nReplace([config.dest + 'js/**/*.js', '!'+config.dest+'js/lib/**/*.js'],config.dest+'js/',replaceScript);
    //第二步处理html
    i18nReplace([config.dest + '/**/*.html',config.dest + '/**/*.tpl'],config.dest,replaceHtml);

};
/* i18n 资源文件静态化 end*/