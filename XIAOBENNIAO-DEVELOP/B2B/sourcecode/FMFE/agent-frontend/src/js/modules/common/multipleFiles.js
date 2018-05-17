X.define("modules.common.multipleFiles", function () {


    var multipleFiles = {

        introduceFiles : function(resources,callback){
            $.i18n.properties({
                name : resources,
                mode : "map",
                language : "en-US",
                callback : callback

            });
        }


    };


    return multipleFiles;
});