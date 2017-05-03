//将已填选项存好
var titleList = [];
var situation = {
    1 : '首页',
    2 : '商品详情页',
    3 : '订单列表页',
    4 : '评论列表页'
};
function getList(method) {    
    
ajaxReq({
    url: '/sas/survey/list'
})
.then(function (data) {
    showList(data.data,method);
});
}

function getAllList() {
    $('.data-container').html('');
   try {
       showList(JSON.parse(localStorage.cacheQuestion));
   } catch(e) {
   }
   getList('append'); 
}

function showList(data,method) {
    data.situation = situation;
    data.forEach(function (item) {
        item.dataStringify = JSON.stringify(item);
    });
    var elem = $(parseTmpl({id: 'question-list',data: {data:data}}));
    $('.data-container')[method || 'html'](elem);
    setTimeout(function () {
        initDatePicker(elem.find('.input-daterange input'));
    });
} 

$(function(){
    getAllList();
    setTimeout(function () {
        window.editPanelCache = $('.modify-questions-block').clone().wrap('<div>').parent().html();
    });
});

//保存更新
$('body').on('click','[data-update]',function(e){
    var targetTr = $(this).closest('tr').prev();
    var bonusElem = targetTr.find('[data-bonus]:checked');
    if(bonusElem.length && !$('[name="'+ bonusElem.val() +'"]').val().length) {
        alert('选择奖励之后，必须填写优惠券的ID或者蜜豆数量！');
        targetTr.find('[name="'+ bonusElem.val() +'"]').focus();
        return;
    }
    var checkbox = targetTr.find('[name="needUpdate"]:checked');
    var data = [];
    if(checkbox.length){
        // var elem = checkbox.closest('tr');
        targetTr.each(function (i,item) {
            var json = JSON.parse(item.getAttribute('data-stringify'));
            delete json.rule_id;
            delete json.point_amount;
            json = $.extend(json,$(item).find('input').serializeObject());
            data.push(json);
        });
    } else {
        alert('请至少勾选一项！');
        return;
    }
    if(confirm('保存后问卷将投放给用户，更新的内容可能会影响用户答题和已有问卷的结果统计，是否确认保存？')){

    }
    else {
        return;
    }
    ajaxReq({
        type: 'post',
        url: '/sas/survey/multiSave',
        data: {data:JSON.stringify(data)}
    })
    .then(function (data) {
        alert('保存成功');
        localStorage.removeItem('cacheQuestion');
        getAllList();
    });
});

//删除
$('body').on('click','[data-delete-id]',function(e){
    var _this = $(this);
    if(_this.hasClass('disabled')){
        tipsShow('问卷开放时不可删除');
        return;
    }
    if(confirm('确定要删除么？')) {
        var id = this.getAttribute('data-delete-id');
        if(id) {
            ajaxReq({
                url: '/sas/survey/delete',
                data: {survey_id: Number(id)}
            }).then(function (data) {
                alert('删除成功');
                getAllList();
            });
        } else {
            var tr = $(this).closest('tr');
            tr.add(tr.next('tr')).remove();
        }
    }
});

//优先级
$('body').on('change','[name="priority"]',function () {
    if(!/^\d+$/.test(this.value-0)){
        alert('只能输入不小于0的数字！');
        this.value = 0;
        this.focus();
    }
});

//修改开放关闭
$('body').on('click','[name="is_active"]',function(e){
    var id = this.getAttribute('data-id');
    var _this = $(this);
    ajaxReq({
        url: '/sas/survey/setStatus',
        data: {survey_id: Number(id),is_active: this.value},
        resetCallback: function () {
            _this.closest('form').find('[name="is_active"][value="0"]')[0].checked = true;
        }
    }).then(function (data) {
        getAllList();
    });
});

//拿到问卷详情
$('body').on('change','[name="needUpdate"]',getQuestionDetail);
function getQuestionDetail(e) {
    var _this = $(this);
    var json = JSON.parse(_this.closest('tr').attr('data-stringify'));
    var flag = json.questions || json.url;
    if(this.value && !flag && this.checked){
        return ajaxReq({
            url: '/sas/survey/detail',
            data: {survey_id: this.value}
        }).then(function (data) {
            _this.closest('tr').attr({
                'data-stringify': JSON.stringify(data.data),
            }).next('tr').find('[data-update]').prop('disabled',false);
        });
    }
    _this.closest('tr').next('tr').find('[data-update]').prop('disabled',false);
    return $.Deferred().resolve();
}

//修改设置
$('body').on('click','.modify-config',function (e) {
    var _this = $(this);
    if(_this.hasClass('disabled')){
        tipsShow('问卷开放时不可修改设置');
        return;
    }

    var target = _this.closest('tr').find('[name="needUpdate"]').prop('checked',true).change().end().find('.editable');
    target.removeClass('save-edit').find('[data-bonus]:checked').change();
    _this.closest('tr').next('tr').find('[name="is_active"]').prop('disabled',true);
});

//打开编辑问题面板 
$('body').on('click','.edit-questions',function (e) {
    var _this = $(this);

    var tr = _this.closest('tr');

    var endTime = tr.find('[name="active_to"]').val();
    if(_this.hasClass('disabled')){
        if(endTime && (new Date(endTime) < new Date())) {
            tipsShow('问卷已结束，请切换到关闭状态再进行编辑！');
            return;
        }
        tipsShow('问卷处于分发时段时不可编辑问题');
        return;
    }

    // if(endTime && (new Date(endTime) < new Date())) {
    if(confirm('问卷已结束，您的操作将会影响问卷收集的数据，请谨慎编辑题目选项！必要时可通过增减题目避免数据混乱！确定要继续编辑吗？')){

    } else {
        return;
    }
    // }

    var updateCheckbox = tr.find('[name="needUpdate"]').prop('checked',true)[0];
    getQuestionDetail.call(updateCheckbox)
    .then(function () {
        var data = JSON.parse(tr.attr('data-stringify'));

        if(data.url){
            $('[name="questionFrom"]').closest('[data-toggle="tab"]').addClass('hide').end().filter('[value="link"]').click().closest('[data-toggle="tab"]').removeClass('hide');
            $('[type="url"][name="url"]').val(data.url);
            return ;
        }
        $('[name="questionFrom"]').filter('[value="link"]').closest('[data-toggle="tab"]').addClass('hide');
        $('[name="questionSummaryTitle"]').val(data.title).keyup();
        $('[name="questionSummaryIntro"]').val(data.description).keyup();
        createQuestionPreviewItem(data.questions);
    }).then(function () {
        $('.modify-questions-block').data('tr',tr).addClass('active');
    });
});

//保存问卷编辑 
$('body').on('click','[data-update-question]',function (e) {
    var tr = $('.modify-questions-block').data('tr');

    //url验证不通过则返回
    var dataLink = validateUrl('save');
    if(!dataLink) {
        return;
    }
    var data = '';
    if(!$.isPlainObject(dataLink)){
        data = [getQuestionnaireDataAndValidate.call(this)];
        if(!data[0]) {
            return;
        }
    } else {
        data = [dataLink];
    }
    if(confirm('您的操作将会影响问卷收集的数据，确认要保存么？')){
        data = [$.extend(JSON.parse(tr.attr('data-stringify')),data[0])];
        data.situation = situation;
        data.forEach(function (item) {
            item.dataStringify = JSON.stringify(item);
        });
        var trReplace = $(parseTmpl({id: 'question-list',data: {data:data}})).find('[name="needUpdate"]').prop('checked',true).end();
        initDatePicker(trReplace.find('.input-daterange input'));
        tr.next('tr').remove().end().replaceWith(trReplace.find('[data-update]').prop('disabled',false).end());
        // alert('您的操作将会影响问卷收集的数据，确认要保存么？');
        closeEditPanel();
    }
});
function closeEditPanel() {
    $('.modify-questions-block').removeClass('active');
    setTimeout(function () {
        $('.modify-questions-block').replaceWith(window.editPanelCache);
    },400);
}
//关闭编辑 
$('body').on('click','.close-panel',function (e) {
    closeEditPanel();
});

//编辑单个问题
$('body').on('click','[data-edit-question-item]',function (e) {
    var _this = $(this);
    $('[data-role="saveEditQuestion"]').data('li',_this.closest('li'));
    $('[data-role="saveEditQuestion"]').show();
    var questionData = JSON.parse(_this.closest('li').attr('data-stringify'));
    $('[name="is_required"]').prop('checked',false).filter('[value="'+ questionData.is_required +'"]').prop('checked',true);
    if(questionData.attribute_id && questionData.attribute_id != '0') {
        $('.related-or-not')[0].checked = true;
        getRelatedDataAndShowList(fillInputs,questionData);
    } else {
        $('.related-or-not')[0].checked = false;
        $('[data-tmpl-id]').prop('disabled',true);
        setTimeout(function () {
            $('[data-tmpl-id][value="'+ questionData.type +'"]').prop('disabled',false).click();
            $('[name="questionTitle"]').val(questionData.title);
        });
        if(questionData.type == '3'){

        } else {
            setTimeout(function(){
                createItem({tags: questionData.options});
            });
        }
    }
});
function fillInputs(data) {
    setTimeout(function () {
        $('[name="questionTitle"]').val(data.title);
        var inputs = $('.option-container input');
        data.options.forEach(function (item) {
            inputs.filter('[data-tag-id = "'+item.tag_id+'"]').val(item.value).attr('data-option-id',item.option_id);
        });
    });
}
//保存问题编辑
$('body').on('click','[data-role="saveEditQuestion"]',function () {
    var data = validateAndGetQuestionData.call(this);
    if(!data){
        return;
    }
    var _this = $(this).hide();
    var li = $('[data-role="saveEditQuestion"]').data('li');
    data.question_id = JSON.parse(li.attr('data-stringify')).question_id;
    createQuestionPreviewItem(data,function (arr) {
        li.replaceWith(parseTmpl({id:'question-preview-tmpl',data:{data:arr}}));
    });
});

var pageUrl = '/special/questionnaire/index.html';
var previewHost = {
    'localhost': 'http://m.cn.memebox.com/m',
    'qapc.cn.memebox.com': 'http://qapc.cn.m.memebox.com/m',
    'qaappsasadmin.cn.memebox.com': 'http://qaapp.cn.m.memebox.com/m',
    'preprod.cn.memebox.com': 'http://preprod.cn.m.memebox.com/m',
    'preprodsasadmin.cn.memebox.com': 'http://preprod.cn.m.memebox.com/m',
    other: 'http://m.cn.memebox.com/m'
};
//预览问卷
$('body').on('click','[data-preview-questionnaire]',function () {
    var _this = $(this);

    var tr = _this.closest('tr');
    var updateCheckbox = tr.find('[name="needUpdate"]').prop('checked',true)[0];
    getQuestionDetail.call(updateCheckbox)
    .then(function () {
        var data = JSON.parse(tr.attr('data-stringify'));
        var url = '';
        url = data.url || ((previewHost[location.hostname] || previewHost.other) + pageUrl + '?' + $.param({preview:true}) + '#' + encodeURIComponent(_this.closest('tr').attr('data-stringify')));
        var dom = new previewIframe({id: _this.attr('data-preview-questionnaire'),data: {}}).show(function(){
            var ifm = this.dom.find('iframe')[0];
            ifm.src = url;
        });
    });
});
function previewIframe(option) {
    this.dom = $(parseTmpl(option));
    this.show = function (callback) {
        this.bindEvent();
        $('body').append(this.dom);
        callback.call(this);
        return this;
    };
    this.destory = function () {
        this.dom.off().remove();
        return this;
    };
    this.bindEvent = function () {
        var _this = this;
        this.dom.on('click','[data-destory]',function (e) {
            _this.destory();
        });
    }
}

//勾选奖励
$('body').on('change','[data-bonus]',function (e) {
    var _this = $(this);
    if(this.checked){
        _this.closest('td').find('[data-bonus]').not(this).prop('checked',false);
        _this.closest('td').find(this.getAttribute('data-bonus')).prop('readonly',false).attr('placeholder',this.getAttribute('data-placeholder')).attr('name',this.value).focus();
    } else {
        _this.closest('td').find(this.getAttribute('data-bonus')).prop('readonly',true).attr('placeholder','').attr('name','').val('');
    }
}).on('click','[data-bonus]',function (e) {
    e.preventDefault();
    var _this = this;
    setTimeout(function () {
        _this.checked = !_this.checked;
        $(_this).change();
    });
});
//蜜豆数量或优惠券ID
$('body').on('change','.bonus-detail',function () {
    var _this = this;
    if(!/^\+?[1-9]\d*$/.test(this.value-0)){
        alert('只能输入大于0的数字！');
        this.value = '';
        setTimeout(function () {
            _this.focus();
        });
    }
});