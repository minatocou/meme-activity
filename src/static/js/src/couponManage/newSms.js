/**
 * Created by Jesse on 17/2/13.
 */
$(document).on('submit', '.addNewCouponForm', function (e) {
    var _this = $(this);
    if (confirm("短信发送不能撤回，确定发送吗？")) {
        var options = {
            url:  "/api/internal/sas/sms/send",
            type: 'post',
            data: getSubmitData.call(_this.serializeObject()),
            dataType: "json",
            success: function (data) {
                alert(data.msg);
                if(data.code==1) {
                    history.back();
                }
            }
        };
        options.data.user = $('.user-name').data('name');
        $.ajax(options);
    }
    return false;
});
$(document).on('click', '[data-form-btn]', function (e) {
    $(this.getAttribute('data-form-btn')).submit();
});
$('.need-validate-form').validate();
function getSubmitData() {
    return this;
}
var importFile = {
    data: {
        file: null
    },
    ele: {
        importUserIdBtn: document.getElementById('importUserIdBtn'),
        uploadExcelFile: document.getElementById('uploadExcelFile'),
        showFileName: document.getElementById('showFileName')
    },
    event: {
        change: function (e, _this) {
            var f = _this.files[0];
            var reg = /\.sheet/;
            if (this.ele.uploadExcelFile.value === '') {
                return;
            }
            this.ele.showFileName.innerText = this.ele.uploadExcelFile.value;
            if (f && reg.test(f.type)) {
                this.ele.importUserIdBtn.style.display = 'block';
                this.data.file = f;
            } else {
                this.ele.importUserIdBtn.style.display = 'none';
                alert('请上传excel文件');
            }
        },
        click: function (e) {
            var _this = this;
            var formData = new FormData();
            formData.append('file', _this.data.file);
            $.ajax({
                url: '/api/coupon/userid?flag=sms',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.code === 1) {
                        document.getElementById('userIdBox').value = data.data;
                    } else {
                        alert(data.msg);
                    }
                },
                error: function (err) {
                    alert(err);
                }
            });
        }
    },
    init: function () {
        var _this = this;
        document.getElementById('uploadExcelFile').onchange = function (e) {
            _this.event.change.call(_this, e, this);
        };
        this.ele.importUserIdBtn.onclick = function (e) {
            _this.event.click.call(_this, e);
        };
    }
};
importFile.init();