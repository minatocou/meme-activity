/**
 * Created by Jesse on 17/3/1.
 */
Vue.config.delimiters = ['${', '}'];
__inline("./template.js?__inline");
var vue = new Vue({
    el: "html",
    data: {},
    methods: {
        getSearch: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var ary = decodeURIComponent(window.location.search).substr(1).match(reg);
            if (ary != null) return ary[2];
            return null;
        },
        pageInit: function () {
            var $this = this,
                id = this.getSearch("id");
            if (id) {
                $.ajax({
                    url: "/api/internal/sas/seckill/view",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    method: "POST",
                    success: function (data) {
                        if (data.code != 1) {
                            alert(data.msg);
                            return false;
                        }
                        if (data.data.groups.length === 0) {
                            $this.$refs.groups.groups = [
                                {
                                    durations: [
                                        {
                                            products: [{
                                                price: "",
                                                sku: "",
                                                limit: ""
                                            }]
                                        }
                                    ]
                                }
                            ];
                        } else {
                            $this.$refs.groups.groups = data.data.groups;
                        }
                        $this.$refs.top.description = data.data.description;
                        $this.$refs.top.name = data.data.name;
                        $this.$refs.top.active = data.data.active;
                        $this.$refs.top.id = data.data.id;
                    }
                })
            }
        },
        // saveBtn: function () {
        //     var ary = [];
        //     $(".group-box").each(function (index, ele) {
        //         ary[index] = {
        //             name: $(ele).find(".name").text(),
        //             data: $(ele).find(".data").text(),
        //             durations: []
        //         };
        //         $(ele).find(".durations").each(function (i, ele) {
        //             ary[index].durations[i] = {
        //                 start: $(ele).find(".start").val(),
        //                 end: $(ele).find(".end").val(),
        //                 products: []
        //             };
        //             $(ele).find(".products").each(function (_index, ele) {
        //                 $(ele).find(".sku").each(function (_i, ele) {
        //                     ary[index].durations[i].products[_i] = {
        //                         sku: $(ele).val()
        //                     }
        //                 });
        //                 $(ele).find(".limit").each(function (_i, ele) {
        //                     ary[index].durations[i].products[_i].limit = $(ele).val();
        //                 });
        //                 $(ele).find(".price").each(function (_i, ele) {
        //                     ary[index].durations[i].products[_i].price = $(ele).val();
        //                 });
        //             })
        //         })
        //     });
        //     $.ajax({
        //         url: "/api/internal/sas/seckill/save",
        //         dataType: "json",
        //         data: {
        //             active: $("#active").val(),
        //             description: $("textarea").val(),
        //             groups: JSON.stringify(ary),
        //             name: $("#name").val(),
        //             id: ""
        //         },
        //         method: "POST",
        //         success: function (data) {
        //             console.log(data);
        //         }
        //     });
        //     console.log(ary);
        // }
    },
    ready: function () {
        console.log("parent ready");
    },
    created: function () {
        console.log("parent created");
        $(document).ajaxStart(function () {
            $('.ajax-loading-backdrop').show();
        }).ajaxStop(function () {
            $('.ajax-loading-backdrop').hide();
        });
        $.ajaxSetup({cache: false});
        this.pageInit();
        //ajax过渡

    }
});
