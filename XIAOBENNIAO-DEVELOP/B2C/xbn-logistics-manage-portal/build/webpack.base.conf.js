var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 给出正确的绝对路径
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    // 配置webpack编译入口
    entry: {
        app: './src/boot.js'
    },

    // 配置webpack输出路径和命名规则
    output: {
        // webpack输出的目标文件夹路径（例如：/dist）
        path: config.build.assetsRoot,
        // webpack输出bundle文件命名格式
        filename: '[name].js',
        // webpack编译输出的发布路径
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },

    // 配置模块resolve的规则
    resolve: {
        // 自动resolve的扩展名
        extensions: ['.js', '.vue', '.json'],
        // resolve模块的时候要搜索的文件夹
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        // 创建路径别名，有了别名之后引用模块更方便，例如
        // import Vue from 'vue/dist/vue.common.js'可以写成 import Vue from 'vue'
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': resolve('src'),
            'assets': resolve('src/assets'),
            'components': resolve('src/components')
        }
    },

    // 配置不同类型模块的处理规则
    module: {
        rules: [
            /*{// 对src和test文件夹下的.js和.vue文件使用eslint-loader
             test: /\.(js|vue)$/,
             loader: 'eslint-loader',
             enforce: "pre",
             include: [resolve('src'), resolve('test')],
             options: {
             formatter: require('eslint-friendly-formatter')
             }
             },*/
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['stage-0', 'env'],
                        plugins: [require('babel-plugin-transform-runtime')]
                    }
                },
                include: [resolve('src'), resolve('test'),
                    /node_modules[\\\/]nt-.+/, /node_modules[\\\/]xbn-.+/],
            },
            {// 对图片资源文件使用url-loader，query.name指明了输出的命名规则
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {// 对字体资源文件使用url-loader，query.name指明了输出的命名规则
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}
