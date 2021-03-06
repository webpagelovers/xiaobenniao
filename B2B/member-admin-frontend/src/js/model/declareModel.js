
X.define("model.declareModel", function () {

    var declareModel = X.model.create("model.declareModel", {});

    //新增订单
    declareModel.addOrder = function (data,callback) {

        var option = {url: X.config.declare.api.addOrder,type:"POST",data:data,callback:function(result){
            callback&&callback(result);
        }};

        X.loadData(option);
    };

    declareModel.const = {
        paymentMethod:[
            {key:'0',value:"Paypal"},
            {key:'1',value:"线下支付"},
            {key:'2',value:"电汇"}
        ],
        currencyType:[
            {key:"110",value:"港元"},
            {key:"113",value:"伊朗里亚尔"},
            {key:"116",value:"日本元"},
            {key:"118",value:"科威特第纳尔"},
            {key:"121",value:"澳门元"},
            {key:"122",value:"马来西亚林吉特"},
            {key:"127",value:"巴基斯坦卢比"},
            {key:"129",value:"菲律宾比索"},
            {key:"132",value:"新加坡元"},
            {key:"136",value:"泰国铢"},
            {key:"142",value:"人民币"},
            {key:"143",value:"台湾元"},
            {key:"300",value:"欧元"},
            {key:"302",value:"丹麦克朗"},
            {key:"303",value:"英镑"},
            {key:"326",value:"挪威克朗"},
            {key:"330",value:"瑞典克朗"},
            {key:"331",value:"瑞士法郎"},
            {key:"398",value:"记帐瑞士法郎"},
            {key:"501",value:"加拿大元"},
            {key:"502",value:"美元"},
            {key:"601",value:"澳大利亚元"},
            {key:"609",value:"新西兰元"}
        ],
        drawbackMode:[
            {key:'0',value:"免退税"},
            {key:'1',value:"免抵退税"},
            {key:'2',value:"免税"},
            {key:'3',value:"市场采购"}
        ],
        logisticsCompany:[
            {key:'0',value:"中国邮政集团公司杭州市分公司"}
        ],
        typeOfShipping:[
            {key:"0",value:"非保税区"},
            {key:"1",value:"监管仓库"},
            {key:"2",value:"江海运输"},
            {key:"3",value:"铁路运输"},
            {key:"4",value:"汽车运输"},
            {key:"5",value:"航空运输"},
            {key:"6",value:"邮件运输"},
            {key:"7",value:"保税区"},
            {key:"8",value:"保税仓库"},
            {key:"9",value:"其它运输"},
            {key:"Z",value:"出口加工"},
            {key:"A",value:"全部运输"},
            {key:"W",value:"物流中心"},
            {key:"X",value:"物流园区"},
            {key:"Y",value:"保税港区"}
        ],
        delivery:[
            {key:'0',value:"邮政小包"},
            {key:'1',value:"快件"},
            {key:'2',value:"EMS"}
        ],
        packingType:[
            {key:"1",value:"木箱"},
            {key:"2",value:"纸箱"},
            {key:"3",value:"桶装"},
            {key:"4",value:"散装"},
            {key:"5",value:"托盘"},
            {key:"6",value:"包"},
            {key:"7",value:"其它"}
        ],
        unit:[
            {key:"001",value:"台"},
            {key:"002",value:"座"},
            {key:"003",value:"辆"},
            {key:"004",value:"艘"},
            {key:"005",value:"架"},
            {key:"006",value:"套"},
            {key:"007",value:"个"},
            {key:"008",value:"只"},
            {key:"009",value:"头"},
            {key:"010",value:"张"},
            {key:"011",value:"件"},
            {key:"012",value:"支"},
            {key:"013",value:"枝"},
            {key:"014",value:"根"},
            {key:"015",value:"条"},
            {key:"016",value:"把"},
            {key:"017",value:"块"},
            {key:"018",value:"卷"},
            {key:"019",value:"副"},
            {key:"020",value:"片"},
            {key:"021",value:"组"},
            {key:"022",value:"份"},
            {key:"023",value:"幅"},
            {key:"025",value:"双"},
            {key:"026",value:"对"},
            {key:"027",value:"棵"},
            {key:"028",value:"株"},
            {key:"029",value:"井"},
            {key:"030",value:"米"},
            {key:"031",value:"盘"},
            {key:"032",value:"平方米"},
            {key:"033",value:"立方米"},
            {key:"034",value:"筒"},
            {key:"035",value:"千克"},
            {key:"036",value:"克"},
            {key:"037",value:"盆"},
            {key:"038",value:"万个"},
            {key:"039",value:"具"},
            {key:"040",value:"百副"},
            {key:"041",value:"百支"},
            {key:"042",value:"百把"},
            {key:"043",value:"百个"},
            {key:"044",value:"百片"},
            {key:"045",value:"刀"},
            {key:"046",value:"疋"},
            {key:"047",value:"公担"},
            {key:"048",value:"扇"},
            {key:"049",value:"百枝"},
            {key:"050",value:"千只"},
            {key:"051",value:"千块"},
            {key:"052",value:"千盒"},
            {key:"053",value:"千枝"},
            {key:"054",value:"千个"},
            {key:"055",value:"亿支"},
            {key:"056",value:"亿个"},
            {key:"057",value:"万套"},
            {key:"058",value:"千张"},
            {key:"059",value:"万张"},
            {key:"060",value:"千伏安"},
            {key:"061",value:"千瓦"},
            {key:"062",value:"千瓦时"},
            {key:"063",value:"千升"},
            {key:"067",value:"英尺"},
            {key:"070",value:"吨"},
            {key:"071",value:"长吨"},
            {key:"072",value:"短吨"},
            {key:"073",value:"司马担"},
            {key:"074",value:"司马斤"},
            {key:"075",value:"斤"},
            {key:"076",value:"磅"},
            {key:"077",value:"担"},
            {key:"078",value:"英担"},
            {key:"079",value:"短担"},
            {key:"080",value:"两"},
            {key:"081",value:"市担"},
            {key:"083",value:"盎司"},
            {key:"084",value:"克拉"},
            {key:"085",value:"市尺"},
            {key:"086",value:"码"},
            {key:"088",value:"英寸"},
            {key:"089",value:"寸"},
            {key:"095",value:"升"},
            {key:"096",value:"毫升"},
            {key:"097",value:"英加仑"},
            {key:"098",value:"美加仑"},
            {key:"099",value:"立方英尺"},
            {key:"101",value:"立方尺"},
            {key:"110",value:"平方码"},
            {key:"111",value:"平方英尺"},
            {key:"112",value:"平方尺"},
            {key:"115",value:"英制马力"},
            {key:"116",value:"公制马力"},
            {key:"118",value:"令"},
            {key:"120",value:"箱"},
            {key:"121",value:"批"},
            {key:"122",value:"罐"},
            {key:"123",value:"桶"},
            {key:"124",value:"扎"},
            {key:"125",value:"包"},
            {key:"126",value:"箩"},
            {key:"127",value:"打"},
            {key:"128",value:"筐"},
            {key:"129",value:"罗"},
            {key:"130",value:"匹"},
            {key:"131",value:"册"},
            {key:"132",value:"本"},
            {key:"133",value:"发"},
            {key:"134",value:"枚"},
            {key:"135",value:"捆"},
            {key:"136",value:"袋"},
            {key:"139",value:"粒"},
            {key:"140",value:"盒"},
            {key:"141",value:"合"},
            {key:"142",value:"瓶"},
            {key:"143",value:"千支"},
            {key:"144",value:"万双"},
            {key:"145",value:"万粒"},
            {key:"146",value:"千粒"},
            {key:"147",value:"千米"},
            {key:"148",value:"千英尺"},
            {key:"163",value:"部"}
        ]
    };

    return declareModel;
});