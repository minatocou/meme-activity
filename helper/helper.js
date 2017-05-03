/**
 * Created by memebox on 16/11/25.
 */


var helper = function(hbs ) {

    hbs.registerHelper('backh5', function(val) {
        if( val == 1){
            return '/h5/cn/plist'
        }else if(val == 2){
            return '/h5/cn/mlist'
        }else if(val == 3){
            return '/h5/kr/mlist'
        }
    });

    hbs.registerHelper('backpc', function(val) {
        if( val == 1){
            return '/pc/cn/plist'
        }else if(val == 2){
            return '/pc/cn/mlist'
        }else if(val == 3){
            return '/pc/kr/mlist'
        }
    });

    hbs.registerHelper('gift', function(val) {
        var obj = {
            11: '/gift/cn/base/partProduct',
            12: '/gift/cn/base/boxProduct',
        };
        return obj[val];
    });

    hbs.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==':     function(l, r) { return l == r; },
            '===':    function(l, r) {return l === r; },
            '!=':     function(l, r) {return l != r; },
            '!==':    function(l, r) {return l !== r; },
            '<':      function(l, r) {return l < r; },
            '>':      function(l, r) {return l > r; },
            '<=':     function(l, r) {return l <= r; },
            '>=':     function(l, r) {return l >= r; },
            'typeof': function(l, r) {return typeof l == r; },
            'json':     function(l,r) {console.log(JSON.stringify(l),"compare");return JSON.stringify(l); },
        };

        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    hbs.registerHelper('json', function(left, operator, right, options) {
        return JSON.stringify(left);
    })
    hbs.registerHelper('css', function(left, operator, right, options) {
        var css=[];
        for(var i in left){
            css.push(i+':'+left[i]);
        }
        console.log(css,'css');
        return css.join(';');
    })

    hbs.registerHelper("mlink",function(type,id){
        var types = {
            '1' : 'home'
        };
        if(types[type] &&id){
            return '/app/'+types[type]+'/'+id;
        }
        if(type==226 &&id){
            return "/app/brand/"+id+"/1";
        }else if(type==224 &&id){
            return "/app/brand/"+id+"/2";
        }else if(type==227 &&id){
            return "/app/brand/"+id+"/4";
        }else if(type==228 &&id){
            return "/app/brand/"+id+"/3";
        }else {
            return "javascript:void(0)";
        }
    });

    hbs.registerHelper("status",function(val){
        var status = {
            '0':'待发布',
            '1':'已发布'
        };
        if(status[val]){
            return status[val];
        }
    });

    hbs.registerHelper("litext",function(type,status){
        if(type==1&&status==1){
            return '查看';
        }else if(type==1&&status==0){
            return '编辑';
        }else if(type==226&&status==1){
            return '查看';
        }else if(type==224&&status==1){
            return '查看';
        }else if(type==227&&status==1){
            return '查看';
        }else if(type==228&&status==1){
            return '查看';
        }else {
            return '编辑';
        }
    });

    hbs.registerHelper("videostatus",function(val){
        var status = {
            '0':'关闭',
            '1':'开启'
        };
        if(status[val]){
            return status[val];
        }
    });
    
    hbs.registerHelper("videoimg",function(imgUrl,videoImg){
        if(!imgUrl){
            return videoImg;   
        }
    });

    hbs.registerHelper("livestatus",function(val){
        var status = {
            '1':'未开始',
            '2':'直播中',
            '4':'已结束',
            '8':'被禁播'
        };
        if(status[val]){
            return status[val];
        }
    });



}

module.exports = helper;
