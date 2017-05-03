var brandHomeComponent = Vue.extend({
    props: ['setting'],
    data: function(){
        return {
            extendClass:{'brandhome': true}
        }
    },
    template: __inline('../template/_brandhome-min.html?__inline'),
    methods:{
    },
    created: function (){

    }
});
Vue.component('brandhome', brandHomeComponent);

var brandHomeFormComp = Vue.extend({
    props:['brandData', 'channelsData'],
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
    template:  __inline('../template/_brandhome-form.html?__inline'),
    created: function () {
        console.log()

    }
});

Vue.component('brandhome-form', brandHomeFormComp);
