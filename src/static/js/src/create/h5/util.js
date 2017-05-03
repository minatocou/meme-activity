/**
 * Created by memebox on 16/11/4.
 */
function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
var httpJson = function (url, data, sccuess) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        xhrFields: {withCredentials: true},
        type: 'GET',
        success: sccuess,
        error: function () {
            alert('time out')
        }
    })
}
function isRepeat(arr){
    var hash = {};
    for(var i=0 ; i < arr.length ; i++) {
        if(hash[arr[i]])
            return true;
        hash[arr[i]] = true;
    }
    return false;
}