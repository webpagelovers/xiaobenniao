import cons from './cons'

const util = {
	/**
	 * [hrefBlob 将返回的数据变成 <a href="blob"> 并点击下载，然后移除<a>标签]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} content [description]
	 * @return {[type]}         [description]
	 */
	hrefBlob(name, content) {
		let a = document.createElement('a'),
			b = new Blob([content], {type: 'text/excel'})

		a.download = name
		a.href = URL.createObjectURL(b)
		document.body.appendChild(a)
		a.click()
		a.remove()
	},
	

	/**
	 * [getVueChildComponent 根据名称查取 !!!一级!!! 子VueComponent]
	 * @param  {[type]} vue  [当前vue]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	getVueChildComponent(vue, name) {
		let com = null, 
			chi = null 
		if (vue && (chi = vue.$children)) {
			let len = chi.length
			while (len--) {
				if (new RegExp(name).test(chi[len].$vnode.tag)) {
					com = chi[len]
					break
				}
			}
		}

		return com
	}
}

export default util