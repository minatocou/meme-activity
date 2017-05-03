/**
 * Created by Jesse on 17/2/27.
 */
var newcomerCoupon = {
    model:$("#ncAdd"),
    btn:$('#newcomercouponAdd'),
    group:$('.newcomercoupon-body .form-group'),
    body:$('.newcomercoupon-body'),

    initEvent: function () {
        var $this=this;
        $this.btn.click(function () {
            var temp=$(__inline('_newcomercoupon.html?__inline'));
            temp.find('.index').html('-No'+$('.newcomercoupon-body').find('.form-group').length);
            $this.body.append(temp);
        })
        $this.body.on('click','.fa-close',function () {
            $(this).parents(".form-group").remove();
            newcomercouponEvent();
        })
    },
    created: function () {
        this.initEvent();
    }
}
$(function(){
    newcomerCoupon.created();
})