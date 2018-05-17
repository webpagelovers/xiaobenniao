var languageConfig = {
    default:{
        src :  '../src/',
        dest : '../dist/',
        manifest: '../dist/rev/manifest.json',
        i18n: 'en-US.properties',
        taskName:'task-default'
    },
    CN:{
        src :  '../src/',
        dest: '../dist_CN/',
        manifest: '../dist_CN/rev/manifest.json',
        i18n: 'en-CN.properties',
        taskName:'task-CN'
    },
    ZN:{
        src :  '../src/',
        dest: '../dist_ZN/',
        manifest: '../dist_ZN/rev/manifest.json',
        i18n: 'en-ZN.properties',
        taskName:'task-ZN'
    }
}

module.exports = languageConfig;