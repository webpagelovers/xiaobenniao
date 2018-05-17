import Notification from 'nt-element/src/components/notification/index.js';
import Enum from './enum.js';

function checkAjaxData(json, isOpenErrMsg = true) {
    return new Promise(function (resolve, reject) {
        if (json.statusCode == '2000000') {
            resolve(json.data);
        } else {
            if (isOpenErrMsg) {
                let msg = json.errMsg || '未知错误';
                if (!json.errMsg && json.errorList.length > 0) {
                    msg = json.errorList.join(';');
                }
                Notification.error({
                    title: '错误',
                    message: msg
                });
            }
            reject(json);
        }
    });
}
//获取装箱列表
async function listPage(params, ctx) {
    let json = await ctx.post('/gcfsEbayPackPlan/listPage', params, true);
    return json;
}

//获取装箱详情
async function getEncasementInfo(params, ctx) {
    let json = await ctx.get('/gcfsEbayPackPlan/info', params, true);
    return checkAjaxData(json);
    //let data = {
    //    cfOrderCodes:null,
    //    cfPackPlanId:"2",
    //    containerNo:"2",
    //    containerType:"2",
    //    containerTypeId:2,
    //    createTime:"2018-04-24 15:44:27",
    //    customOrderCodes: "2",
    //    destintionPort:"2",
    //    packPlanCfOrders:[
    //        {
    //            cfOrderCode:"第一条订单",
    //            cfOrderId :"2",
    //            cfPackPlanId:"2",
    //            headUpState:2,
    //            id:"2",
    //            orderId:"2" ,
    //            packPlanCfOrderBoxes:[
    //                {
    //                    boxNo:'箱1',
    //                    packageType: 'aa',
    //                    boxVolume:'1体积',
    //                    boxWeight:'1重量',
    //                    boxLength:'1长',
    //                    boxWight:'1宽',
    //                    boxHeight:'1高',
    //                    packPlanCfOrderBoxProducts:[
    //                        {
    //                            merchantSku:'sku11',
    //                            boxWeight:'11111111',
    //                            applyPrice:'aprice1',
    //                            state:1
    //                        },
    //                        {
    //                            merchantSku:'sku12',
    //                            boxWeight:'2222222'
    //                        },
    //                        {
    //                            merchantSku:'sku13',
    //                            boxWeight:'33333333333'
    //                        }
    //                    ]
    //                },
    //                {
    //                    boxNo:'箱2',
    //                    packageType: 'xxxxxxx',
    //                    packPlanCfOrderBoxProducts:[
    //                        {
    //                            merchantSku:'sku21',
    //                            boxWeight:'11111111'
    //                        }
    //                    ]
    //                }
    //            ]
    //        },
    //        {
    //            cfOrderCode:"第二条订单",
    //            cfOrderId :"2",
    //            cfPackPlanId:"2",
    //            headUpState:2,
    //            id:"2",
    //            orderId:"2"
    //        }
    //    ]
    //}
    //
    //return data
}


//edit页面数据回填
async function createCustomOrder(params, ctx) {
    let json = await ctx.get('/gcfsEbayPackPlan/toCreateCustomOrder', params, true);
    return checkAjaxData(json);
}

//edit页添加的商品列表
async function listPageProducts(params, ctx) {
    let json = await ctx.post('/gcfsEbayPackPlan/listPageProducts', params, true);
    return checkAjaxData(json);
}

// edit页面保存数据
async function saveOrder(params, ctx) {
    let json = await ctx.post('/gcfsEbayPackPlan/save', params, true);
    return checkAjaxData(json);
}

//这种写法， 以后进行支持。 相当于给模型方法声明一个命名空间
export const encasement = {
    listPage,
    getEncasementInfo,
    createCustomOrder,
    listPageProducts,
    saveOrder
};