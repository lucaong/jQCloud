/*
 * jQCloud Plugin for jQuery
 *
 * Version 0.1.8
 *
 * Copyright 2011, Luca Ongaro
 * Licensed under the MIT license.
 *
 * Date: Fri Apr 8 10:24:15 +0100 2011
 */
(function(a){a.fn.jQCloud=function(c,f){var e=this;var d=e.attr("id");e.addClass("jqcloud");var b=function(){var h=function(q,o){var n=function(s,r){if(Math.abs(2*s.offsetLeft+s.offsetWidth-2*r.offsetLeft-r.offsetWidth)<s.offsetWidth+r.offsetWidth){if(Math.abs(2*s.offsetTop+s.offsetHeight-2*r.offsetTop-r.offsetHeight)<s.offsetHeight+r.offsetHeight){return true}}return false};var p=0;for(p=0;p<o.length;p++){if(n(q,o[p])){return true}}return false};for(i=0;i<c.length;i++){c[i].weight=parseFloat(c[i].weight,10)}c.sort(function(o,n){if(o.weight<n.weight){return 1}else{if(o.weight>n.weight){return -1}else{return 0}}});var k=2;var g=[];var j=e.width()/e.height();var m=e.width()/2;var l=e.height()/2;a.each(c,function(t,n){var r=d+"_word_"+t;var v="#"+r;var q=6.28*Math.random();var u=0;var s=Math.round((n.weight-c[c.length-1].weight)/(c[0].weight-c[c.length-1].weight)*9)+1;var y=n.url!==undefined?"<a href='"+encodeURI(n.url).replace(/'/g,"%27")+"'>"+n.text+"</a>":n.text;e.append("<span id='"+r+"' class='w"+s+"' title='"+(n.title||"")+"'>"+y+"</span>");var o=a(v).width();var x=a(v).height();var p=m-o/2;var w=l-x/2;a(v).css("position","absolute");a(v).css("left",p+"px");a(v).css("top",w+"px");while(h(document.getElementById(r),g)){u+=k;q+=(t%2===0?1:-1)*k;p=m-(o/2)+(u*Math.cos(q))*j;w=l+u*Math.sin(q)-(x/2);a(v).css("left",p+"px");a(v).css("top",w+"px")}g.push(document.getElementById(r))});if(typeof f==="function"){f.call(this)}};setTimeout(function(){b()},100);return this}})(jQuery);