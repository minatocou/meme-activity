/**
 * Created by Jesse on 17/3/14.
 */
var topComponent = Vue.extend({
    props: ["topData"],
    data: function () {
        return {
            id: "",
            active: 1,
            name: "",
            description: "无用字段"
        }
    },
    methods: {
        save: function () {
            var $this = this,
                flag = true,
                obj = {
                    name: $this.name,
                    active: $this.active,
                    description: $this.description,
                    groups: JSON.stringify($this.$parent.$refs.groups.groups)
                };
            $this.id && (obj.id = $this.id);
            console.log($this.$parent.$refs.groups.groups);
            var inputs = document.getElementsByTagName("input");
            Array.prototype.some.call(inputs,function (ele) {
                return ele.value.trim()===""&&(flag = false);
            });
            if(flag){
                $.ajax({
                    url: "/api/internal/sas/seckill/save",
                    data:obj,
                    dataType: "json",
                    method: "POST",
                    success: function (data) {
                        alert(data.msg);
                        if (data.code == 1) {
                            location.href="/market/flash/list";
                        } else {
                            if (data.data && data.data.id) {
                                if(obj.id){
                                    location.reload();
                                }else{
                                    location.href += "?id=" + data.data.id;
                                }
                            }
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }else{
                alert("输入框不能为空");
            }
        }
    },
    template: __inline("./_top.html?__inline"),
    // methods: {}
});
Vue.component("top", topComponent);
var groupComponent = Vue.extend({
    // props:["groupData"],
    data: function () {
        return {
            groups: [
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
            ],
        }
    },
    methods: {
        add: function () {
            var ary = Array.prototype.slice.call(arguments);
            var funObj = [
                function () {
                    this.groups.push({
                        durations: [
                            {
                                products: [{
                                    price: "",
                                    sku: "",
                                    limit: ""
                                }]
                            }
                        ]
                    });
                },
                function () {
                    this.groups[arguments[0]].durations.push({
                        products: [{
                            price: "",
                            sku: "",
                            limit: ""
                        }]
                    });
                },
                function () {
                    this.groups[arguments[0]].durations[arguments[1]].products.push({
                        price: "",
                        sku: "",
                        limit: ""
                    });
                }
            ];
            funObj[ary.length].apply(this, ary);
        },
        addSku: function () {
            if (this.pro === 20) {
                alert("每个时间段最多设置20个sku");
                return false;
            }
            ++this.groups.length;
        },
        remove: function () {
            var id = arguments[0],
                ary = arguments[1],
                $this = this;
            var funObj = [
                "",
                function () {
                    this.groups.splice(arguments[0], 1);
                },
                function () {
                    this.groups[arguments[0]].durations.splice(arguments[1], 1);
                },
                function () {
                    this.groups[arguments[0]].durations[arguments[1]].products.splice(arguments[2], 1);
                }
            ];
            if (id) {
                var arr = ["", "deleteGroup", "deleteDuration", "deleteProduct"];
                $.ajax({
                    url: "/api/internal/sas/seckill/" + arr[ary.length],
                    dataType: "json",
                    data: {
                        id: id,
                    },
                    success: function (data) {
                        alert(data.msg);
                        if (data.code == 1) {
                            funObj[ary.length].apply($this, ary);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                funObj[ary.length].apply(this, ary);
            }

        },
        timeInit: function (e, index, arr, flag) {
            var $this = this,
                ary = [
                    "YYYY-MM-DD",
                    "hh:mm:ss",
                ];
            $.jeDate(e.target, {
                insTrigger: false,
                format: ary[index],
                choosefun: function (elem, val) {
                    $this.groups[arr[0]].date = val;
                },
                okfun: function (elem, val) {
                    if (flag) {
                        $this.groups[arr[0]].durations[arr[1]][flag] = val;
                    } else {
                        $this.groups[arr[0]].date = val;
                    }
                }
            });
        }
    },
    ready: function () {
        console.log(this.groups)
    },
    template: __inline("./_group.html?__inline"),
});
Vue.component("group", groupComponent);
