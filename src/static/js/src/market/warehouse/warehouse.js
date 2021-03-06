(function () {
    var markList = new MarketList('/promotion/list');
    markList.getList();

    $('#search').click(function () {
        var obj = {};
        if (checkTime()) {
            $('#id').val().trim() && (obj.id = $('#id').val().trim());
            $('#name').val().trim() && (obj.name = $('#name').val().trim());
            if ($('input[name=selectTime]:checked').val() == '0') {
                $('#from_date').val().trim() && (obj.from_date_start = $('#from_date').val().trim());
                $('#from_date').val().trim() && (obj.from_date_end = $('#to_date').val().trim());
            } else {
                $('#from_date').val().trim() && (obj.to_date_start = $('#from_date').val().trim());
                $('#from_date').val().trim() && (obj.to_date_end = $('#to_date').val().trim());
            }
            $('#warehouse').val() != '' && (obj.warehouse = $('#warehouse').val());
            $('#status').val() != '' && (obj.status = $('#status').val());
            markList.getList(obj);
        }
    });

    /**
     * 删除
     */
    MarketDelete('/promotion/delete');
    /**
     * 时间
     */
    dateTimePickerInit(true);
    /**
     * 修改状态
     */
    changeStatus('/promotion/update');
})();