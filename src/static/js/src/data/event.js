/**
 * Created by memebox on 17/3/15.
 */
Vue.config.delimiters = ['${', '}'];
vue = new Vue({
    el:'html',
    data:{
        eventList:[],
        showAddEvent: false,
        add:{
            category:1
        }
    },
    methods:{
        initPage: function () {
            var $this=this;
            $.ajax({
                url:"/event/search",
                type: 'post',
                dataType: 'json',
                data : $("form").serialize(),
                success : function(data){
                    if( data.length ){
                        $('#pagination-container').pagination({
                            dataSource: data,
                            pageNumber : 1,
                            pageSize :10,
                            callback : function(sourceData){
                                $this.eventList=sourceData;
                            }
                        })
                    }else{
                        $this.eventList=data;
                    }

                },
                error : function(){
                    $this.eventList=[];
                }
            })
        },
        addEvent: function () {
            this.showAddEvent=true;
            this.add={
                category:1
            };
            console.log(this.showAddEvent);
        },
        saveEvent: function () {
            var $this=this;
            $.ajax({
                url:"/event/addEvent",
                type: 'post',
                dataType: 'json',
                data : $this.add,
                success : function(data){
                    if(data.code!=0){
                        $this.eventList.push($this.add);

                    }else{
                        alert(data.err);
                    }
                    $this.add={
                        category:1
                    }
                },
                error : function(){
                    alert('保存失败')
                }
            })
        },
        deleteEvent: function (v) {
            var $this=this;
            $.ajax({
                url:"/event/removeEvent",
                type: 'post',
                dataType: 'json',
                data : v,
                success : function(data){
                    if(data.code!=0){
                        $this.eventList.$remove(v);
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
