/**
 * Created by yate on 2017/2/27.
 */
var brandComponent = Vue.extend({
    props: ['setting'],
    data: function(){
        return {
            extendClass:{'brandcate': true}
        }
    },
    template: __inline('../template/_brandcate-min.html?__inline'),
    methods:{
    },
    created: function (){

    }
});
Vue.component('brandcate', brandComponent);

var brandFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{
                data:[]
            },//必要
            show:false,//必要
        }
    },
    methods: {
        slideItem:function(event){
            var $this = this;
            var currentDom = event.currentTarget;
            $(currentDom).find('.fa').toggleClass('fa-caret-right');
            $(currentDom).siblings('.itemBody').slideToggle();
        },
    },
    template:  __inline('../template/_brandcate-form.html?__inline'),
    created: function () {
        console.log()

    }
});

Vue.component('brandcate-form', brandFormComponent);
