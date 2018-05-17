X.define('modules.common.loadingTime', function () {
    function sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }
    function mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }
    ///var loadingtime; 
    function testSpeed(){
        var stopTime1 = new Date().getTime();
        var stopTime = div(stopTime1,1000);
        var startTime = div(startTime1,1000);
        $('#loadingTimeShow').text(sub(stopTime,startTime));
        var loadingtime = sub(stopTime,startTime);
        var path = window.location.pathname;
        $.get(X.config.PATH_FILE.path.root +'collectloadingtime?url='+path+'&ltime='+loadingtime);
    }
    testSpeed()
})