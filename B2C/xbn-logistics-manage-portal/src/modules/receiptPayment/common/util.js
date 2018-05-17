import cons from './cons'

const util = {
	//通过 url 来判断 应收/应付
	getRpType() {
		return cons.rpType[location.href.match(/\/payment/)? 1: 0]
	},

	getRpTitle() {
		return this.getRpType()['label']
	},

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
	 * [validate 验证表单]
	 * @param  {[type]} rule [description]
	 * @param  {[type]} form [description]
	 * @return {[type]}      [description]
	 */
	rPValidate(form, rules, row) {
		let inputs = form.getElementsByTagName('input')
		inputs.length == 5 && delete rules.supplyId
		let flag = !0
		let j = 0

		for (let i in rules) {
			let input = inputs[j++],
				rule  = rules[i],
				val   = row[i]

			rule.forEach(r => {
				let res = this._valid(r, val, input.parentElement)
				!res && (flag = !1)
			})
			
		}

		return flag
	},

	_valid(r, val, par) {
		let errMsg = 'nt-form-item__error',
			errDiv = par.nextElementSibling,
			flag   = !0

		!(errDiv && errDiv.className == errMsg) && (errDiv = null)

		if ((r.required && val == undefined) || (val && r.pattern && !r.pattern.test(val))) {
			if (errDiv) {
				errDiv.innerText = r.message
			} else {
				let div = document.createElement('div')
				div.innerText = r.message
				div.className = errMsg
				par.after(div)
			}
			flag = !1
		} else {
			if (errDiv) {
				errDiv.remove()
			}
		}

		return flag
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