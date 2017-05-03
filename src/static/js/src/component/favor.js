/**
 * Created by carina on 17/2/17.
 */
var favorComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'favor':true}
        }
    },
    template: __inline('../template/_favor-mini.html?__inline'),
    methods:{
    },
    created: function () {
        console.log();
    }
});
Vue.component('favor', favorComponent);

var favorFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{
                data:[]
            },//必要
            show:false,//必要
            i18n: window.i18n[document.body.getAttribute('data-localize')],
        }
    },
    methods: {
        subForm:function () {
            var $this=this;
        },
    },
    template: __inline('../template/_favor-form.html?__inline'),
    created: function () {
        //console.log()
        /*var $this = this;
         if(!$this.setting.data){
         var dataItem ={
         icon_img:"",
         url_type:"",
         url_text:"",
         icon_title:"",
         item_action_url:""

         };
         var initDataArray =[];
         for(var i=0;i<5;i++){
         initDataArray.push(dataItem)
         }
         Vue.set($this.setting,'data',initDataArray);
         }*/
    },
    watch: {
        /*setting:function(val, oldval){
         var $this = this;
         if(!$this.setting.data){
         var dataItem ={
         icon_img:"",
         url_type:"",
         url_text:"",
         icon_title:"",
         item_action_url:""

         };
         var initDataArray =[];
         for(var i=0;i<5;i++){
         initDataArray.push(dataItem)
         }
         Vue.set($this.setting,'data',initDataArray);
         }
         }*/
    }

});
Vue.component('favor-form', favorFormComponent);