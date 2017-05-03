/**
 * Created by carina on 17/3/24.
 */
/**
 * Created by carina on 17/2/17.
 */
var favorcomComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'favorcom':true}
        }
    },
    template: __inline('../template/_favorcom-mini.html?__inline'),
    methods:{
    },
    created: function () {
        console.log();
    }
});
Vue.component('favorcom', favorcomComponent);

var favorcomFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{
                data:[]
            },//必要
            actionUrl:'',
            show:false,//必要
            i18n: window.i18n[document.body.getAttribute('data-localize')],
        }
    },
    methods: {
        initDate: function (event,ctime,type) {
            var options={};
            if(ctime && type=='start'){
                options['maxDate']=ctime;
            }
            if(ctime && type=='end'){
                options['minDate']=ctime;
            }
            $(event.target).datetimepicker({
                onShow:function( ct ){
                    this.setOptions(options)
                }
            });
        },
        actionUrlConvert:function(){
            var $this = this;
            var info = {"domain":"recommand","action":"to_recommand","data":{}};
            var link = "memebox://"+encodeURIComponent(JSON.stringify(info));
            $this.actionUrl = link;
        },
        subForm:function () {
            var $this=this;
        },
    },
    template: __inline('../template/_favorcom-form.html?__inline'),
    created: function () {
        var $this = this;
        $this.actionUrlConvert();
    },
    watch: {
       
    }

});
Vue.component('favorcom-form', favorcomFormComponent);