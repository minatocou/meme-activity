/*
 * @Author: Derek
 * @Date:   2017-04-11 22:56:55
 * @Last Modified by:   Derek
 * @Last Modified time: 2017-04-13 17:23:56
 */

Vue.config.delimiters = ['${', '}'];
Vue.config.unsafeDelimiters = ['{!!', '!!}']

var options = {
    title: {
        text: '数据 + 时间坐标轴'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },
    series: [{
        name: '数量',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
    }]
};


vue = new Vue({
    el: 'html',
    data: {
        dateFrom: '',
        dateTo: '',
        client_version: [],
        clientversions: [],
        platform: [],
        channel: '',
        event_name: '',
        associate: [],
        property: [],
        allpros: [],
        reports: [],
        loading: false,
    },
    methods: {
        eventAssociate: function() {
            var that = this;
            $.ajax({
                url: '/eventSearch/associate',
                type: 'post',
                dataType: 'json',
                data: { 'snap': that.event_name },
                success: function(data) {
                    console.log(data.data);
                    that.associate = data.data;
                }
            })
        },
        choseE: function(event) {
            this.event_name = event.event_name;
            this.associate = [];
            this.property = [];
            this.getProperty();
        },
        addpro: function() {
            var that = this;
            if (!this.event_name) {
                alert('请输入事件名');
            } else {
                var tmp = {
                    preproty: {},
                    opt: '',
                    val: ''
                }
                that.property.push(tmp);
                that.getProperty();
            }
        },
        removepro: function(i) {
            this.property.splice(i, 1);
        },
        getProperty: function() {
            var that = this;
            $.ajax({
                url: '/eventSearch/getProperty',
                type: 'post',
                dataType: 'json',
                data: { 'event_name': that.event_name },
                success: function(data) {
                    that.allpros = data.data;
                }
            })
        },
        getClient: function() {
            var that = this;
            $.ajax({
                url: '/eventSearch/getClient',
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    that.clientversions = data.data;
                }
            })
        },
        gosearch: function() {
            var that = this;
            var params = {
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                client_version: this.client_version.join("','"),
                channel: this.channel,
                platform: this.platform.join("','"),
                event_name: this.event_name,
                property: JSON.stringify(this.property),
            }
            if(this.dateFrom && this.dateTo){
                that.loading = true;
                $.ajax({
                    url: '/eventSearch/ssr',
                    type: 'post',
                    dataType: 'json',
                    data: params,
                    success: function(data) {
                        that.loading = false;
                        console.log(data.sql);
                        that.reports = data.data;
                        var chartData = [];
                        that.reports.forEach(function(item){
                            chartData.push({
                                name: item.count,
                                value: [item.date ,parseInt(item.count)]
                            })
                        })
                        options.series[0].data = chartData;
                        that.setOption('.result.ss', options);
                    }
                })
            }
            else{
                alert('请输入开始结束时间!');
            }
        },
        setOption: function (selector,option) {
            setTimeout(function () {
                echarts.init(document.querySelector(selector)).setOption(option);
            },1000);
        },
    },
    created: function() {
        this.getClient();
    }
})
