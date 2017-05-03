var discountComponent=Vue.extend({props:["setting"],data:function(){return{extendClass:{discount:!0}}},template:'<li class="template" :class="extendClass" data-field="discount" :data-setting="setting | json">\n    <div class="block-img">\n        <div>\n            <img src="/img/static/img/component/discount_block.png">\n        </div>\n        <p>今日特价组件</p>\n    </div>\n    <div class="canvas-img" >\n        <img src="/img/static/img/component/discount_canvas.png">\n        <i class="close-btn">×</i>\n    </div>\n</li>',methods:{},created:function(){}});Vue.component("discount",discountComponent);var discountFormComponent=Vue.extend({data:function(){return{setting:{},show:!1,urlType:{url:{value:"URL",palceholderVal:"URL"},channel:{value:"频道ID",palceholderVal:"示例:1234"},detail:{value:"SKU",palceholderVal:"示例:CBD492"},brand:{value:"品牌ID",palceholderVal:"示例：123"},category:{value:"前台分类",palceholderVal:"示例:面膜"},"function":{value:"功效",palceholderVal:"示例:补水保湿"},search:{value:"搜索",palceholderVal:"搜索关键词"}},i18n:window.i18n[document.body.getAttribute("data-localize")]}},methods:{addDiscount:function(t){var n=this,e=$(t.currentTarget).closest(attrClass),a=uuid();n.setting.data.push({status:"1",discount_time:"",category_id:"",url_type:"",url_text:"",item_action_url:"",item_action_url_type:"",id:a}),binChange();var i=setTimeout(function(){n.resetSetting(e),clearTimeout(i)},30)},initDate:function(t){$(t.target).datetimepicker({format:"Y/m/d",timepicker:!1})},slideItem:function(t){var n=t.currentTarget;$(n).find(".fa").toggleClass("fa-caret-right"),$(n).siblings(".itemBody").slideToggle()},status:function(t){{var n=$("body").data("state"),e=$("body").data("server-time"),a=t.status,i=t.discount_time.replace(/-/g,"/");new Date(i).getTime()/1e3}return 1==n?1==a?i>e?"未开始":(e=i)?"已上线":"已过期":"已关闭":0==a?"已关闭":"--"},changeUrlType:function(t){var n=t.currentTarget,e=$(n).find("option:selected").data("placeholder");$(n).siblings(".inputWord").attr("placeholder",e);var a=$(n).find("option:selected").data("link_type");$(n).siblings(".inputWord").val("");var i=$(n).siblings(".inputWord").val(),s=convertToAPPLink(a,i);$(n).siblings("[name=item_action_url]").val(s),$(n).siblings("[name=item_action_url_type]").val(a)},changeUrlInput:function(t){var n=t.currentTarget,e=$(n).siblings("select.appLink").find("option:selected").data("link_type"),a=$(n).val(),i=convertToAPPLink(e,a);$(n).siblings("[name=item_action_url]").val(i),$(n).siblings("[name=item_action_url_type]").val(e)},shutDiscount:function(t){for(var n=this,e=$(t.currentTarget).closest(attrClass),a=$(t.currentTarget).closest(".singleItem").find(".uid").val(),i=n.setting.data,s=0;s<i.length;s++)a==i[s].id&&(i[s].status=0);n.setting.data=i;var o=setTimeout(function(){n.resetSetting(e);var a=$("body").data("state");saveData(a,function(t){1==t.code?window.location.href="/app/home/"+t.data.pageId:alert(t.msg)},$(t.currentTarget)),clearTimeout(o)},30)},openDiscount:function(t){for(var n=this,e=$(t.currentTarget).closest(attrClass),a=$(t.currentTarget).closest(".singleItem").find(".uid").val(),i=n.setting.data,s=0;s<i.length;s++)a==i[s].id&&(i[s].status=1);n.setting.data=i;var o=setTimeout(function(){n.resetSetting(e);var a=$("body").data("state");saveData(a,function(t){1==t.code?window.location.href="/app/home/"+t.data.pageId:alert(t.msg)},$(t.currentTarget)),clearTimeout(o)},30)},deleteDiscount:function(t){for(var n=this,e=$(t.currentTarget).closest(attrClass),a=$(t.currentTarget).closest(".singleItem").find(".uid").val(),i=n.setting.data,s=[],o=0;o<i.length;o++)a!=i[o].id&&s.push(i[o]);n.setting.data=s;var l=setTimeout(function(){n.resetSetting(e);var a=$("body").data("state");saveData(a,function(t){1==t.code?window.location.href="/app/home/"+t.data.pageId:alert(t.msg)},$(t.currentTarget)),clearTimeout(l)},30)},resetSetting:function(t){var n=$(t).find("form.commonConf").eq(0).serializeObject(),e=$(t).find(".singleConf form.singleItem"),a=$(e).length,i=[];if(a>0)for(var s=0;a>s;s++)i.push($(e[s]).serializeObject());var o=_.extend(n,{data:i});resetForm(o)},subForm:function(){}},template:'<div class="discount-attr attr-form" v-show="show" role="form">\n    <div class="panel-group">\n        <div class="panel panel-default">\n            <div class="panel-heading"><a data-toggle="collapse" data-parent="#discount" href="#discount">今日特价组件</a>\n            </div>\n            <div id="discount" class="panel-collapse collapse">\n                <div class="panel-body">\n                    <form class="commonConf">\n                        <input type="hidden" class="has_change" name="has_change" value="${setting.has_change}">\n                    </form>\n\n                    <div v-if="setting.data && setting.data.length>0" class="discountGroup singleConf">\n                        <form  v-for="(i,discount) in setting.data" class="discountItem singleItem">\n                            <input type="hidden" class="uid" name="id" value="${discount.id}">\n                            <a class="itemTitle" @click="slideItem($event)">配置(${discount.discount_time},${status(discount)}) <i class="fa fa-caret-down"></i></a>\n                            <div class="itemBody">\n                                <!--<div class="form-group ">\n                                    <div>*背景图片URL(建议750*1111)</div>\n                                    <input class="form-control input-sm bgImg removeSpace" value="${discount.banner_img}" name="banner_img" placeholder="${i18n.bg_url}"\n                                           type="text">\n                                </div>-->\n                                <div class="form-group">\n                                    <div>跳转URL/APP原生页面</div>\n                                    <select class="form-control linkKind appLink" name="url_type" @change="changeUrlType($event)" value="${discount.url_type}">\n                                        <template v-for="(k,v) in urlType">\n                                            <option v-if="discount.url_type==v.value"\n                                                    data-link_Type ="${k}"\n                                                    data-placeholder="${v.palceholderVal}"\n                                                    selected>\n                                                ${v.value}\n                                            </option>\n                                            <option v-else\n                                                    data-link_Type ="${k}"\n                                                    data-placeholder="${v.palceholderVal}">\n                                                ${v.value}\n                                            </option>\n                                        </template>\n                                    </select>\n                                    <input class="form-control input-sm inputWord" name="url_text" @change="changeUrlInput($event)" value="${discount.url_text}" placeholder="URL" type="text">\n                                    <input class="form-control input-sm" name="item_action_url" type="hidden" value="${discount.item_action_url}">\n                                    <input class="form-control input-sm" name="item_action_url_type" type="hidden" value="${discount.item_action_url_type}">\n                                </div>\n                                <div class="form-group">\n                                    <div><em class="red">*</em>活动时间</div>\n                                    <input @mousedown="initDate($event)" class="form-control input-sm " v-model="discount.discount_time" value="${discount.discount_time}"  name="discount_time" placeholder="${i18n.tip_time}"\n                                           type="text">\n                                </div>\n                                <div class="form-group">\n                                    <div><em class="red">*</em>Category ID</div>\n                                    <input class="form-control input-sm position" value="${discount.category_id}"  name="category_id" placeholder="${i18n.please_input_number}"\n                                           type="text">\n                                </div>\n                                <div class="form-group">\n                                    <div class="ops">\n                                        <a class="btn btn-warning btn-sm shutDiscount" @click="shutDiscount($event)" :class="{\'active\':discount.status==1}" type="button">${i18n.shut}\n                                        </a>\n                                        <a class="btn btn-success btn-sm openDiscount" @click="openDiscount($event)" :class="{\'active\':discount.status==0}" type="button">${i18n.open}\n                                        </a>\n                                    </div>\n                                    <input class="status" type="hidden" name="status" value="${discount.status}">\n                                </div>\n                            </div>\n                            <div class="form-group delIcon">\n                                <div class="ops">\n                                    <a class="btn btn-sm delBanner" @click="deleteDiscount($event)" type="button">×</a>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                    <a @click="addDiscount($event)" class="addDiscount btn btn-primary">${i18n.add_config} + </a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n',created:function(){console.log()}});Vue.component("discount-form",discountFormComponent);