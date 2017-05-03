/**
 * Created by Jesse on 16/12/8.
 */
(function () {
    var markList = new MarketList('/code/list');
    markList.getList();
    $('#search').click(function () {
        var obj ={};
        if(checkTime()){
            $('#id').val().trim()&&(obj.id=$('#id').val().trim());
            $('#name').val().trim()&&(obj.name=$('#name').val().trim());
            if($('input[name=selectTime]:checked').val()=='0'){
                $('#from_date').val().trim()&&(obj.from_date_start=$('#from_date').val().trim());
                $('#from_date').val().trim()&&(obj.from_date_end=$('#to_date').val().trim());
            }else{
                $('#from_date').val().trim()&&(obj.to_date_start=$('#from_date').val().trim());
                $('#from_date').val().trim()&&(obj.to_date_end=$('#to_date').val().trim());
            }
            $('#is_public').val()!=''&&(obj.is_public=$('#is_public').val());
            $('#status').val()!=''&&(obj.status=$('#status').val());
            markList.getList(obj);
        }
    });
    /**
     * 删除
     */
    MarketDelete('/code/delete');
    /**
     * 时间
     */
    dateTimePickerInit(true);
    /**
     * 修改状态
     */
    changeStatus('/code/update');
    /**
     * 获取私码列表
     */
    function getPrivateCodeList(id,page,size,callback) {
        $.ajax({
            url:CONFIG.dev.domain+'/code/detail',
            data:{
                rule_id:id,
                page:page,
                size:size
            },
            dataType:'json',
            type:'POST',
            success:function (data) {
                var privateCodeListTpl = Handlebars.compile($('#privateCodeListTpl').html());
                $('#privateCodeList').html(privateCodeListTpl(data.data));
                // callback&&callback();
            },
            error:function (err) {
                console.log(err);
            }
        })
    }
    $('#list').on('click','.getPrivateCode',function () {
        var rule_id = $(this).data('id'),
            size = 50000;
        getPrivateCodeList(rule_id,1,size,function () {
            $('#privateListPaginationContainer').pagination({
                dataSource: new Array(20),
                pageSize: size,
                showGoInput: true,
                showGoButton: true,
                // pageNumber: page,
                afterPageOnClick: function (e, index) {
                    getPrivateCodeList(rule_id,index,size);
                },
                afterPreviousOnClick: function (e, index) {
                    getPrivateCodeList(rule_id,index,size);
                },
                afterNextOnClick: function (e, index) {
                    getPrivateCodeList(rule_id,index,size);
                },
                afterGoButtonOnClick: function (e, index) {
                    var i = index.trim();
                    (i != '') && getPrivateCodeList(rule_id,index,size);
                },
                callback: function (data, pagination) {
                }
            });
        });
    })
})();