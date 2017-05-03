function getList(){ajaxReq({url:"/sas/attribute/list"}).then(function(t){t.data.visibleObj=visibleObj,t.data.forEach(function(t){t.dataStringify=JSON.stringify(t),t.tagsArr=[],t.tags.forEach(function(e){t.tagsArr.push(e.tag_title)}),titleList.push(t.title)}),$(".data-container").html(parseTmpl({id:"user-property-list",data:t}))})}var visibleObj={0:"不可见",1:"可见"},titleList=[];$(function(){getList()});var directionCallback={up:function(){var t=$(this),e=t.closest("tr"),i=e.prev();directionCallback.setIndex(i.find('[data-role="index"]'),Number(i.find('[data-role="index"]').text().trim())+1),directionCallback.setIndex(e.find('[data-role="index"]'),Number(e.find('[data-role="index"]').text().trim())-1),e.insertBefore(i)},down:function(){var t=$(this),e=t.closest("tr"),i=e.next();directionCallback.setIndex(i.find('[data-role="index"]'),Number(i.find('[data-role="index"]').text().trim())-1),directionCallback.setIndex(e.find('[data-role="index"]'),Number(e.find('[data-role="index"]').text().trim())+1),e.insertAfter(i)},setIndex:function(t,e){var i=t.closest("tr").find('[name="needUpdate"]').prop("checked",!0).end().find("[data-stringify]"),a=JSON.parse(i.attr("data-stringify"));a.attribute_id=e,i.attr("data-stringify",JSON.stringify(a)),t.text(e)}};$(document).on("click","[data-direction]",function(t){directionCallback[this.getAttribute("data-direction")]&&directionCallback[this.getAttribute("data-direction")].call(this,t)}),$("body").on("click",".modal .modal-submit-btn",function(){$(this).closest(".modal").find(".modal-body").find("form:visible").submit()});var modalInfo={"add-property-modal":{title:localeI18n.addProperty,btnName:localeI18n.add,hiddenFunc:function(){},showFunc:function(){var t=$(this);$(this).find("form").validate({submitHandler:function(e){var i=$(e);if(titleList=$(".title-text").map(function(t,e){return e.innerHTML.trim()}).toArray(),titleList.indexOf(e.title.value)>-1)return void alert("属性名重复了");var a={title:e.title.value,type:e.questionType.value,allow_edit:1,priority:$(".data-container").find("tr").length+1,is_visible:t.find('[name="is_visible"]:checked').length?t.find('[name="is_visible"]:checked').val():0,tags:JSON.parse(i.attr("data-tags"))};a.dataStringify=JSON.stringify(a),a.tagsArr=a.tags.map(function(t){return t.tag_title});var n={data:[a]};n.data.visibleObj=visibleObj,$(parseTmpl({id:"user-property-list",data:n})).find('[name="needUpdate"]').prop("checked",!0).end().appendTo(".data-container"),t.modal("hide")}})}},"edit-property-modal":{title:localeI18n.editProperty,btnName:localeI18n.save,hiddenFunc:function(){},showFunc:function(){var t=$(this),e=JSON.parse(t.data("target").getAttribute("data-stringify"));t.find('[name="title"]').val(e.title),t.find('[name="questionType"][value="'+e.type+'"]').prop("checked",!0),t.find('[name="is_visible"][value="'+e.is_visible+'"]').length&&t.find('[name="is_visible"]').prop("checked",!0),$(parseTmpl({id:"tag-cell-tmpl",data:{data:e.tags}})).appendTo(".tag-container"),$(this).find("form").attr("data-tags",JSON.stringify(e.tags)).validate({submitHandler:function(i){var a=$(i);if(titleList=$(".title-text").map(function(t,e){return e.innerHTML.trim()}).toArray(),titleList.indexOf(i.title.value)>-1&&titleList.indexOf($(t.data("target")).closest("tr").find(".title-text").text().trim())!==titleList.indexOf(i.title.value))return void alert("属性名重复了");var n={title:i.title.value,type:i.questionType.value,is_visible:t.find('[name="is_visible"]:checked').length?t.find('[name="is_visible"]:checked').val():0,tags:JSON.parse(a.attr("data-tags"))};n=$.extend(e,n),n.dataStringify=JSON.stringify(n),n.tagsArr=n.tags.map(function(t){return t.tag_title});var r={data:[n]};r.data.visibleObj=visibleObj,$(t.data("target")).closest("tr").replaceWith($(parseTmpl({id:"user-property-list",data:r})).find('[name="needUpdate"]').prop("checked",!0).end()),t.modal("hide")}})}}},zhEnNumber=function(){return/^[\u4e00-\u9fa5a-zA-Z0-9、]+$/g};$("body").on("keyup",'[data-event="enter"]',function(t){var e=$(this),i=e.closest("form"),a=JSON.parse(i.attr("data-tags")),n=a.map(function(t){return t.tag_title});if("13"==t.which){if(!zhEnNumber().test(this.value))return void alert("只能包含中文英文和数字");if(-1!==n.indexOf(this.value))return void alert("标签重复了");n.push(this.value),a.push({tag_id:"",tag_title:this.value}),i.attr("data-tags",JSON.stringify(a)),$(parseTmpl({id:"tag-cell-tmpl",data:{data:[{tag_id:"",tag_title:this.value}]}})).appendTo($(this.getAttribute("data-target"))),this.value=""}}),$("body").on("click",".tag-container .fa-close",function(){var t=$(this),e=t.closest("form"),i=JSON.parse(e.attr("data-tags")),a=(i.map(function(t){return t.tag_title}),JSON.parse(t.closest(".tag-cell").remove().find("[data-text]").attr("data-text").replace("[","{").replace("]","}")));ArrRemoveItem(i,a,"tag_title"),e.attr("data-tags",JSON.stringify(i))}),$("body").on("click","[data-update]",function(){var t=$(".data-container").find('[name="needUpdate"]:checked'),e=[];if(!t.length)return void alert("请至少勾选一项！");var i=t.closest("tr").find("[data-stringify]");i.each(function(t,i){e.push(JSON.parse(i.getAttribute("data-stringify")))}),confirm("保存后将改变原有数据，是否确认更新？")&&ajaxReq({type:"post",url:"/sas/attribute/multiSave",data:{data:JSON.stringify(e)}}).then(function(){alert("保存成功"),getList()})}),$("body").on("change",'[name="priority"]',function(){var t=JSON.parse($(this).closest("tr").find("[data-stringify]").attr("data-stringify"));t.priority=this.value,$(this).closest("tr").find("[data-stringify]").attr("data-stringify",JSON.stringify(t)).end().find('[name="needUpdate"]').prop("checked",!0)}),$("body").on("click","[data-delete-id]",function(){if(confirm("确定要删除么？")){var t=this.getAttribute("data-delete-id");t?ajaxReq({url:"/sas/attribute/delete",data:{attribute_id:Number(t)}}).then(function(){getList()}):$(this).closest("tr").remove()}});