function FileProgress(A,e){if(this.fileProgressID=A.id,this.file=A,this.opacity=100,this.height=0,this.fileProgressWrapper=$("#"+this.fileProgressID),this.fileProgressWrapper.length)this.reset();else{this.fileProgressWrapper=$("<tr></tr>");var r=this.fileProgressWrapper;r.attr("id",this.fileProgressID).addClass("progressContainer");var s=$("<td/>");s.addClass("progressName").text(A.name);var t=plupload.formatSize(A.size).toUpperCase(),a=$("<td/>");a.addClass("progressFileSize").text(t);var i=$("<td/>"),g=$("<div/>");g.addClass("info");var o=$("<div/>");o.addClass("progress progress-striped");var n=$("<div/>");n.addClass("progress-bar progress-bar-info").attr("role","progressbar").attr("aria-valuemax",100).attr("aria-valuenow",0).attr("aria-valuein",0).width("0%");var d=$("<span class=sr-only />");d.text(t);var p=$("<a href=javascript:; />");p.show().addClass("progressCancel").text("×"),n.append(d),o.append(n),g.append(o),g.append(p);var f=$('<div class="status text-center"/>');g.append(f),i.append(g),r.append(s),r.append(a),r.append(i),$("#"+e).append(r)}this.height=this.fileProgressWrapper.offset().top,this.setTimer(null)}FileProgress.prototype.setTimer=function(A){this.fileProgressWrapper.FP_TIMER=A},FileProgress.prototype.getTimer=function(){return this.fileProgressWrapper.FP_TIMER||null},FileProgress.prototype.reset=function(){this.fileProgressWrapper.attr("class","progressContainer"),this.fileProgressWrapper.find("td .progress .progress-bar-info").attr("aria-valuenow",0).width("0%").find("span").text(""),this.appear()},FileProgress.prototype.setChunkProgess=function(A){var e=Math.ceil(this.file.size/A);if(1===e)return!1;for(var r=$('<button class="btn btn-default">查看分块上传进度</button>'),s=$('<tr class="chunk-status-tr"><td colspan=3></td></tr>'),t=$("<div/>"),a=1;e>=a;a++){var i=$('<div class="col-md-2"/>'),g=$('<div class="progress progress-striped"></div>'),o=$("<div/>");o.addClass("progress-bar progress-bar-info text-left").attr("role","progressbar").attr("aria-valuemax",100).attr("aria-valuenow",0).attr("aria-valuein",0).width("0%").attr("id",this.file.id+"_"+a).text("");var n=$("<span/>");n.addClass("chunk-status").text(),g.append(o),g.append(n),i.append(g),t.append(i)}this.fileProgressWrapper.find("td:eq(2) .btn-default").length||this.fileProgressWrapper.find("td>div").append(r),s.hide().find("td").append(t),s.insertAfter(this.fileProgressWrapper)},FileProgress.prototype.setProgress=function(A,e,r){this.fileProgressWrapper.attr("class","progressContainer green");var s=this.file,t=s.loaded,a=plupload.formatSize(t).toUpperCase(),i=plupload.formatSize(e).toUpperCase(),g=this.fileProgressWrapper.find("td .progress").find(".progress-bar-info");if("取消上传"!==this.fileProgressWrapper.find(".status").text()){if(this.fileProgressWrapper.find(".status").text("已上传: "+a+" 上传速度： "+i+"/s"),A=parseInt(A,10),s.status!==plupload.DONE&&100===A&&(A=99),g.attr("aria-valuenow",A).css("width",A+"%"),r){var o=Math.ceil(s.size/r);if(1===o)return!1;for(var n,d,p=Math.ceil(t/r),f=0;p>f;f++)n=$("#"+s.id+"_"+f),n.width("100%").removeClass().addClass("alert-success").attr("aria-valuenow",100),d="块"+f+"上传进度100%",n.next().html(d);var l,w=$("#"+s.id+"_"+p);if(o>p)t%r?l=(t%r/r*100).toFixed(2):(l=100,w.removeClass().addClass("alert-success"));else{var C=s.size-r*(o-1),h=s.size-t;h%C?l=(t%r/C*100).toFixed(2):(l=100,w.removeClass().addClass("alert-success"))}w.width(l+"%"),w.attr("aria-valuenow",l),d="块"+p+"上传进度"+l+"%",w.next().html(d)}this.appear()}},FileProgress.prototype.setComplete=function(A,e){var r,s=this.fileProgressWrapper.find("td:eq(2)"),t=s.find(".progress"),a=$.parseJSON(e);if(a.url)r=a.url,str="<div><strong>Link:</strong><a href="+a.url+" target='_blank' > "+a.url+"</a></div><div class=hash><strong>Hash:</strong>"+a.hash+"</div>";else{var i=A.getOption("domain");r="http://"+i+"/"+encodeURI(a.key);var g="http://"+i+"/"+a.key;str="<div><strong>Link:</strong><a href="+r+" target='_blank' > "+g+"</a></div><div class=hash><strong>Hash:</strong>"+a.hash+"</div>"}t.html(str).removeClass().next().next(".status").hide(),s.find(".progressCancel").hide();var o=this.fileProgressWrapper.find(".progressName"),n="?imageView2/1/w/100/h/100",d=function(A){var e,r="",s=["png","jpg","jpeg","gif","bmp"],t=/\.([a-zA-Z0-9]+)(\?|\@|$)/;if(!A||!t.test(A))return!1;e=t.exec(A),r=e[1].toLowerCase();for(var a=0,i=s.length;i>a;a++)if(r===s[a])return!0;return!1},p=d(r),f=$('<div class="Wrapper"/>'),l=$('<div class="imgWrapper col-md-3"/>'),w=$('<a class="linkWrapper" target="_blank"/>'),C=$("<img class='dddd' src=data:image/gif;base64,R0lGODlhFAAUAOMIAAAAABoaGjMzM0xMTGZmZoCAgJmZmbKysv///////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgAIACwAAAAAFAAUAAAEUxDJSau9CADMteZTEEjehhzHJYqkiaLWOlZvGs8WDO6UIPAGw8TnAwWDEuKPcxQml0YnjzcYYAqFS7VqwWItWyuCQJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq70vBMy15pMgSN72AMAliqSJotY6Vm8azxYM7tQw8IfDxOcDBYMS4o9zFCaXRiePRyBgDIZLtWrBYi1b66NQkHizYDGZbEaD1uXphC2XRwAAIfkEAQoADwAsAAAAABQAFAAABFPwyUmrvU8IzLXm0zBI3vYEwSWKpImi1jpWbxrPFgzuFEHwAMDE5wMFgxLij3MUJpdGJ49XKGAOh0u1asFiLVvrw2CQeLNgMZlsRoPW5emELZdHAAAh+QQBCgAPACwAAAAAFAAUAAAEU/DJSau9bwzMteYTQUje9gjCJYqkiaLWOlZvGs8WDO5UUfCBwMTnAwWDEuKPcxQml0Ynj2cwYACAS7VqwWItW+vjcJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq72PEMy15lNRSN72DMMliqSJotY6Vm8azxYM7pRh8ALBxOcDBYMS4o9zFCaXRiePdzhgAoFLtWrBYi1b6wMAkHizYDGZbEaD1uXphC2XRwAAIfkEAQoADwAsAAAAABQAFAAABFPwyUmrva8UzLXmk2FI3vYQxCWKpImi1jpWbxrPFgzu1HHwg8HE5wMFgxLij3MUJpdGJ48HAGAEgku1asFiLVvrIxCQeLNgMZlsRoPW5emELZdHAAAh+QQBCgAPACwAAAAAFAAUAAAEU/DJSau9zxjMtebTcUje9hTFJYqkiaLWOlZvGs8WDO4UAPAEwsTnAwWDEuKPcxQml0YnjxcIYAaDS7VqwWItW+tDIJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq73vHMy15hMASN72GMYliqSJotY6Vm8azxYM7lQQ8IXCxOcDBYMS4o9zFCaXRiePJxBgCIRLtWrBYi1b62MwkHizYDGZbEaD1uXphC2XRwAAOw==/>");if(o.append(f),p){w.append(C),l.append(w),f.append(l);var h=new Image;/imageView/.test(r)||(r+=n),$(h).attr("src",r);var Q=340;$(h).on("load",function(){function A(A,e,r){$("#myModal-img").modal();var s=$("#myModal-img").find(".modal-body");300>=r&&$("#myModal-img").find(".text-warning").show();var t=new Image;s.find("img").attr("src","data:image/gif;base64,R0lGODlhFAAUAOMIAAAAABoaGjMzM0xMTGZmZoCAgJmZmbKysv///////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgAIACwAAAAAFAAUAAAEUxDJSau9CADMteZTEEjehhzHJYqkiaLWOlZvGs8WDO6UIPAGw8TnAwWDEuKPcxQml0YnjzcYYAqFS7VqwWItWyuCQJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq70vBMy15pMgSN72AMAliqSJotY6Vm8azxYM7tQw8IfDxOcDBYMS4o9zFCaXRiePRyBgDIZLtWrBYi1b66NQkHizYDGZbEaD1uXphC2XRwAAIfkEAQoADwAsAAAAABQAFAAABFPwyUmrvU8IzLXm0zBI3vYEwSWKpImi1jpWbxrPFgzuFEHwAMDE5wMFgxLij3MUJpdGJ49XKGAOh0u1asFiLVvrw2CQeLNgMZlsRoPW5emELZdHAAAh+QQBCgAPACwAAAAAFAAUAAAEU/DJSau9bwzMteYTQUje9gjCJYqkiaLWOlZvGs8WDO5UUfCBwMTnAwWDEuKPcxQml0Ynj2cwYACAS7VqwWItW+vjcJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq72PEMy15lNRSN72DMMliqSJotY6Vm8azxYM7pRh8ALBxOcDBYMS4o9zFCaXRiePdzhgAoFLtWrBYi1b6wMAkHizYDGZbEaD1uXphC2XRwAAIfkEAQoADwAsAAAAABQAFAAABFPwyUmrva8UzLXmk2FI3vYQxCWKpImi1jpWbxrPFgzu1HHwg8HE5wMFgxLij3MUJpdGJ48HAGAEgku1asFiLVvrIxCQeLNgMZlsRoPW5emELZdHAAAh+QQBCgAPACwAAAAAFAAUAAAEU/DJSau9zxjMtebTcUje9hTFJYqkiaLWOlZvGs8WDO4UAPAEwsTnAwWDEuKPcxQml0YnjxcIYAaDS7VqwWItW+tDIJB4s2AxmWxGg9bl6YQtl0cAACH5BAEKAA8ALAAAAAAUABQAAART8MlJq73vHMy15hMASN72GMYliqSJotY6Vm8azxYM7lQQ8IXCxOcDBYMS4o9zFCaXRiePJxBgCIRLtWrBYi1b62MwkHizYDGZbEaD1uXphC2XRwAAOw=="),t.onload=function(){s.find("img").attr("src",A).data("key",e).data("h",r),s.find(".modal-body-wrapper").find("a").attr("href",A)},t.src=A}C.attr("src",r),w.attr("href",r).attr("title","查看原图");var e=$('<div class="infoWrapper col-md-6"></div>'),s=$('<a class="fopLink"/>');s.attr("data-key",a.key).text("查看处理效果"),e.append(s),s.on("click",function(){var e=$(this).data("key"),r=parseInt($(this).parents(".Wrapper").find(".origin-height").text(),10);r=r>$(window).height()-Q?parseInt($(window).height()-Q,10):parseInt(r,10)||300;var s=[];s.push({fop:"imageView2",mode:3,h:r,q:100,format:"png"}),s.push({fop:"watermark",mode:1,image:"http://www.b1.qiniudn.com/images/logo-2.png",dissolve:100,gravity:"SouthEast",dx:100,dy:100});var t=Qiniu.pipeline(s,e);return $("#myModal-img").on("hide.bs.modal",function(){$("#myModal-img").find(".btn-default").removeClass("disabled"),$("#myModal-img").find(".text-warning").hide()}).on("show.bs.modal",function(){$("#myModal-img").find(".imageView").find("a:eq(0)").addClass("disabled"),$("#myModal-img").find(".watermark").find("a:eq(3)").addClass("disabled"),$("#myModal-img").find(".text-warning").hide()}),A(t,e,r),!1});var t=Qiniu.detectIEVersion();if(!(t&&9>=t)){var i=Qiniu.exif(a.key);if(i){var g=$('<a href="" target="_blank">查看exif</a>');g.attr("href",r+"?exif"),e.append(g)}var o=Qiniu.imageInfo(a.key),n=$("<div/>"),d='<div>格式：<span class="origin-format">'+o.format+'</span></div><div>宽度：<span class="orgin-width">'+o.width+'px</span></div><div>高度：<span class="origin-height">'+o.height+"px</span></div>";n.html(d),e.append(n)}f.append(e)}).on("error",function(){C.attr("src","default.png"),f.addClass("default")})}else C.attr("src","data:image/png;base64,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"),f.addClass("default"),l.append(C),f.append(l)},FileProgress.prototype.setError=function(){this.fileProgressWrapper.find("td:eq(2)").attr("class","text-warning"),this.fileProgressWrapper.find("td:eq(2) .progress").css("width",0).hide(),this.fileProgressWrapper.find("button").hide(),this.fileProgressWrapper.next(".chunk-status-tr").hide()},FileProgress.prototype.setCancelled=function(A){var e="progressContainer";A||(e+=" red"),this.fileProgressWrapper.attr("class",e),this.fileProgressWrapper.find("td .progress").remove(),this.fileProgressWrapper.find("td:eq(2) .btn-default").hide(),this.fileProgressWrapper.find("td:eq(2) .progressCancel").hide()},FileProgress.prototype.setStatus=function(A,e){e||this.fileProgressWrapper.find(".status").text(A).attr("class","status text-left")},FileProgress.prototype.bindUploadCancel=function(A){var e=this;A&&e.fileProgressWrapper.find("td:eq(2) .progressCancel").on("click",function(){e.setCancelled(!1),e.setStatus("取消上传"),e.fileProgressWrapper.find(".status").css("left","0"),A.removeFile(e.file)})},FileProgress.prototype.appear=function(){if(null!==this.getTimer()&&(clearTimeout(this.getTimer()),this.setTimer(null)),this.fileProgressWrapper[0].filters)try{this.fileProgressWrapper[0].filters.item("DXImageTransform.Microsoft.Alpha").opacity=100}catch(A){this.fileProgressWrapper.css("filter","progid:DXImageTransform.Microsoft.Alpha(opacity=100)")}else this.fileProgressWrapper.css("opacity",1);this.fileProgressWrapper.css("height",""),this.height=this.fileProgressWrapper.offset().top,this.opacity=100,this.fileProgressWrapper.show()};