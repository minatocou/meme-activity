/**
 * Created by carina on 17/2/16.
 */
var resetForm = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    data = _.extend(defaultSet, data);
    curEL.attr(SETTING, JSON.stringify(data));
}
var binChange = function () {
    var changeVal = function($this){
        if($this.hasClass('removeSpace')){
            var val = $.trim($this.val());
            $this.val(val);
        }
        var parent = $this.closest(attrClass);
        var commonDom =$(parent).find("form.commonConf").eq(0);
        if(commonDom.find('.has_change').val()=='0'){
            commonDom.find('.has_change').val('1');
        }
        var commonConf = $(parent).find("form.commonConf").eq(0).serializeObject();
        var singleConf = $(parent).find(".singleConf form.singleItem");
        var singleLength = $(singleConf).length;
        var singles=[];
        if(singleLength>0){
            for(var i=0;i<singleLength;i++){
                singles.push($(singleConf[i]).serializeObject());
            }
        }
        var data = _.extend(commonConf, {data:singles});
        resetForm(data);
    }
    $(attrClass).on('blur', 'input,select,textarea', function (e) {
        changeVal($(this));
    })
    $(attrClass).on('click', 'input[type=checkbox]', function (e) {
        changeVal($(this));
    })
}

var resetBrandForm = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var defaultSet = JSON.parse(curEL.attr(BRANDSET));
    data = _.extend(defaultSet, data);
    curEL.attr(BRANDSET, JSON.stringify(data));
}
var brandChange = function () {
    $(attrClass).off().on('change', '.brandcate-attr form input, .brandcate-attr select, .brandcate-attr textarea', function (e) {
        if($(this).hasClass('removeSpace')){
            var val = $.trim($(this).val());
            $(this).val(val);
        }
        var parent = $(this).closest(attrClass);
        var commonDom =$(parent).find("form.commonConf").eq(0);
        if(commonDom.find('.has_change').val()=='0'){
            commonDom.find('.has_change').val('1');
        }
        var commonConf = $(parent).find("form.commonConf").eq(0).serializeObject();
        var singleConf = $(parent).find(".singleConf form.singleItem");
        var singleLength = $(singleConf).length;
        var singles=[];
        if(singleLength>0){
            for(var i=0;i<singleLength;i++){
                singles.push($(singleConf[i]).serializeObject());
            }
        }
        var data = _.extend(commonConf, {data:singles});
        resetBrandForm(data);
    })
}

var resetImageTextForm = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    data = _.extend(defaultSet, data);
    curEL.attr(SETTING, JSON.stringify(data));
}
var imageTextChange = function () {
    $(".imagetext-attr").on('change', 'form input', function (e) {
        if($(this).hasClass('removeSpace')){
            var val = $.trim($(this).val());
            $(this).val(val);
        }
        var parent = $(this).closest(".imagetext-attr");
        var commonDom =$(parent).find(".commonConf");
        var changeSta = commonDom.find('.has_change').val();
        var commonConf = {};
        if(changeSta=='0'){
            commonDom.find('.has_change').val('1');
            commonConf.has_change = "1";
        }
        var singleConf = $(parent).find(".singleConf form.singleItem");
        var singleLength = $(singleConf).length;
        if(singleLength>0){
            var imagetextData = $(singleConf).serializeObject();
            var ids = imagetextData.ids;
            delete imagetextData.ids;
            imagetextData.data = {"ids": ids};
        }
        var data = _.extend(commonConf, imagetextData);
        resetImageTextForm(data);
    })
}

var sortableInit= function (vue) {
    $(TEMPLATE_PANEL).sortable({
        group: {
            name: 'template',
            pull: 'clone'
        },
        sort: false,
        fallbackOnBody: true
    })

    $(CANVAS_PANEL).sortable({
        group: {
            name: "canvas",
            put: ['template'],
            draggable: '[data-field]'
        },
        draggable: ".template",
        onUpdate: function () {
            console.log(123)
        },
        
        onAdd: function (evt) {
            var itemEL = $(evt.item);
            var type = $(evt.item).attr('data-field');

            if(type =='favorcom'&&$('#canvas .favorcom').length>1){
                alert("猜你喜欢2组件不能有多个");
                $(evt.item).remove();
                return false;
            }

            if(type =='favor'&&$('#canvas .favor').length>1){
                alert("猜你喜欢组件不能有多个");
                $(evt.item).remove();
                return false;
            }

            if(!type && $(evt.item).attr('imagetext-field')){
                type = $(evt.item).attr('imagetext-field');
            }
            var setting = {
                id: uuid(),
                type: type,
                has_change:'1'
            }
            //console.log(type);
            if (DEFAULT_SETTING[type]) {
                setting = _.extend(setting, DEFAULT_SETTING[type]);
            }
            $(evt.item).attr('id', setting.id).attr(SETTING, JSON.stringify(setting))
        }
    })
    $(CANVAS_PANEL).on('click', '[brand-field]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        $this.addClass('cur').siblings('.cur').removeClass('cur');
        var f = $this.attr('brand-field');
        for(var k in vueRefs){
            if(vue.$refs[vueRefs[k]]){
                var ref = vue.$refs[vueRefs[k]];
                ref.show=false;
            }
        }

        var s = JSON.parse($this.attr(BRANDSET));
        var form=vue.$refs[f+'form'];
        form.setting=s;
        form.show=true;
        brandChange();

    })
    brandChange();

    $(CANVAS_PANEL).on('click', '[imagetext-field]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        $this.addClass('cur').siblings('.cur').removeClass('cur');
        var f = $this.attr('imagetext-field');
        for(var k in vueRefs){
            if(vue.$refs[vueRefs[k]]){
                var ref = vue.$refs[vueRefs[k]];
                ref.show=false;
            }
        }

        var s = JSON.parse($this.attr(SETTING));
        var form=vue.$refs[f+'form'];
        form.setting=s;
        form.show=true;
        imageTextChange();

    })
    imageTextChange();

    $(CANVAS_PANEL).on('click', '[data-field]', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        $this.addClass('cur').siblings('.cur').removeClass('cur');
        var f = $this.attr('data-field');
        for(var k in vueRefs){
            if(vue.$refs[vueRefs[k]]){
                var ref = vue.$refs[vueRefs[k]];
                ref.show=false;
            }
        }

        var s = JSON.parse($this.attr(SETTING));
        var form=vue.$refs[f+'form'];
        form.show=true;
        form.setting=s;
        binChange();
        return ;
    });

    binChange();

    $(CANVAS_PANEL).on('click', '.close-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        /*$(attrClass).hide();*/
        var $parent = $(this).parents('[data-field]');
        var imageTextParent = $(this).parents('[imagetext-field]');
        if($parent.length != 0){
            var f = $parent.attr('data-field');
            var form=vue.$refs[f+'form'];
            form.show=false;
            $(this).closest('li').remove();
        }else if(imageTextParent.length != 0){
            var f = imageTextParent.attr('imagetext-field');
            var form=vue.$refs[f+'form'];
            form.show=false;
            $(this).closest('li').remove();
        }
    })
}