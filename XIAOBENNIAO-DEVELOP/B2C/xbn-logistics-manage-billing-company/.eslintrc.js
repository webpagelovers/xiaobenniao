module.exports = {
    "parser": "babel-eslint",
    "plugins": [
        "html"
    ],
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [ //换行
            "error",
            "windows"
        ],
        "quotes": [  //字符串使用单引号
            "error",
            "single"
        ],
        "semi": [       //语句结尾分号
            "error",
            "always"
        ],
        "no-unused-vars": [  //未使用的声明处理
            "error",
            {
                "vars": "local",  //本地声明必须被使用
                "args": "none",    //允许方法参数声明，但未使用
                "ignoreRestSiblings": false //允许 ... rest参数形式
            }]

    }
};