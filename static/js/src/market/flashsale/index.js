Vue.config.delimiters=["${","}"];var topComponent=Vue.extend({props:["topData"],data:function(){return{id:"",active:1,name:"",description:"无用字段"}},methods:{save:function(){var t=this,n=!0,e={name:t.name,active:t.active,description:t.description,groups:JSON.stringify(t.$parent.$refs.groups.groups)};t.id&&(e.id=t.id),console.log(t.$parent.$refs.groups.groups);var a=document.getElementsByTagName("input");Array.prototype.some.call(a,function(t){return""===t.value.trim()&&(n=!1)}),n?$.ajax({url:"/api/internal/sas/seckill/save",data:e,dataType:"json",method:"POST",success:function(t){alert(t.msg),1==t.code?location.href="/market/flash/list":t.data&&t.data.id&&(e.id?location.reload():location.href+="?id="+t.data.id)},error:function(t){console.log(t)}}):alert("输入框不能为空")}},template:'<div class="top">\n    <button type="button" class="btn btn-default" id="saveBtn" @click="save">保存</button>\n</div>\n<div class="rule">\n    <span class="title">基本配置</span>\n    <div class="group">\n        <div>\n            <span>活动开关</span>\n            <select id="active" v-model="active">\n                <option value="0">关闭</option>\n                <option value="1">开启</option>\n            </select>\n        </div>\n        <div>\n            <span>活动名字</span>\n            <input type="text" id="name" v-model="name">\n        </div>\n        <!--<div>-->\n            <!--<span>规则提示</span>-->\n            <!--<textarea name="" id="" cols="30" rows="2"></textarea>-->\n        <!--</div>-->\n    </div>\n</div>'});Vue.component("top",topComponent);var groupComponent=Vue.extend({data:function(){return{groups:[{durations:[{products:[{price:"",sku:"",limit:""}]}]}]}},methods:{add:function(){var t=Array.prototype.slice.call(arguments),n=[function(){this.groups.push({durations:[{products:[{price:"",sku:"",limit:""}]}]})},function(){this.groups[arguments[0]].durations.push({products:[{price:"",sku:"",limit:""}]})},function(){this.groups[arguments[0]].durations[arguments[1]].products.push({price:"",sku:"",limit:""})}];n[t.length].apply(this,t)},addSku:function(){return 20===this.pro?(alert("每个时间段最多设置20个sku"),!1):void++this.groups.length},remove:function(){var t=arguments[0],n=arguments[1],e=this,a=["",function(){this.groups.splice(arguments[0],1)},function(){this.groups[arguments[0]].durations.splice(arguments[1],1)},function(){this.groups[arguments[0]].durations[arguments[1]].products.splice(arguments[2],1)}];if(t){var s=["","deleteGroup","deleteDuration","deleteProduct"];$.ajax({url:"/api/internal/sas/seckill/"+s[n.length],dataType:"json",data:{id:t},success:function(t){alert(t.msg),1==t.code&&a[n.length].apply(e,n)},error:function(t){console.log(t)}})}else a[n.length].apply(this,n)},timeInit:function(t,n,e,a){var s=this,o=["YYYY-MM-DD","hh:mm:ss"];$.jeDate(t.target,{insTrigger:!1,format:o[n],choosefun:function(t,n){s.groups[e[0]].date=n},okfun:function(t,n){a?s.groups[e[0]].durations[e[1]][a]=n:s.groups[e[0]].date=n}})}},ready:function(){console.log(this.groups)},template:'<div class="group group-m group-box" v-for="(gIndex,g) in groups">\n    <span class="fa fa-close close"\n          v-show="gIndex!=0"\n          @click="remove(g.id,[gIndex])"\n    ></span>\n    <span class="title name">秒杀组${gIndex+1}</span>\n    <div class="group-s">\n        <div class="border-b">\n            <span class="title title-s">日期</span>\n            <input type="text" class="date" v-model="g.date" @click="timeInit($event,0,[gIndex])">\n            <button class="btn btn-default add-group" type="button" @click="add()">新增秒杀组</button>\n        </div>\n        <div class="group-time durations" v-for="(dIndex,d) in g.durations">\n            <span class="fa fa-close close"\n                  v-show="$index!=0"\n                  @click="remove(d.id,[gIndex,dIndex])"\n            ></span>\n            <div class="time">\n                <span class="title title-s">时间</span>\n                <input type="text" class="from_date start" v-model="d.start" @click="timeInit($event,1,[gIndex,dIndex],\'start\')">\n                －\n                <input type="text" class="to_date end" v-model="d.end" @click="timeInit($event,1,[gIndex,dIndex],\'end\')">\n                <button class="btn btn-default add-time" type="button" @click="add(gIndex)" v-show="dIndex==0">新增时间\n                </button>\n            </div>\n            <div class="tab-box products">\n                <span class="title title-s">sku</span>\n                <table class="table table-bordered table-hover sku-tab">\n                    <thead>\n                    <tr>\n                        <th>sku</th>\n                        <th>秒杀限制</th>\n                        <th>秒杀价</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr v-for="(pIndex,p) in d.products">\n                        <td>\n                            <input type="text" class="sku" v-model="p.sku">\n                        </td>\n                        <td>\n                            <input type="number" class="limit" v-model="p.limit">\n                        </td>\n                        <td>\n                            <input type="number" class="price" v-model="p.price">\n                            <span class="fa fa-close close"\n                                  v-show="$index!=0"\n                                  @click="remove(p.id,[gIndex,dIndex,pIndex])"\n                            ></span>\n                        </td>\n                    </tr>\n                    </tbody>\n                </table>\n                <button class="btn-default btn add-sku" type="button" @click="add(gIndex,dIndex)">+</button>\n            </div>\n        </div>\n    </div>\n</div>\n'});Vue.component("group",groupComponent);var vue=new Vue({el:"html",data:{},methods:{getSearch:function(t){var n=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i"),e=decodeURIComponent(window.location.search).substr(1).match(n);return null!=e?e[2]:null},pageInit:function(){var t=this,n=this.getSearch("id");n&&$.ajax({url:"/api/internal/sas/seckill/view",dataType:"json",data:{id:n},method:"POST",success:function(n){return 1!=n.code?(alert(n.msg),!1):(t.$refs.groups.groups=0===n.data.groups.length?[{durations:[{products:[{price:"",sku:"",limit:""}]}]}]:n.data.groups,t.$refs.top.description=n.data.description,t.$refs.top.name=n.data.name,t.$refs.top.active=n.data.active,void(t.$refs.top.id=n.data.id))}})}},ready:function(){console.log("parent ready")},created:function(){console.log("parent created"),$(document).ajaxStart(function(){$(".ajax-loading-backdrop").show()}).ajaxStop(function(){$(".ajax-loading-backdrop").hide()}),$.ajaxSetup({cache:!1}),this.pageInit()}});