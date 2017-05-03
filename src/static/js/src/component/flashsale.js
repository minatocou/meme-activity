/**
 * Created by Jesse on 17/3/9.
 */
var flashsaleComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'flashsale':true}
        }
    },
    template:__inline("../template/_flashsale-mini.html?__inline"),
});
Vue.component("flashsale",flashsaleComponent);
var flashsaleFormComponent = Vue.extend({
    data:function () {
        return {
            setting:{
                data:[]
            },//必要
        }
    },
    template:"",
});
Vue.component("flashsale-form",flashsaleFormComponent);