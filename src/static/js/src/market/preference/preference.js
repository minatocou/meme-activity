$('#search').click(function () {
    console.log(searchContent());
});
$('#pagination-container').pagination({
    dataSource: [1,2,3,4],
    pageSize: 5,
    callback: function (data, pagination) {
        console.log(data,pagination);
        // var html = userCpl(data);
        // $("#user-content").html(html);
    }
})