//获取属性列表
var visibleObj = {
    "0": "不可见",
    "1": "可见",
};
//将已填选项存好
var titleList = [];
function getList() {    
    
ajaxReq({
    url: '/sas/attribute/list'
})
.then(function (data) {
    data.data.visibleObj = visibleObj;
    data.data.forEach(function (item) {
        item.dataStringify = JSON.stringify(item);
        item.tagsArr = [];
        item.tags.forEach(function (obj) {
            item.tagsArr.push(obj.tag_title);
        });
        titleList.push(item.title);
    });
    $('.data-container').html(parseTmpl({id: 'user-property-list',data: data}));
});
}

$(function(){
    getList();
})

//移动当前行
var directionCallback = {
    up: function (e) {
        var _this = $(this),
        target = _this.closest('tr'),
        prev = target.prev();
        directionCallback.setIndex(prev.find('[data-role="index"]'),Number(prev.find('[data-role="index"]').text().trim()) + 1);
        directionCallback.setIndex(target.find('[data-role="index"]'),Number(target.find('[data-role="index"]').text().trim()) - 1);
        target.insertBefore(prev);
    },
    down: function (e) {
        var _this = $(this),
        target = _this.closest('tr'),
        next = target.next();
        directionCallback.setIndex(next.find('[data-role="index"]'),Number(next.find('[data-role="index"]').text().trim()) - 1);
        directionCallback.setIndex(target.find('[data-role="index"]'),Number(target.find('[data-role="index"]').text().trim()) + 1);
        target.insertAfter(next);
    },
    setIndex: function (elem,index) {
        var dataElem = elem.closest('tr')
            .find('[name="needUpdate"]').prop('checked',true)
        .end().find('[data-stringify]');

        var data = JSON.parse(dataElem.attr('data-stringify'));
        data.attribute_id = index;
        dataElem.attr('data-stringify',JSON.stringify(data));
        elem.text(index);
    }
}
$(document).on('click','[data-direction]',function (e) {
    directionCallback[this.getAttribute('data-direction')] && directionCallback[this.getAttribute('data-direction')].call(this,e);
});

//模态框中的添加或保存按钮
$('body').on('click','.modal .modal-submit-btn',function(e) {
    $(this).closest('.modal').find('.modal-body').find('form:visible').submit();
});

var modalInfo = {
    'add-property-modal' : {
        //action: '/master/addproduct',
        title: localeI18n.addProperty,
        btnName: localeI18n.add,
        hiddenFunc: function (e) {

        },
        showFunc: function(e){
            var modal = $(this);
            $(this).find('form').validate({
                submitHandler: function(form) {
                    var _this = $(form);
                    titleList = $('.title-text').map(function (i,elem) {
                        return elem.innerHTML.trim();
                    }).toArray();
                    if(titleList.indexOf(form.title.value) > -1 ){
                        alert('属性名重复了');
                        return;
                    }
                    var dataObj = {
                        title: form.title.value,
                        type: form.questionType.value,
                        allow_edit: 1,
                        priority: $('.data-container').find('tr').length + 1,
                        is_visible: modal.find('[name="is_visible"]:checked').length?modal.find('[name="is_visible"]:checked').val():0,
                        tags: JSON.parse(_this.attr('data-tags'))
                    };
                    dataObj.dataStringify = JSON.stringify(dataObj);
                    dataObj.tagsArr = dataObj.tags.map(function (obj) {
                        return obj.tag_title;
                    });
                    var data = {data:[dataObj]};
                    data.data.visibleObj = visibleObj;
                    $(parseTmpl({ id: 'user-property-list',data: data }))
                        .find('[name="needUpdate"]').prop('checked',true)
                    .end().appendTo('.data-container');
                    modal.modal('hide');
                }
            });
        }
    },
    'edit-property-modal' : {
        //action: '/master/addproduct',
        title: localeI18n.editProperty,
        btnName: localeI18n.save,
        hiddenFunc: function (e) {

        },
        showFunc: function(e){
            var modal = $(this);
            var json = JSON.parse(modal.data('target').getAttribute('data-stringify'));

            modal.find('[name="title"]').val(json.title);
            modal.find('[name="questionType"][value="'+ json.type +'"]').prop('checked',true);
            modal.find('[name="is_visible"][value="'+ json.is_visible +'"]').length&&modal.find('[name="is_visible"]').prop('checked',true);
            $(parseTmpl({id:'tag-cell-tmpl',data:{data: json.tags}})).appendTo('.tag-container');

            $(this).find('form').attr('data-tags',JSON.stringify(json.tags)).validate({
                submitHandler: function(form) {
                    var _this = $(form);
                    titleList = $('.title-text').map(function (i,elem) {
                        return elem.innerHTML.trim();
                    }).toArray();
                    if(titleList.indexOf(form.title.value) > -1 && (titleList.indexOf($(modal.data('target')).closest('tr').find('.title-text').text().trim()) !== titleList.indexOf(form.title.value)) ){
                        alert('属性名重复了');
                        return;
                    }
                    var dataObj = {
                        title: form.title.value,
                        type: form.questionType.value,
                        //priority: $('.data-container').find('tr').length + 1,
                        is_visible: modal.find('[name="is_visible"]:checked').length?modal.find('[name="is_visible"]:checked').val():0,
                        tags: JSON.parse(_this.attr('data-tags'))
                    };
                    dataObj = $.extend(json,dataObj);
                    dataObj.dataStringify = JSON.stringify(dataObj);
                    dataObj.tagsArr = dataObj.tags.map(function (obj) {
                        return obj.tag_title;
                    });
                    var data = {data:[dataObj]};
                    data.data.visibleObj = visibleObj;
                    $(modal.data('target')).closest('tr').replaceWith(
                        $(parseTmpl({ id: 'user-property-list',data: data }))
                            .find('[name="needUpdate"]').prop('checked',true)
                        .end()
                    );
                    modal.modal('hide');
                }
            });
        }
    },
};

var zhEnNumber = function () {
    return /^[\u4e00-\u9fa5a-zA-Z0-9、]+$/g;
};
$('body').on('keyup','[data-event="enter"]',function(e){
    var _this = $(this);
    var form = _this.closest('form');
    var tagList = JSON.parse(form.attr('data-tags'));
    var tagListArr = tagList.map(function (item) {
        return item.tag_title;
    });
    if(e.which == '13'){
        if(!zhEnNumber().test(this.value)) {
            alert('只能包含中文英文和数字');
            return;
        }
        if(tagListArr.indexOf(this.value) !== -1){
            alert('标签重复了');
            return;
        }

        tagListArr.push(this.value);
        tagList.push({tag_id: '',tag_title: this.value});
        form.attr('data-tags', JSON.stringify(tagList));
        $(parseTmpl({id:'tag-cell-tmpl',data:{data:[{tag_id: '',tag_title: this.value}]}})).appendTo($(this.getAttribute('data-target')));
        this.value = '';
    }
});

//删除tag
$('body').on('click','.tag-container .fa-close',function(e){
    var _this = $(this);
    var form = _this.closest('form');
    var tagList = JSON.parse(form.attr('data-tags'));
    var tagListArr = tagList.map(function (item) {
        return item.tag_title;
    });
    var obj = JSON.parse(_this.closest('.tag-cell').remove().find('[data-text]').attr('data-text').replace('[','{').replace(']','}'));
    ArrRemoveItem(tagList,obj,'tag_title');
    form.attr('data-tags', JSON.stringify(tagList));
});


//保存更新
$('body').on('click','[data-update]',function(e){
    var checkbox = $('.data-container').find('[name="needUpdate"]:checked');
    var data = [];
    if(checkbox.length){
        var elem = checkbox.closest('tr').find('[data-stringify]');
        elem.each(function (i,item) {
            data.push(JSON.parse(item.getAttribute('data-stringify')));
        });
    } else {
        alert('请至少勾选一项！');
        return;
    }
    if(confirm('保存后将改变原有数据，是否确认更新？')){
        ajaxReq({
            type: 'post',
            url: '/sas/attribute/multiSave',
            data: {data:JSON.stringify(data)}
        })
        .then(function (data) {
            alert('保存成功');
            getList();
        });
    }
});

//优先级
$('body').on('change','[name="priority"]',function(e){
    var data = JSON.parse($(this).closest('tr').find('[data-stringify]').attr('data-stringify'));
    data.priority = this.value;
    $(this).closest('tr').find('[data-stringify]').attr('data-stringify',JSON.stringify(data)).end().find('[name="needUpdate"]').prop('checked',true);
});
    
//删除
$('body').on('click','[data-delete-id]',function(e){
    if(confirm('确定要删除么？')) {
        var id = this.getAttribute('data-delete-id');
        if(id) {
            ajaxReq({
                url: '/sas/attribute/delete',
                data: {attribute_id: Number(id)}
            }).then(function (data) {
                getList();
            });
        } else {
            $(this).closest('tr').remove();
        }
    }
});