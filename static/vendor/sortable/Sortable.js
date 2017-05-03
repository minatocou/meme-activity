!function(t){"use strict";"function"==typeof define&&define.amd?define(t):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=t():"undefined"!=typeof Package?Sortable=t():window.Sortable=t()}(function(){"use strict";function t(t,e){if(!t||!t.nodeType||1!==t.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(t);this.el=t,this.options=e=b({},e),t[L]=this;var n={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(t.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",ignore:"a, img",filter:null,animation:0,setData:function(t,e){t.setData("Text",e.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1};for(var i in n)!(i in e)&&(e[i]=n[i]);G(e);for(var r in this)"_"===r.charAt(0)&&(this[r]=this[r].bind(this));this.nativeDraggable=e.forceFallback?!1:W,o(t,"mousedown",this._onTapStart),o(t,"touchstart",this._onTapStart),this.nativeDraggable&&(o(t,"dragover",this),o(t,"dragenter",this)),q.push(this._onDragOver),e.store&&this.sort(e.store.get(this))}function e(t){w&&w.state!==t&&(s(w,"display",t?"none":""),!t&&w.state&&S.insertBefore(w,_),w.state=t)}function n(t,e,n){if(t){n=n||H;do if(">*"===e&&t.parentNode===n||v(t,e))return t;while(t="host"in t?t.host:t.parentNode)}return null}function i(t){t.dataTransfer&&(t.dataTransfer.dropEffect="move"),t.preventDefault()}function o(t,e,n){t.addEventListener(e,n,!1)}function r(t,e,n){t.removeEventListener(e,n,!1)}function a(t,e,n){if(t)if(t.classList)t.classList[n?"add":"remove"](e);else{var i=(" "+t.className+" ").replace(M," ").replace(" "+e+" "," ");t.className=(i+(n?" "+e:"")).replace(M," ")}}function s(t,e,n){var i=t&&t.style;if(i){if(void 0===n)return H.defaultView&&H.defaultView.getComputedStyle?n=H.defaultView.getComputedStyle(t,""):t.currentStyle&&(n=t.currentStyle),void 0===e?n:n[e];e in i||(e="-webkit-"+e),i[e]=n+("string"==typeof n?"":"px")}}function l(t,e,n){if(t){var i=t.getElementsByTagName(e),o=0,r=i.length;if(n)for(;r>o;o++)n(i[o],o);return i}return[]}function d(t,e,n,i,o,r,a){var s=H.createEvent("Event"),l=(t||e[L]).options,d="on"+n.charAt(0).toUpperCase()+n.substr(1);s.initEvent(n,!0,!0),s.to=e,s.from=o||e,s.item=i||e,s.clone=w,s.oldIndex=r,s.newIndex=a,e.dispatchEvent(s),l[d]&&l[d].call(t,s)}function c(t,e,n,i,o,r){var a,s,l=t[L],d=l.options.onMove;return a=H.createEvent("Event"),a.initEvent("move",!0,!0),a.to=e,a.from=t,a.dragged=n,a.draggedRect=i,a.related=o||e,a.relatedRect=r||e.getBoundingClientRect(),t.dispatchEvent(a),d&&(s=d.call(l,a)),s}function h(t){t.draggable=!1}function u(){F=!1}function f(t,e){var n=t.lastElementChild,i=n.getBoundingClientRect();return(e.clientY-(i.top+i.height)>5||e.clientX-(i.right+i.width)>5)&&n}function p(t){for(var e=t.tagName+t.className+t.src+t.href+t.textContent,n=e.length,i=0;n--;)i+=e.charCodeAt(n);return i.toString(36)}function g(t,e){var n=0;if(!t||!t.parentNode)return-1;for(;t&&(t=t.previousElementSibling);)"TEMPLATE"!==t.nodeName.toUpperCase()&&v(t,e)&&n++;return n}function v(t,e){if(t){e=e.split(".");var n=e.shift().toUpperCase(),i=new RegExp("\\s("+e.join("|")+")(?=\\s)","g");return!(""!==n&&t.nodeName.toUpperCase()!=n||e.length&&((" "+t.className+" ").match(i)||[]).length!=e.length)}return!1}function m(t,e){var n,i;return function(){void 0===n&&(n=arguments,i=this,setTimeout(function(){1===n.length?t.call(i,n[0]):t.apply(i,n),n=void 0},e))}}function b(t,e){if(t&&e)for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}if("undefined"==typeof window||"undefined"==typeof window.document)return function(){throw new Error("Sortable.js requires a window with a document")};var _,D,y,w,S,T,C,E,x,N,B,O,X,Y,A,R,I,k={},M=/\s+/g,L="Sortable"+(new Date).getTime(),U=window,H=U.document,P=U.parseInt,W=!!("draggable"in H.createElement("div")),j=function(t){return t=H.createElement("x"),t.style.cssText="pointer-events:auto","auto"===t.style.pointerEvents}(),F=!1,V=Math.abs,q=([].slice,[]),z=m(function(t,e,n){if(n&&e.scroll){var i,o,r,a,s=e.scrollSensitivity,l=e.scrollSpeed,d=t.clientX,c=t.clientY,h=window.innerWidth,u=window.innerHeight;if(E!==n&&(C=e.scroll,E=n,C===!0)){C=n;do if(C.offsetWidth<C.scrollWidth||C.offsetHeight<C.scrollHeight)break;while(C=C.parentNode)}C&&(i=C,o=C.getBoundingClientRect(),r=(V(o.right-d)<=s)-(V(o.left-d)<=s),a=(V(o.bottom-c)<=s)-(V(o.top-c)<=s)),r||a||(r=(s>=h-d)-(s>=d),a=(s>=u-c)-(s>=c),(r||a)&&(i=U)),(k.vx!==r||k.vy!==a||k.el!==i)&&(k.el=i,k.vx=r,k.vy=a,clearInterval(k.pid),i&&(k.pid=setInterval(function(){i===U?U.scrollTo(U.pageXOffset+r*l,U.pageYOffset+a*l):(a&&(i.scrollTop+=a*l),r&&(i.scrollLeft+=r*l))},24)))}},30),G=function(t){var e=t.group;e&&"object"==typeof e||(e=t.group={name:e}),["pull","put"].forEach(function(t){t in e||(e[t]=!0)}),t.groups=" "+e.name+(e.put.join?" "+e.put.join(" "):"")+" "};return t.prototype={constructor:t,_onTapStart:function(t){var e=this,i=this.el,o=this.options,r=t.type,a=t.touches&&t.touches[0],s=(a||t).target,l=t.target.shadowRoot&&t.path[0]||s,c=o.filter;if(!("mousedown"===r&&0!==t.button||o.disabled)&&(s=n(s,o.draggable,i))){if(O=g(s,o.draggable),"function"==typeof c){if(c.call(this,t,s,this))return d(e,l,"filter",s,i,O),void t.preventDefault()}else if(c&&(c=c.split(",").some(function(t){return t=n(l,t.trim(),i),t?(d(e,t,"filter",s,i,O),!0):void 0})))return void t.preventDefault();(!o.handle||n(l,o.handle,i))&&this._prepareDragStart(t,a,s)}},_prepareDragStart:function(t,e,n){var i,r=this,s=r.el,d=r.options,c=s.ownerDocument;n&&n.parentNode===s&&(A=t,S=s,_=n,D=_.parentNode,T=_.nextSibling,Y=d.group,i=function(){r._disableDelayedDrag(),_.draggable=!0,a(_,r.options.chosenClass,!0),r._triggerDragStart(e)},d.ignore.split(",").forEach(function(t){l(_,t.trim(),h)}),o(c,"mouseup",r._onDrop),o(c,"touchend",r._onDrop),o(c,"touchcancel",r._onDrop),d.delay?(o(c,"mouseup",r._disableDelayedDrag),o(c,"touchend",r._disableDelayedDrag),o(c,"touchcancel",r._disableDelayedDrag),o(c,"mousemove",r._disableDelayedDrag),o(c,"touchmove",r._disableDelayedDrag),r._dragStartTimer=setTimeout(i,d.delay)):i())},_disableDelayedDrag:function(){var t=this.el.ownerDocument;clearTimeout(this._dragStartTimer),r(t,"mouseup",this._disableDelayedDrag),r(t,"touchend",this._disableDelayedDrag),r(t,"touchcancel",this._disableDelayedDrag),r(t,"mousemove",this._disableDelayedDrag),r(t,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(t){t?(A={target:_,clientX:t.clientX,clientY:t.clientY},this._onDragStart(A,"touch")):this.nativeDraggable?(o(_,"dragend",this),o(S,"dragstart",this._onDragStart)):this._onDragStart(A,!0);try{H.selection?setTimeout(function(){H.selection.empty()}):window.getSelection().removeAllRanges()}catch(e){}},_dragStarted:function(){S&&_&&(a(_,this.options.ghostClass,!0),t.active=this,d(this,S,"start",_,S,O))},_emulateDragOver:function(){if(R){if(this._lastX===R.clientX&&this._lastY===R.clientY)return;this._lastX=R.clientX,this._lastY=R.clientY,j||s(y,"display","none");var t=H.elementFromPoint(R.clientX,R.clientY),e=t,n=" "+this.options.group.name,i=q.length;if(e)do{if(e[L]&&e[L].options.groups.indexOf(n)>-1){for(;i--;)q[i]({clientX:R.clientX,clientY:R.clientY,target:t,rootEl:e});break}t=e}while(e=e.parentNode);j||s(y,"display","")}},_onTouchMove:function(e){if(A){t.active||this._dragStarted(),this._appendGhost();var n=e.touches?e.touches[0]:e,i=n.clientX-A.clientX,o=n.clientY-A.clientY,r=e.touches?"translate3d("+i+"px,"+o+"px,0)":"translate("+i+"px,"+o+"px)";I=!0,R=n,s(y,"webkitTransform",r),s(y,"mozTransform",r),s(y,"msTransform",r),s(y,"transform",r),e.preventDefault()}},_appendGhost:function(){if(!y){var t,e=_.getBoundingClientRect(),n=s(_),i=this.options;y=_.cloneNode(!0),a(y,i.ghostClass,!1),a(y,i.fallbackClass,!0),s(y,"top",e.top-P(n.marginTop,10)),s(y,"left",e.left-P(n.marginLeft,10)),s(y,"width",e.width),s(y,"height",e.height),s(y,"opacity","0.8"),s(y,"position","fixed"),s(y,"zIndex","100000"),s(y,"pointerEvents","none"),i.fallbackOnBody&&H.body.appendChild(y)||S.appendChild(y),t=y.getBoundingClientRect(),s(y,"width",2*e.width-t.width),s(y,"height",2*e.height-t.height)}},_onDragStart:function(t,e){var n=t.dataTransfer,i=this.options;this._offUpEvents(),"clone"==Y.pull&&(w=_.cloneNode(!0),s(w,"display","none"),S.insertBefore(w,_)),e?("touch"===e?(o(H,"touchmove",this._onTouchMove),o(H,"touchend",this._onDrop),o(H,"touchcancel",this._onDrop)):(o(H,"mousemove",this._onTouchMove),o(H,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(n&&(n.effectAllowed="move",i.setData&&i.setData.call(this,n,_)),o(H,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(t){var i,o,r,a=this.el,l=this.options,d=l.group,h=d.put,p=Y===d,g=l.sort;if(void 0!==t.preventDefault&&(t.preventDefault(),!l.dragoverBubble&&t.stopPropagation()),I=!0,Y&&!l.disabled&&(p?g||(r=!S.contains(_)):Y.pull&&h&&(Y.name===d.name||h.indexOf&&~h.indexOf(Y.name)))&&(void 0===t.rootEl||t.rootEl===this.el)){if(z(t,l,this.el),F)return;if(i=n(t.target,l.draggable,a),o=_.getBoundingClientRect(),r)return e(!0),void(w||T?S.insertBefore(_,w||T):g||S.appendChild(_));if(0===a.children.length||a.children[0]===y||a===t.target&&(i=f(a,t))){if(i){if(i.animated)return;m=i.getBoundingClientRect()}e(p),c(S,a,_,o,i,m)!==!1&&(_.contains(a)||(a.appendChild(_),D=a),this._animate(o,_),i&&this._animate(m,i))}else if(i&&!i.animated&&i!==_&&void 0!==i.parentNode[L]){x!==i&&(x=i,N=s(i),B=s(i.parentNode));var v,m=i.getBoundingClientRect(),b=m.right-m.left,C=m.bottom-m.top,E=/left|right|inline/.test(N.cssFloat+N.display)||"flex"==B.display&&0===B["flex-direction"].indexOf("row"),O=i.offsetWidth>_.offsetWidth,X=i.offsetHeight>_.offsetHeight,A=(E?(t.clientX-m.left)/b:(t.clientY-m.top)/C)>.5,R=i.nextElementSibling,k=c(S,a,_,o,i,m);if(k!==!1){if(F=!0,setTimeout(u,30),e(p),1===k||-1===k)v=1===k;else if(E){var M=_.offsetTop,U=i.offsetTop;v=M===U?i.previousElementSibling===_&&!O||A&&O:U>M}else v=R!==_&&!X||A&&X;_.contains(a)||(v&&!R?a.appendChild(_):i.parentNode.insertBefore(_,v?R:i)),D=_.parentNode,this._animate(o,_),this._animate(m,i)}}}},_animate:function(t,e){var n=this.options.animation;if(n){var i=e.getBoundingClientRect();s(e,"transition","none"),s(e,"transform","translate3d("+(t.left-i.left)+"px,"+(t.top-i.top)+"px,0)"),e.offsetWidth,s(e,"transition","all "+n+"ms"),s(e,"transform","translate3d(0,0,0)"),clearTimeout(e.animated),e.animated=setTimeout(function(){s(e,"transition",""),s(e,"transform",""),e.animated=!1},n)}},_offUpEvents:function(){var t=this.el.ownerDocument;r(H,"touchmove",this._onTouchMove),r(t,"mouseup",this._onDrop),r(t,"touchend",this._onDrop),r(t,"touchcancel",this._onDrop)},_onDrop:function(e){var n=this.el,i=this.options;clearInterval(this._loopId),clearInterval(k.pid),clearTimeout(this._dragStartTimer),r(H,"mousemove",this._onTouchMove),this.nativeDraggable&&(r(H,"drop",this),r(n,"dragstart",this._onDragStart)),this._offUpEvents(),e&&(I&&(e.preventDefault(),!i.dropBubble&&e.stopPropagation()),y&&y.parentNode.removeChild(y),_&&(this.nativeDraggable&&r(_,"dragend",this),h(_),a(_,this.options.ghostClass,!1),a(_,this.options.chosenClass,!1),S!==D?(X=g(_,i.draggable),X>=0&&(d(null,D,"sort",_,S,O,X),d(this,S,"sort",_,S,O,X),d(null,D,"add",_,S,O,X),d(this,S,"remove",_,S,O,X))):(w&&w.parentNode.removeChild(w),_.nextSibling!==T&&(X=g(_,i.draggable),X>=0&&(d(this,S,"update",_,S,O,X),d(this,S,"sort",_,S,O,X)))),t.active&&((null==X||-1===X)&&(X=O),d(this,S,"end",_,S,O,X),this.save()))),this._nulling()},_nulling:function(){t.active===this&&(S=_=D=y=T=w=C=E=A=R=I=X=x=N=Y=t.active=null)},handleEvent:function(t){var e=t.type;"dragover"===e||"dragenter"===e?_&&(this._onDragOver(t),i(t)):("drop"===e||"dragend"===e)&&this._onDrop(t)},toArray:function(){for(var t,e=[],i=this.el.children,o=0,r=i.length,a=this.options;r>o;o++)t=i[o],n(t,a.draggable,this.el)&&e.push(t.getAttribute(a.dataIdAttr)||p(t));return e},sort:function(t){var e={},i=this.el;this.toArray().forEach(function(t,o){var r=i.children[o];n(r,this.options.draggable,i)&&(e[t]=r)},this),t.forEach(function(t){e[t]&&(i.removeChild(e[t]),i.appendChild(e[t]))})},save:function(){var t=this.options.store;t&&t.set(this)},closest:function(t,e){return n(t,e||this.options.draggable,this.el)},option:function(t,e){var n=this.options;return void 0===e?n[t]:(n[t]=e,void("group"===t&&G(n)))},destroy:function(){var t=this.el;t[L]=null,r(t,"mousedown",this._onTapStart),r(t,"touchstart",this._onTapStart),this.nativeDraggable&&(r(t,"dragover",this),r(t,"dragenter",this)),Array.prototype.forEach.call(t.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),q.splice(q.indexOf(this._onDragOver),1),this._onDrop(),this.el=t=null}},t.utils={on:o,off:r,css:s,find:l,is:function(t,e){return!!n(t,e,t)},extend:b,throttle:m,closest:n,toggleClass:a,index:g},t.create=function(e,n){return new t(e,n)},t.version="1.4.2",t});