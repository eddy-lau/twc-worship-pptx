(function(t){function n(n){for(var o,c,i=n[0],l=n[1],s=n[2],f=0,d=[];f<i.length;f++)c=i[f],Object.prototype.hasOwnProperty.call(r,c)&&r[c]&&d.push(r[c][0]),r[c]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(t[o]=l[o]);u&&u(n);while(d.length)d.shift()();return a.push.apply(a,s||[]),e()}function e(){for(var t,n=0;n<a.length;n++){for(var e=a[n],o=!0,i=1;i<e.length;i++){var l=e[i];0!==r[l]&&(o=!1)}o&&(a.splice(n--,1),t=c(c.s=e[0]))}return t}var o={},r={app:0},a=[];function c(n){if(o[n])return o[n].exports;var e=o[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,c),e.l=!0,e.exports}c.m=t,c.c=o,c.d=function(t,n,e){c.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,n){if(1&n&&(t=c(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(c.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)c.d(e,o,function(n){return t[n]}.bind(null,o));return e},c.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(n,"a",n),n},c.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},c.p="/twc-worship-pptx/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=n,i=i.slice();for(var s=0;s<i.length;s++)n(i[s]);var u=l;a.push([1,"chunk-vendors"]),e()})({0:function(t,n){},"0425":function(t,n,e){t.exports=e.p+"img/ccma_logo_white.a178253e.png"},1:function(t,n,e){t.exports=e("56d7")},"1f2b":function(t,n,e){t.exports=e.p+"img/background.4f452f36.jpg"},2:function(t,n){},5207:function(t,n,e){t.exports=e.p+"img/twc_logo.d76ef225.png"},"56d7":function(t,n,e){"use strict";e.r(n);e("e260"),e("e6cf"),e("cca6"),e("a79d");var o=e("7a23");function r(t,n,e,r,a,c){var i=Object(o["k"])("main-page");return Object(o["g"])(),Object(o["c"])(i)}e("4989"),e("ab8b");var a=Object(o["o"])("data-v-1564af2d");Object(o["i"])("data-v-1564af2d");var c={class:"navbar navbar-expand-lg navbar-light bg-light fixed-top"},i=Object(o["f"])("a",{class:"navbar-brand",href:"#"},[Object(o["f"])("h4",null,"詩歌PPT製作器"),Object(o["f"])("div",{class:"subtitle text-secondary"},"中華宣道會大圍堂")],-1),l={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},s=Object(o["e"])(" 完成 "),u={class:"container"},f={class:"card-header"},d={class:"card-body"},p={key:0,class:"card-footer"};Object(o["h"])();var b=a((function(t,n,e,r,a,b){var g=Object(o["k"])("add-song-form");return Object(o["g"])(),Object(o["c"])(o["a"],null,[Object(o["f"])("nav",c,[i,Object(o["f"])("button",{class:"btn btn-success float-right",disabled:a.downloading,onClick:n[1]||(n[1]=function(t){return b.download()})},[a.downloading?(Object(o["g"])(),Object(o["c"])("span",l)):Object(o["d"])("",!0),s],8,["disabled"])]),Object(o["f"])("div",u,[(Object(o["g"])(!0),Object(o["c"])(o["a"],null,Object(o["j"])(a.songCount,(function(t){return Object(o["g"])(),Object(o["c"])("div",{key:t,class:"card my-4"},[Object(o["f"])("div",f,[Object(o["f"])("strong",null,"第 "+Object(o["l"])(t)+" 首",1)]),Object(o["f"])("div",d,[Object(o["f"])(g,{ref:"addSongForm"+t},null,512)]),t==a.songCount?(Object(o["g"])(),Object(o["c"])("div",p,[Object(o["f"])("button",{class:"btn btn-secondary float-right",onClick:n[2]||(n[2]=function(t){return a.songCount=a.songCount+1})}," 新增歌曲 ")])):Object(o["d"])("",!0)])})),128))])],64)})),g=(e("4de4"),e("4160"),e("b0c0"),e("159b"),{class:"form-group"}),h=Object(o["f"])("label",{for:"songName"},"歌名",-1),m={class:"form-group"},y=Object(o["f"])("label",{for:"lyrics"},"歌詞",-1),v={class:"form-group"},j=Object(o["f"])("label",{for:"copyright"},"版權",-1);function O(t,n,e,r,a,c){return Object(o["g"])(),Object(o["c"])("form",null,[Object(o["f"])("div",g,[h,Object(o["n"])(Object(o["f"])("input",{type:"text",class:"form-control",id:"songName","onUpdate:modelValue":n[1]||(n[1]=function(t){return a.name=t}),placeholder:"(請貼上歌名)"},null,512),[[o["m"],a.name]])]),Object(o["f"])("div",m,[y,Object(o["n"])(Object(o["f"])("textarea",{class:"form-control",id:"lyrics","onUpdate:modelValue":n[2]||(n[2]=function(t){return a.lyrics=t}),placeholder:"(請貼上歌詞)",rows:"10"},null,512),[[o["m"],a.lyrics]]),Object(o["f"])("button",{type:"button",class:"btn btn-outline-primary btn-sm float-right my-1",onClick:n[3]||(n[3]=function(t){return c.formatText()})},"整理歌詞")]),Object(o["f"])("div",v,[j,Object(o["n"])(Object(o["f"])("textarea",{class:"form-control copyright-input",id:"copyright","onUpdate:modelValue":n[4]||(n[4]=function(t){return a.copyright=t}),rows:"5",placeholder:"(請貼上版權內容)"},null,512),[[o["m"],a.copyright]])])])}e("99af"),e("a15b"),e("d81d"),e("13d5"),e("d3b7"),e("ac1f"),e("466d"),e("1276"),e("498a");var F=18;function w(t){if(t.length<=F)return[t];var n=t.match(/[  ,，.。;；]$/);n&&(t=t.substring(0,n.index));var e=[],o="",r="",a=t.substring(0,F).match(/.+[  ,，.。;；]/);return a?(o=a[0],r=t.substring(a[0].length)):(o=t.substring(0,F),r=t.substring(F)),n&&(r+=n[0]),e=e.concat(o),e=e.concat(r),e}var x={data:function(){return{name:"",copyright:"",lyrics:""}},computed:{formattedLyrics:function(){var t=this.lyrics.split("\n");return t=t.map((function(t){return t.trim()})).filter((function(t){return t.length>0})).reduce((function(t,n){return t.concat(w(n))}),[]),t.join("\n")}},methods:{formatText:function(){this.lyrics=this.formattedLyrics},search:function(){var t=new FormData;t.append("terms","%A7%DA%A6V%A7A%C3%AB%A7i"),t.append("boolean","AND"),t.append("case","Insensitive");var n="AIzaSyBnmrZwjO6kmjLxDuH64U9-kWGUVFuAnDA",e="01497debf7236e5fc",o="我向你禱告",r="key=".concat(n,"&cx=").concat(e,"&q=").concat(o);fetch("https://www.googleapis.com/customsearch/v1?".concat(r)).then((function(t){return t.json()})).then((function(t){console.log(t)}))}}};x.render=O;var k=x,S=e("5530"),T=e("8f74"),_=e("1f2b"),z=e.n(_),A=e("9004"),C=e.n(A),H=e("0425"),P=e.n(H),M=e("5207"),I=e.n(M);function J(t){var n=t.addSlide();n.background={path:z.a},n.addImage({path:C.a,x:"40%",y:"40%",w:"70%",h:"20%"}),n.addText("敬拜讚美",{x:"40%",y:"40%",w:"50%",h:"20%",align:"center",shrinkText:!0,bold:!0,color:"FFFF00",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function U(t){var n=t.addSlide();n.background={fill:"0000FF"},n.addImage({path:P.a,x:"3%",y:"5%",w:.8,h:.8}),n.addImage({path:I.a,x:"85%",y:"5%",w:186/104*.7,h:.7});var e=327/982*100,o=100-e,r={x:"0%",y:"".concat(o,"%"),w:"100%",h:"".concat(e,"%")};return n.addShape(t.ShapeType.rect,Object(S["a"])(Object(S["a"])({},r),{},{fill:{color:"00FFFF",transparency:53}})),n}function D(t,n,e){var o=U(t);o.addText("【".concat(n,"】"),{x:"5%",y:"67%",w:"45%",h:"28%",align:"left",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"}),e&&o.addText("".concat(e),{x:"50%",y:"67%",w:"45%",h:"28%",align:"center",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:24,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function L(t,n){var e=U(t);e.addText(n,{x:"0%",y:"67%",w:"100%",h:"28%",align:"center",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function V(t,n,e,o){D(t,n,e);for(var r=o.split("\n").map((function(t){return t.trim()})).filter((function(t){return t.length>0})),a=0;a<r.length;a++){var c=r[a];if(a+1<r.length){var i=r[a+1];i.match(/^[\d副]/)||(c+="\n",c+=i,a++)}L(t,c)}}var B=function(t){var n=new T["a"];return n.layout="LAYOUT_16x9",J(n),{addSong:function(t,e,o){return V(n,t,e,o)},save:function(){return n.writeFile(t)},saveBlob:function(){return n.write("blob")}}},K=e("aeb1"),$=e.n(K),N={data:function(){return{songCount:1,downloading:!1}},components:{"add-song-form":k},computed:{songs:function(){for(var t=[],n=1;n<=this.songCount;n++){var e={name:this.$refs["addSongForm"+n].name,copyright:this.$refs["addSongForm"+n].copyright,lyrics:this.$refs["addSongForm"+n].formattedLyrics};t.push(e)}return t.filter((function(t){return t.name&&t.lyrics}))}},methods:{download:function(){var t=this;this.downloading=!0;var n=B();0!=this.songs.length?(this.songs.forEach((function(t){n.addSong(t.name,t.copyright,t.lyrics)})),n.saveBlob().then((function(t){var n="application/vnd.openxmlformats-officedocument.presentationml.presentation";return $()(t,"詩歌.pptx",n)})).then((function(){t.downloading=!1}))):alert("請加入最少一首詩歌。")}}};e("e95c");N.render=b,N.__scopeId="data-v-1564af2d";var q=N,E={name:"App",components:{"main-page":q}};E.render=r;var G=E;Object(o["b"])(G).mount("#app")},5853:function(t,n,e){},9004:function(t,n,e){t.exports=e.p+"img/cover_text_background.fa02efe2.png"},e95c:function(t,n,e){"use strict";e("5853")}});
//# sourceMappingURL=app.81c68f22.js.map