import events from 'nt-framework/src/communication/events.js';

const ws = 'ws://192.168.30.191:60001/ws';

class Socket extends events {

    constructor(){
        super();
        this.msgs = {};
    }


    init(appCode,token,server){
        let that = this;
        if(this.instance==undefined){
            this.appCode = appCode;
            this.token = token;
            this.server = server;

            if (!window.WebSocket) {
                window.WebSocket = window.MozWebSocket;
            }
            if (window.WebSocket) {
                let socket = new WebSocket(this.server);
                socket.onmessage = function (event) {
                    that.handelMessage(event);
                };
                socket.onopen = function (event) {
                    console.log('连接建立成功');
                    //连接成功后自动发送注册请求
                    socket.send(that.toMessage(Socket.messageType.loginRequest.key));
                };
                socket.onclose = function (event) {
                    console.log('服务器关闭连接');
                };

                this.instance = socket;
            } else {
                alert('你的浏览器不支持WebSocket,请使用Chrome或者Fire Fox浏览器');
            }

        }
    }

    handelMessage(event){
        try{
            let that = this;
            let data = JSON.parse(event.data);
            if(data){
                switch(data.messageTypeCode){
                    case Socket.messageType.loginAck.key:
                        //注册成功
                        break;
                    case Socket.messageType.loginUnauthorized.key:
                        console.log(Socket.messageType.loginUnauthorized.name)
                        break;
                    case Socket.messageType.forbidden.key:
                        console.log(Socket.messageType.forbidden.name)
                        break;
                    case Socket.messageType.otherLogin.key:
                        console.log(Socket.messageType.otherLogin.name)
                        break;
                    case Socket.messageType.heartbeatTimeout.key:
                        console.log(Socket.messageType.heartbeatTimeout.name)
                        break;
                    case Socket.messageType.ack.key:
                        console.log(Socket.messageType.ack.name);

                        break;
                    case Socket.messageType.data.key:
                        console.log(Socket.messageType.data.name);
                        that.trigger('onmessage',data);
                        that.msgs[data.messageId] = data;
                        break;
                }
            }
        }
        catch(ex) {
            console.log('解析消息格式错误');
        }
    }

    toMessage(type){
        let message = {
            messageTypeCode : type,
            appCode : parseInt(this.appCode),
            token: this.token
        };
        return JSON.stringify(message);
    }

    send(msg){
        if(this.instance){
            this.instance.send(msg);
        }
    }

    deleteMessage(data){

        if(!Array.isArray(data)){
            data = [data]
        }
        if(Array.isArray(data)){
            for(let msg of data){
                delete this.msgs[msg.messageId];
            }
            if(this.hasMessages()){
                this.trigger('onmessageempty');
            }
        }
    }

    hasMessages(){
        return JSON.stringify(this.msgs)!="{}";
    }
}

Socket.messageType = {
    loginRequest : { key:'00001', name: '注册请求'} ,
    loginAck     : { key:'00002', name: '注册确认'} ,
    loginUnauthorized : { key:'00003', name: '用户认证失败'} ,
    forbidden : { key:'00004', name: '拒绝执行'} ,
    otherLogin : { key:'00005', name: '异地登录'} ,
    heartbeatTimeout : { key:'00006', name: '心跳超时'} ,
    ack : { key:'10001', name: '消息发送者收到消息表示发送成功'} ,
    data :{ key: '10000',name : '数据'}
}


let socket = new Socket();

export default socket;
