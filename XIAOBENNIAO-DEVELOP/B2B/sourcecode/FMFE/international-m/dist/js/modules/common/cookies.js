define(function () {
	var defaultOptions = {
        expire: null,//基本单位为 小时,默认永不失效
        secure: false,
        overwrite:false
    }

    var cookies =  {
        setCookies:function(options){
            options = options || {}
            var exp = new Date();                
            for(var i in defaultOptions) {
                options[i] === undefined && (options[i] = defaultOptions[i])
            }

            options.overwrite? doSet(): (!this.getCookies(options.name) && doSet())

            function doSet() {
                var expires = ''
                if (options.expire) {
                    var dd = new Date()
                    dd.setHours(dd.getHours() + options.expire)
                    expires = ";expires=" + dd.toGMTString()
                }
                var secure = options.secure? ';secure': ''
                document.cookie = options.name + "=" + encodeURIComponent(options.value) + expires + secure + ';path=/;'
            }
        },
        getCookies:function(name){
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (name == aCrumb[0])
                    return decodeURIComponent(aCrumb[1]);
            }
            return null;
        },
        setBrowserUUID: function() {
            var val = {
                name:  'myBrowserId', 
                value: generateUUID()
            }
            this.setCookies(val)
        },
        setFirstAccessDate: function() {
            var now = new Date(),
                dd  = now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1) + '-' + now.getUTCDate() + ' ' + now.toUTCString().split(' ')[4],
                val = {
                    name:  'firstAccessDate', 
                    value: dd
                }
            this.setCookies(val)
        },
        setResolution: function() {
            var val = {
                name:  'resolution', 
                value: screen.width + '*' + screen.height
            }
            this.setCookies(val)
        },
        setReferrer: function() {
            var ref = document.referrer,
                out = ref && ref.indexOf('weintrade.com') === -1,
                val = {
                    name:  'referUrl', 
                    overwrite: true,
                    value:  out ? ref: 'direct',
                    expire: 24
                }
            ;(out || !this.getCookies(val.name)) && this.setCookies(val)
        },
        commonSetting: function() {
            this.setBrowserUUID()
            this.setFirstAccessDate()
            this.setResolution()
            this.setReferrer()
        }
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };
   
    cookies.commonSetting();
    return cookies;
})