function uuid(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function isRepeat(t){for(var r={},n=0;n<t.length;n++){if(r[t[n]])return!0;r[t[n]]=!0}return!1}var httpJson=function(t,r,n){$.ajax({url:t,data:r,dataType:"json",xhrFields:{withCredentials:!0},type:"GET",success:n,error:function(){alert("time out")}})};