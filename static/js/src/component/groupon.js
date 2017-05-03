var grouponComponent=Vue.extend({props:["setting"],data:function(){return{extendClass:{groupon:!0}}},template:'<li class="template" :class="extendClass" data-field="groupon" :data-setting="setting | json">\n    <div class="block-img">\n        <div>\n            <img src="/img/static/img/component/groupon_block.png">\n        </div>\n        <p>拼团商品组件</p>\n    </div>\n    <div class="canvas-img" >\n        <img src="/img/static/img/component/groupon_canvas.png">\n        <i class="close-btn">×</i>\n    </div>\n</li>',methods:{},created:function(){console.log()}});Vue.component("groupon",grouponComponent);var grouponFormComponent=Vue.extend({data:function(){return{setting:{data:[]},show:!1,urlType:{url:{value:"URL",palceholderVal:"URL"},channel:{value:"频道ID",palceholderVal:"示例:1234"},detail:{value:"SKU",palceholderVal:"示例:CBD492"},brand:{value:"品牌ID",palceholderVal:"示例：123"},category:{value:"前台分类",palceholderVal:"示例:面膜"},"function":{value:"功效",palceholderVal:"示例:补水保湿"},search:{value:"搜索",palceholderVal:"搜索关键词"}},i18n:window.i18n[document.body.getAttribute("data-localize")]}},methods:{changeUrlType:function(n){var e=n.currentTarget,a=$(e).find("option:selected").data("placeholder");$(e).siblings(".inputWord").attr("placeholder",a);var t=$(e).find("option:selected").data("link_type");$(e).siblings(".inputWord").val("");var l=$(e).siblings(".inputWord").val(),o=convertToAPPLink(t,l);$(e).siblings("[name=action_url]").val(o),$(e).siblings("[name=action_url_type]").val(t)},changeUrlInput:function(n){var e=n.currentTarget,a=$(e).siblings("select.appLink").find("option:selected").data("link_type"),t=$(e).val(),l=convertToAPPLink(a,t);$(e).siblings("[name=action_url]").val(l),$(e).siblings("[name=action_url_type]").val(a)},subForm:function(){}},template:'<div class="groupon-attr attr-form" v-show="show" role="form">\n    <div class="panel-group">\n        <div class="panel panel-default">\n            <div class="panel-heading"><a data-toggle="collapse" data-parent="#groupon" href="#groupon">拼团组件</a>\n            </div>\n            <div id="groupon" class="panel-collapse collapse">\n                <div class="panel-body">\n                    <form class="commonConf">\n                        <!--<div class="form-group ">\n                            <div>*背景图片URL(建议大小?*?)</div>\n                            <input class="form-control input-sm bgImg" value="${setting.bg_img}" name="bg_img" placeholder="${i18n.bg_url}"\n                                   type="text">\n                        </div>-->\n                        <div class="form-group">\n                            <div>跳转URL/APP原生页面</div>\n                            <select class="form-control linkKind appLink" name="url_type" @change="changeUrlType($event)" value="${setting.url_type}">\n                                <template v-for="(k,v) in urlType">\n                                    <option v-if="setting.url_type==v.value"\n                                            data-link_Type ="${k}"\n                                            data-placeholder="${v.palceholderVal}"\n                                            selected>\n                                        ${v.value}\n                                    </option>\n                                    <option v-else\n                                            data-link_Type ="${k}"\n                                            data-placeholder="${v.palceholderVal}">\n                                        ${v.value}\n                                    </option>\n                                </template>\n                            </select>\n                            <input class="form-control input-sm inputWord" name="url_text" @change="changeUrlInput($event)" value="${setting.url_text}" placeholder="URL" type="text">\n                            <input class="form-control input-sm" name="action_url" type="hidden" value="${setting.action_url}">\n                            <input class="form-control input-sm" name="action_url_type" type="hidden" value="${setting.action_url_type}">\n                        </div>\n                        <input type="hidden" class="has_change" name="has_change" value="${setting.has_change}">\n                    </form>\n\n                    <div v-if="setting.data && setting.data.length>0" class="grouponGroup singleConf">\n                        <form v-for="(i,groupon) in setting.data" class="grouponItem singleItem">\n                            <div class="itemBody">\n                                <div class="form-group">\n                                    <div><em class="red">*</em>拼团商品SKU</div>\n                                    <textarea class="form-control input-sm position" name="sku">${groupon.sku}</textarea>\n                                    <div class="tips">注:SKU之间用英文逗号隔开,数量不得超过20个,区分大小写,例如:CBD002,DV003.SKU需要是有效的拼团商品,否则该SKU会被自动忽略。</div>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n',created:function(){},watch:{}});Vue.component("groupon-form",grouponFormComponent);