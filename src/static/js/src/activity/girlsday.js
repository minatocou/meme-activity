
Vue.config.delimiters = ['${', '}']
Vue.config.unsafeDelimiters = ['{!!', '!!}']
var vue = new Vue({
    el: 'html',
    data: {
        list: null,
        clicked: 1,
    },
    methods: {
        getProductSetting: function() {
            var $this = this;
            $.ajax({
                url: '/api/activitygirlsday/list',
                type: 'get',
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    $this.list = data.data;
                }
            })
        },
        saveProductSetting: function(index) {
            var $this = this;
            $this.clicked = 0;
            var product = $this.list[index];
            var sameProduct = 0;
            for(var i=0;i<$this.list.length;i++){
                if(i == index){
                    continue;
                }
                if(product.productId == $this.list[i].productId){
                    alert('存在重复商品，请修正~');
                    sameProduct = 1;
                    break;
                }
            }
            if(!sameProduct){
                if(product.productId){
                    $.ajax({
                        url: '/api/activitygirlsday/save',
                        type: 'post',
                        dataType: 'json',
                        data: {product: JSON.stringify(product)},
                        success: function(data) {
                            alert(data.msg);
                            $this.clicked = 1;
                            location.reload();
                        }
                    })
                }else{
                    alert('请填写商品编号');
                    $this.clicked = 1;
                }
            }
        },
        sth: function() {

        },
        delProductSetting: function(index) {
            var $this = this;
            var product = $this.list[index];
            if(product && product.productId){
                console.log(product);
                if(confirm('确认删除该商品吗？')){
                    $.ajax({
                        url: '/api/activitygirlsday/del',
                        type: 'post',
                        dataType: 'json',
                        data: {product: JSON.stringify(product)},
                        success: function(data) {
                            console.log(data);
                            alert(data.msg);
                            location.reload();
                        }
                    })
                }
            }
            else{
                $this.list.pop($this.list[index]);
            }
        },
        addProduct: function() {
            var $this = this;
            var temp = {
                productId: "",
                link: "",
                name: "",
                desc: "",
                id: ""
            }
            $this.list.push(temp);
        }
    },
    created: function() {
        var $this = this;
        $this.getProductSetting();
    }
})
