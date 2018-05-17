import Vue from 'vue'
import { util } from '../@import'

class Request {
	constructor(prefix) {
		this._pre = prefix
		this._ctx = new Vue().ctx
	}

	post(url, param) {
		let config = {
	        url: url,
	        method: 'post',
	        data: param
	    }
	    return this._request(config)
	}

	get(url) {
		let config = {
	        url: url,
	        method: 'get'
	    }
	    return this._request(config)
	}

	del(url, param) {
		let config = {
	        url: url,
	        method: 'delete',
	        data: param
	    }
	    return this._request(config)
	}

	put(url, param) {
		let config = {
	        url: url,
	        method: 'put',
	        data: param
	    }
	    return this._request(config)
	}

	async file(url, param) {
		let fileName = param.fileName? param.fileName: 'file.xls'
		delete param.fileName
		let config = {
	        url: this._pre + url,
	        method: 'post',
	        data: param
	    }
	    let res = (await this._ctx.request(config)).data
	    util.hrefBlob(fileName, res)
	}

	async _request(config) {
		config.url = this._pre + config.url
		let res = (await this._ctx.request(config)).data
		return res.statusCode == 2000000? res.data: 'error'
	}
}

export default Request