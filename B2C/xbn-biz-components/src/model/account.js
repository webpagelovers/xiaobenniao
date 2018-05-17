import {ErrorMessagedException} from 'nt-portal-framework/src/utils/exceptions';

async function accountRecharge(param, ctx) {

    if (param===1) {  //正常返回
        return {
            statusCode: '2000000',
            data: {
                hello: 'world'
            }
        };
    } else if(param===-1) {  //返回，未声明的异常代码
        return {
            statusCode: '2030000',
            data: {
                hello: 'world'
            }
        };
    } else if (param===2) {   //返回，声明的异常代码
        throw new ErrorMessagedException('这个错误交给系统处理',  {
            statusCode: '4020001',
            data: {
                hello: 'world'
            }
        });

    }
}

export const account = {
    accountRecharge
};