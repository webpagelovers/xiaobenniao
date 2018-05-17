X.define("data.currencyData",function () {
    var currency = {
        "currencyKinds":[
            {key: 0, value: "USD"},
            {key: 1, value: "HKD"},
            {key: 2, value: "EUR"},
            {key: 3, value: "CNY"},
            {key: 4, value: "GBP"},
            {key: 5, value: "AED"},
            {key: 6, value: "AUD"},
            {key: 7, value: "CAD"},
            {key: 8, value: "CHF"},
            {key: 9, value: "JPY"},
            {key: 10, value: "NZD"},
            {key: 11, value: "SEK"},
            {key: 12, value: "SGD"}
        ],
        getCurrency:function(currency){
            var items = this["currencyKinds"];
            for(var i = 0; i < items.length; i++ ){
                if(items[i]["key"]==currency){
                    return items[i]["value"]
                }
            }
        }
    };

    return currency;
});