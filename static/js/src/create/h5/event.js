var l1Event=function(){},purchaseEvent=function(){},commentEvent=function(){},liveEvent=function(){},seckillEvent=function(){},topnavEvent=function(){var n=$(CANVAS_PANEL).find(".cur"),t=[];$(".topnav-body .form-group").each(function(n,a){var e={name:$($(a).find("input")[0]).val(),anchor:$($(a).find("input")[1]).val()};t.push(e)});var a=JSON.parse(n.attr(SETTING)),e=_.extend(a,{tabInfo:t});n.attr("data-setting",JSON.stringify(e))},newcomercouponEvent=function(){var n=$(CANVAS_PANEL).find(".cur"),t=[];$(".newcomercoupon-body .form-group").each(function(n,a){var e={ruleId:$($(a).find("input[name=ruleId]")).val(),ruleImg:$($(a).find("input[name=ruleImg]")).val()};t.push(e)});var a=JSON.parse(n.attr(SETTING)),e=_.extend(a,{couponInfo:t});n.attr("data-setting",JSON.stringify(e))},winEvent=function(){var n=$(CANVAS_PANEL).find(".cur"),t=[];$(".win-table").each(function(n,a){var e=$(a).find("[data-csv]").attr("data-csv")||"[]",i={from:$(a).find(".winfrom").val(),to:$(a).find(".winto").val(),name:$(a).find(".csv-name").html(),csv:JSON.parse(e)};i.from&&i.to&&"NA"!=i.name&&i.csv.length&&t.push(i)});var a=JSON.parse(n.attr(SETTING)),e=_.extend(a,{winInfo:t});n.attr("data-setting",JSON.stringify(e))},countdownEvent=function(){},videoEvent=function(n){var t=$(CANVAS_PANEL).find(".cur");t.css("background",n.videoBackground),t.find("img").attr("src",n.imgSrc)},anchorEvent=function(){},flashsaleEvent=function(){var n=$(CANVAS_PANEL).find(".cur"),t=[];$(".flashsale-table-content .table").each(function(n,a){var e=[];$(a).find(".cattime").each(function(n,t){var a={time:$(t).find("[data-flashtimepicker]").val(),to:$(t).next().find("[data-flashtimepicker]").val(),category:$(t).find(".flash-category").val()};e.push(a)});var i={id:uuid(),date:$(a).find("[data-flashdatepicker]").val(),catTime:e};t.push(i)});var a=JSON.parse(n.attr(SETTING)),e=_.extend(a,{tabInfo:t});n.attr("data-setting",JSON.stringify(e))},benefitsEvent=function(){},presaleEvent=function(){},grouponEvent=function(){},supportEvent=function(){},newcomercommentEvent=function(){},imgEvent=function(n){var t=$(CANVAS_PANEL).find(".cur");t.find("a").attr("href",n.imgUrl),t.find("img").attr("src",n.imgSrc);var a=$(".loginMsg");$("[name=isLogin]").is(":checked")?a.show():a.hide()};