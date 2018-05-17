(function ($,X) {

    var defaultOptions = {
        files:          [],
        currentFile:    null,
        remove:         true,
        canDownload:    false,
        downloadType:   1
    }

    function AttachRender(elem, options) {
        this.elem = elem
        this.options  = options || {}

        this.init()
    }

    AttachRender.prototype.init = function() {
        this.props()
        this.files.length && this.renderAll()
    }

    AttachRender.prototype.props = function() {
        this.currentFile        =   []
        this.renderType         =   ['renderImg', 'renderFile']
        this.server             =   X.prototype.config.PATH_FILE.path.rootImg

        this.dataWrap           =   this.elem.children(".js-dataWrap") //the rendered html place

        for (var i in defaultOptions) {
            this[i] = this.options[i] != null? this.options[i]: defaultOptions[i]
        }
        delete this.options
    }

    AttachRender.prototype.renderAll = function() {
        var me   = this
        this.files.forEach(function(item) {
            me.currentFile = item
            me.doRender()
        })
    };

    AttachRender.prototype.doRender = function() {
        var html = this[this.typeCheck()].call(this)
        this.dataWrap.append(html)
        this.fileChanged()
    };

    AttachRender.prototype.addFile = function(file) {
        this.files.push(file)
        this.currentFile = file
        this.doRender()
    };

    AttachRender.prototype.eventBind = function(file) {
        
    };

    AttachRender.prototype.fileChanged = function() {
        
    };

    AttachRender.prototype.typeCheck = function() {
        var index = 0
        if (this.currentFile.url) {
            
        } else {
            index = 1
        }

        return this.renderType[index]
    }

    AttachRender.prototype.renderImg = function(item) {
        var item = this.currentFile,
            html = [
                '<div class="wrapUpload disib pt20">',
                '   <img src="'+ item.url +'" class="upload-imgage"/>',
                this.remove? '   <span class="redFont cancel">X</span>': '',
                '   <p class="mt10 tac contract-word-cut">'+ (item.fileName || item.filename) +'</p>',
                '</div>'
            ].join('')

        return html
    }

    AttachRender.prototype.renderFile = function(item) {
        var item = this.currentFile,
            html = [
                '<div class="wrapUpload">',
                '   <a href="'+ this.server +'?fileType='+ this.downloadType+'&filePath='+item.filePath+'&fileName='+item.filename+'" class="accessory white-block">'+item.filename+'</a>',
                this.remove? '   <span class="redFont cancel">X</span>': '',
                '</div>'
            ].join('')

        return html
    }

    window.AttachRender = AttachRender


})(jQuery,this.Xbn);