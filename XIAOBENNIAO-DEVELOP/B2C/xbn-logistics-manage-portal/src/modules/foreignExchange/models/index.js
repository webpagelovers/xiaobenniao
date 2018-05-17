async function getList(query, ctx) {
	//return await ctx.post('/gcfsCommodityAdmin/listPage', query)
	return {"statusCode":"2000000","errMsg":null,"errorList":null,"data":{"page":{"pageNo":1,"pageSize":10,"totalCount":124,"totalPages":13},"list":[{"id":"268272096268087296","userId":"252694466095087616","userName":"sqf","userPhone":"15210249061","userEmail":"sunqiaofeng@xbniao.com","intoType":1,"status":2,"rejectInfo":null,"corporateName":"舒服舒服撒","corporateAddress":"舒服舒服撒","postCode":null,"legalRepresentative":"舒服舒服撒","businessLicenseCode":"911101150966590","corporateDescrption":null,"contactName":"杨延广","contactPhone":"13800138000","contactTelephone":null,"contactEmail":"yangyanguang@xbniao.com","personalName":null,"personalCode":null,"personalEmail":null,"personalAddress":null,"personalPhone":null,"personalCodeFront":null,"personalCodeBack":null,"isFirst":0,"settlementMode":"1","smSetTime":null,"tpId":null,"tpCode":null,"createTime":"2018-01-10 14:58:06","createUser":"sqf","lastUpdateTime":"2018-01-10 14:58:06","lastUpdateUser":"sqf"}]}}
}

export default {
	getList
}