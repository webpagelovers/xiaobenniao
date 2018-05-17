define(function () {

    var url,
        title,
        shareNum = 0 //share num. uese for differentiate share

    /**
     * [share description]
     * @param  {[type]} elem  [description]
     * @param  {[type]} url   [description]
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    function share(elem, _url, _title) {
        shareNum++

        /*url   = encodeURIComponent(_url   ||  location.href)
        title = encodeURIComponent(_title ||  document.title)*/

        url   = _url   ||  location.href
        title = _title ||  document.title
        
        var shares =  generateSharesObj()
            count  =  generateCountObj(),
            aaaaa  =  generateFunctions()

        var html   = '',
            index  = 0

        for (var i in shares) {
            var link = shares[i]
            //html += '<a href="'+ link +'"><img src="images/share'+ (++index) +'.png" style="margin-left: 1.3rem"><i class="shareCount"></i></a>'
            var a = elem.children('a').eq(index++)
            a.attr('href', link)
            a.append('<i class="shareCount"></i>')
            count[i] && count[i](link)
        }

        //elem && elem.html(html)
        return html
    }

    /**
     * [generateSharesObj description] generate count object
     * @param  {[type]} url   [description]
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    function generateSharesObj() {
        var shares = {
            facebook:   'http://www.facebook.com/sharer.php?u='+url+'&t='+title,
            googlePlus: 'https://plus.google.com/share?url='+url,
            linkedin:   'http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&source='+url,
            twitter:    'http://twitter.com/share?url='+url+'&text='+title
        }
        
        return shares
    }

    /**
     * [generateCountObj description] generate count object
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    function generateCountObj() {
        var count =  {
            googlePlus: function(link) {
                var data = {
                    method:'pos.plusones.get',
                    id: url,
                    params:{
                        'nolog':true,
                        'id': url,
                        'source':'widget',
                        'userId':'@viewer',
                        'groupId':'@self'
                    },
                    jsonrpc:'2.0',
                    key:'p',
                    apiVersion:'v1'
                }
                $.ajax({
                    type: 'POST',
                    url: 'https://clients6.google.com/rpc',
                    processData: true,
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(res){
                        addCountIcon(link, res.result.metadata.globalCounts.count)
                    }
                })
            }
        }

        //have common behave
        var commons = [
            'https://graph.facebook.com/?id='+url,
            'https://www.linkedin.com/countserv/count/share?url='+url
        ].forEach(function(item) {
            var name = item.split('.')[1],
                cb   = name + 'JsonCallback' + shareNum,
                url  = item + '&callback=' + cb

            count[name] = function(link) {

                $.ajax({
                    type:  'GET',
                    url:    url,
                    dataType: 'jsonp',
                    jsonp: 'aaa'
                })

                window[cb].link = link
            }
        })

        return count
    }

    /**
     * [generateFunctions description] generate functions: callback, share click
     * @return {[type]} [description]
     */
    function generateFunctions() {
        //由于跨域, 用来接收 facebook 的 callback
        window['facebookJsonCallback' + shareNum] = (function(_shareNum) {
            return function(res){
                //有时候facebook会返回OAuthException, 应该是facebook 600/600秒的限制导致的,这里的解决方式是笨方法，就是重新去拿
                if (res.error) {
                    //generateCountObj()['facebook'](window['facebookJsonCallback' + _shareNum].link)
                } else {
                    addCountIcon(window['facebookJsonCallback' + _shareNum].link, res.share.share_count)
                }
            }
        }(shareNum))

        //由于跨域, 用来接收 linkedin 的 callback
        window['linkedinJsonCallback' + shareNum] = (function(_shareNum) {
            return function(res){
                addCountIcon(window['linkedinJsonCallback' + _shareNum].link, res.count)
            }
        }(shareNum))

        if (!window.sharesGoShare) {
            window.sharesGoShare = function(obj) {
                var url = obj.getAttribute('href')
                open(url,'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1000, height=650,top=100,left=150')
            }
        }
    }

    /**
     * [addCountIcon description] add count
     * @param {[type]} href  [description]
     * @param {[type]} count [description]
     */
    function addCountIcon(href, count) {
        if (!count) return
        count > 99 && (count = '99+')
        $('.shareCount').each(function(i, item) {
            var me = $(item)
            if (me.parent().attr('href') === href ) {
                me.html(count).show()
                count === '99+' && me.addClass('f10')
                return false
            }
        })
    }

    return share

});
