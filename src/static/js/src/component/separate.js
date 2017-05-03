/**
 * Created by carina on 17/2/17.
 */
var separateComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'separate':true}
        }
    },
    template: __inline('../template/_separate-mini.html?__inline'),
    methods:{
    },
    created: function () {
        //console.log(this.setting)
    }
});
Vue.component('separate', separateComponent);

var separateFormComponent = Vue.extend({
    data: function(){
        return {
            setting: {
                isNew:null,
                data: []
            },//必要
            show: false,//必要
            urlType:{
                url:{value:"URL",palceholderVal:"URL"},
                channel:{value:"频道ID",palceholderVal:"示例:1234"},
                detail:{value:"SKU",palceholderVal:"示例:CBD492"},
                brand:{value:"品牌ID",palceholderVal:"示例：123"},
                category:{value:"前台分类",palceholderVal:"示例:面膜"},
                function:{value:"功效",palceholderVal:"示例:补水保湿"},
                search:{value:"搜索",palceholderVal:"搜索关键词"},
            },
            i18n: window.i18n[document.body.getAttribute('data-localize')],
            picked:'block'
        };
    },
    methods: {
        changeUrlType:function (event) {
            var selectDom = event.currentTarget;
            var placeholder = $(selectDom).find("option:selected").data("placeholder");
            $(selectDom).siblings(".inputWord").attr("placeholder",placeholder);
            var type = $(selectDom).find("option:selected").data("link_type");
            $(selectDom).siblings(".inputWord").val('');
            var input = $(selectDom).siblings(".inputWord").val();
            var link = convertToAPPLink(type,input);
            $(selectDom).siblings("[name=item_action_url]").val(link);
            $(selectDom).siblings("[name=item_action_url_type]").val(type);
        },
        changeUrlInput:function (event) {
            var inputDom = event.currentTarget;
            var type = $(inputDom).siblings("select.appLink").find("option:selected").data("link_type");
            var input = $(inputDom).val();
            var link = convertToAPPLink(type,input);

            $(inputDom).siblings("[name=item_action_url]").val(link);
            $(inputDom).siblings("[name=item_action_url_type]").val(type);
        },
        subForm:function () {
            var $this=this;
        },
    },
    template: __inline('../template/_separate-form.html?__inline'),
    created: function () {
        
    },
    watch: {
        setting:function(val, oldval) {
            var $this = this;
            if ($this.setting.data.length > 0) {
                if ($this.setting.data[0]['space_type'] == 'block') {
                    $this.picked='block';
                }else{
                    $this.picked='img';
                }
            }
        }

    }

});
Vue.component('separate-form', separateFormComponent);