/**
 * Created by memebox on 17/3/15.
 */
Vue.config.delimiters = ['${', '}'];
vue = new Vue({
    el:'html',
    data:{
        mappingList:[],
        showAddEvent: false,
        add:{
        },
        event_name:null,
        mapping:[],
        param:{}
    },
    methods:{
        getSearch: function(name, search) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = search ? search.substr(1).match(reg) : decodeURIComponent(window.location.search).substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        initPage: function () {
            var $this=this;
            for(var i=1;i<=20;i++){
                $this.mapping.push('extra'+i);
            }
            $this.param.event_name=$this.getSearch('event_name');
            if(!$this.getSearch('event_name')){
                alert('参数错误，返回上一页');
                history.back();
            }else{
                $.ajax({
                    url:"/event/mapping/",
                    type: 'post',
                    dataType: 'json',
                    data : $this.param,
                    success : function(data){
                        if( data.length ){
                            $('#pagination-container').pagination({
                                dataSource: data,
                                pageNumber : 1,
                                pageSize :10,
                                callback : function(sourceData){
                                    $this.mappingList=sourceData;
                                }
                            })
                        }else{
                            $this.eventList=data;
                        }
                    },
                    error : function(){
                        $this.mappingList=[];
                    }
                })
            }

        },
        addEvent: function () {
            this.showAddEvent=true;
            this.add={
            };
        },
        saveEvent: function () {
            console.log(JSON.stringify(this.add))
            this.add.event_name=this.getSearch('event_name');
            var $this=this;
            $.ajax({
                url:"/event/addMapping",
                type: 'post',
                dataType: 'json',
                data : $this.add,
                success : function(data){
                    if(data.code!=0){
                        $this.mappingList.push($this.add);

                    }else{
                        alert(data.err);
                    }
                    $this.add={}
                },
                error : function(){
                    alert('保存失败')
                }
            })
        },
        deleteMapping: function (v) {
            var $this=this;
            $.ajax({
                url:"/event/removeMapping",
                type: 'post',
                dataType: 'json',
                data : v,
                success : function(data){
                    if(data.code!=0){
                        $this.mappingList.$remove(v);
                    }else{
                        alert(data.err);
                    }
                },
                error : function(){
                    alert('保存失败')
                }
            })
        }
    },
    created: function () {
        this.initPage()
    }
})
