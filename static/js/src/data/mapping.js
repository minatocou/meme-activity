Vue.config.delimiters=["${","}"],vue=new Vue({el:"html",data:{mappingList:[],showAddEvent:!1,add:{},event_name:null,mapping:[],param:{}},methods:{getSearch:function(e,a){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=a?a.substr(1).match(t):decodeURIComponent(window.location.search).substr(1).match(t);return null!=n?n[2]:null},initPage:function(){for(var e=this,a=1;20>=a;a++)e.mapping.push("extra"+a);e.param.event_name=e.getSearch("event_name"),e.getSearch("event_name")?$.ajax({url:"/event/mapping/",type:"post",dataType:"json",data:e.param,success:function(a){a.length?$("#pagination-container").pagination({dataSource:a,pageNumber:1,pageSize:10,callback:function(a){e.mappingList=a}}):e.eventList=a},error:function(){e.mappingList=[]}}):(alert("参数错误，返回上一页"),history.back())},addEvent:function(){this.showAddEvent=!0,this.add={}},saveEvent:function(){console.log(JSON.stringify(this.add)),this.add.event_name=this.getSearch("event_name");var e=this;$.ajax({url:"/event/addMapping",type:"post",dataType:"json",data:e.add,success:function(a){0!=a.code?e.mappingList.push(e.add):alert(a.err),e.add={}},error:function(){alert("保存失败")}})},deleteMapping:function(e){var a=this;$.ajax({url:"/event/removeMapping",type:"post",dataType:"json",data:e,success:function(t){0!=t.code?a.mappingList.$remove(e):alert(t.err)},error:function(){alert("保存失败")}})}},created:function(){this.initPage()}});