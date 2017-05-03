$(document).on('submit','.addNewCouponForm',function(e){
	var _this = $(this);
	if(confirm(localeI18n.beforeSendCouponTip)){
		ajaxReq({
			url: _this.attr('action'),
			type: 'post',
			data: getSubmitData.call(_this.serializeObject())
		})
		.then(function(data){
			alert(data.msg);
			history.back();
		});
	}
	return false;
});
$(document).on('click','[data-form-btn]',function(e){
	$(this.getAttribute('data-form-btn')).submit();
});
$('.need-validate-form').validate();
function getSubmitData() {
	var arr = this.customers.split(',');
	var obj = {};
	arr.forEach(function (value,index) {
		obj[index] = value;
	});
	this.customers = JSON.stringify(obj);
	return this;
}
var importFile = {
	data:{
		file:null
	},
	ele:{
        importUserIdBtn:document.getElementById('importUserIdBtn'),
        uploadExcelFile:document.getElementById('uploadExcelFile'),
        showFileName:document.getElementById('showFileName')
	},
	event:{
		change:function (e,_this) {
            var f = _this.files[0];
            var reg = /\.sheet/;
            if(this.ele.uploadExcelFile.value===''){
            	return;
			}
            this.ele.showFileName.innerText = this.ele.uploadExcelFile.value;
            if(f&&reg.test(f.type)){
                this.ele.importUserIdBtn.style.display = 'block';
                this.data.file = f;
            }else{
                this.ele.importUserIdBtn.style.display = 'none';
                alert('请上传excel文件');
            }
        },
		click:function (e) {
			var _this = this;
			var formData = new FormData();
            formData.append('file',_this.data.file);
            $.ajax({
                url: '/api/coupon/userid',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success:function (data) {
                	if(data.code===1){
                        document.getElementById('userIdBox').value = data.data;
                    }else{
                		alert(data.msg);
					}
                },
                error:function (err) {
					alert(err);
                }
            });
        }
	},
	init:function () {
		var _this = this;
        document.getElementById('uploadExcelFile').onchange = function (e) {
			_this.event.change.call(_this,e,this);
        };
        this.ele.importUserIdBtn.onclick = function (e) {
            _this.event.click.call(_this,e);
        };
    }
};
importFile.init();