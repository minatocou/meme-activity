/**
 * Created by carina on 17/2/12.
 */


var appLinkInfo = {
    url:{domain:'h5page', action:'to_h5page',data:{url:''}},
    channel:{domain:'channel',action:'channel',data:{channelId:''}},
    detail:{domain:'product',action:'detail',data:{productId:''}},
    brand:{domain:'brand',action:'to_brand',data:{brandId:''}},
    category:{domain:'search',action:'search_type',data:{type:0,keyword:''}},
    function:{domain:'search',action:'search_type',data:{type:1,keyword:''}},
    search:{domain:'search',action:'search_keyword',data:{keyword:''}}
}

var inputInfo = {
    url:'url',
    channel:'channelId',
    detail:'productId',
    brand:'brandId',
    category:'keyword',
    function:'keyword',
    search:'keyword'
}


function convertToAPPLink(type,word){
    if(type&&word){
        var key = inputInfo[type];
        var info = appLinkInfo[type];
        var data = info['data'];
        data[key]=word;
        var link = "memebox://"+encodeURIComponent(JSON.stringify(info));
        return link;
    }else{
        return '';
    }

}

/*
function unConvertAPPLink(string){
    if(string){
        var link = decodeURIComponent(string);
        var linkJson = JSON.parse(link.replace("memebox://",""));

        var type,word;

        var data = linkJson['data'];
        var domain = linkJson['domain'];
        for(var k in appLinkInfo) {
            if (appLinkInfo[k]['domain'] == domain){
                if((data['type']==undefined&&appLinkInfo[k]['data']['type']==undefined)||appLinkInfo[k]['data']['type'] == data['type']){
                    type = k;
                }
            }
        }
        var wordKey = inputInfo[type];
        word=data[wordKey];

        var obj = {
            type:type,
            word:word
        }
        return obj
    }

}*/
