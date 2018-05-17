var imgPreload = function(srcs, callback) {
	//if (srcs) {
		//srcs instanceof Array? 1: (srcs = [srcs])

		srcs.forEach(function(src) {
			var img = new Image()
			img.src = src
			img.onload = function() {
				callback && callback()
			}
		})
	//}
}

/**
 * [loadRealImg description] 先用虚的图片，再替换真实图片
 */
window.loadRealImg = function(doms) {
	doms = doms || $('.loadRealImg')
	if (doms.length) {

		doms.each(function(i, dom) {
			var src = dom.src.replace('_.png', '.png')
			imgPreload([src], function() {
				dom.src = src
			})
		})

	}
}

/**
 * [topicImgPreload description] 预先加载 topic 下的图片
 */
window.topicImgPreload = function(prefix, number) {
	var root = '../images/',
        file = 'promotionOffers/',
        arr  = []

    //promotionOffers 下的图片
    arr.push(root + file + prefix + '_.png')
    number++
    while (--number) {
    	arr.push(root + file + prefix + number + '.jpg')
    }

    //images 下的图片
    var info = {
    	'advantage': 4,
    	'agent': 4
    }

    for (var i in info) {
    	var num = info[i]
    	for (var j = 1; j <= num; j++) {
    		arr.push(root + i + j + '.png')
    	}
    }

    imgPreload(arr)
}