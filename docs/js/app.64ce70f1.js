(function(t){function e(e){for(var r,a,i=e[0],l=e[1],u=e[2],f=0,d=[];f<i.length;f++)a=i[f],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&d.push(o[a][0]),o[a]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);s&&s(e);while(d.length)d.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var t,e=0;e<c.length;e++){for(var n=c[e],r=!0,i=1;i<n.length;i++){var l=n[i];0!==o[l]&&(r=!1)}r&&(c.splice(e--,1),t=a(a.s=n[0]))}return t}var r={},o={app:0},c=[];function a(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=r,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/twc-worship-pptx/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var s=l;c.push([1,"chunk-vendors"]),n()})({0:function(t,e){},"0425":function(t,e,n){t.exports=n.p+"img/ccma_logo_white.a178253e.png"},1:function(t,e,n){t.exports=n("56d7")},"1f2b":function(t,e,n){t.exports=n.p+"img/background.4f452f36.jpg"},2:function(t,e){},"2c67":function(t,e,n){"use strict";n("43a5")},"43a5":function(t,e,n){},5207:function(t,e,n){t.exports=n.p+"img/twc_logo.d76ef225.png"},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("7a23");function o(t,e,n,o,c,a){var i=Object(r["j"])("main-page");return Object(r["f"])(),Object(r["c"])(i)}n("4989"),n("ab8b");var c=Object(r["n"])("data-v-24872c8e");Object(r["h"])("data-v-24872c8e");var a={class:"navbar navbar-expand-lg navbar-light bg-light fixed-top"},i=Object(r["e"])("a",{class:"navbar-brand",href:"#"},[Object(r["e"])("h4",null,"詩歌PPT製作器"),Object(r["e"])("div",{class:"subtitle text-secondary"},"中華宣道會大圍堂")],-1),l={class:"container"},u={class:"card-header"},s={class:"card-body"},f={key:0,class:"card-footer"};Object(r["g"])();var d=c((function(t,e,n,o,c,d){var b=Object(r["j"])("add-song-form");return Object(r["f"])(),Object(r["c"])(r["a"],null,[Object(r["e"])("nav",a,[i,Object(r["e"])("button",{class:"btn btn-success float-right",onClick:e[1]||(e[1]=function(t){return d.download()})},"完成")]),Object(r["e"])("div",l,[(Object(r["f"])(!0),Object(r["c"])(r["a"],null,Object(r["i"])(c.songCount,(function(t){return Object(r["f"])(),Object(r["c"])("div",{key:t,class:"card my-4"},[Object(r["e"])("div",u,[Object(r["e"])("strong",null,"第 "+Object(r["k"])(t)+" 首",1)]),Object(r["e"])("div",s,[Object(r["e"])(b,{ref:"addSongForm"+t},null,512)]),t==c.songCount?(Object(r["f"])(),Object(r["c"])("div",f,[Object(r["e"])("button",{class:"btn btn-secondary float-right",onClick:e[2]||(e[2]=function(t){return c.songCount=c.songCount+1})}," 新增歌曲 ")])):Object(r["d"])("",!0)])})),128))])],64)})),b=(n("4de4"),n("4160"),n("b0c0"),n("159b"),{class:"form-group"}),p=Object(r["e"])("label",{for:"songName"},"歌名",-1),g={class:"form-group"},h=Object(r["e"])("label",{for:"lyrics"},"歌詞",-1),y={class:"form-group"},m=Object(r["e"])("label",{for:"copyright"},"版權",-1);function v(t,e,n,o,c,a){return Object(r["f"])(),Object(r["c"])("form",null,[Object(r["e"])("div",b,[p,Object(r["m"])(Object(r["e"])("input",{type:"text",class:"form-control",id:"songName","onUpdate:modelValue":e[1]||(e[1]=function(t){return c.name=t}),placeholder:"(請貼上歌名)"},null,512),[[r["l"],c.name]])]),Object(r["e"])("div",g,[h,Object(r["m"])(Object(r["e"])("textarea",{class:"form-control",id:"lyrics","onUpdate:modelValue":e[2]||(e[2]=function(t){return c.lyrics=t}),placeholder:"(請貼上歌詞)",rows:"10"},null,512),[[r["l"],c.lyrics]]),Object(r["e"])("button",{type:"button",class:"btn btn-outline-primary btn-sm float-right my-1",onClick:e[3]||(e[3]=function(t){return a.formatText()})},"整理歌詞")]),Object(r["e"])("div",y,[m,Object(r["m"])(Object(r["e"])("textarea",{class:"form-control copyright-input",id:"copyright","onUpdate:modelValue":e[4]||(e[4]=function(t){return c.copyright=t}),rows:"5",placeholder:"(請貼上版權內容)"},null,512),[[r["l"],c.copyright]])])])}n("99af"),n("a15b"),n("d81d"),n("13d5"),n("ac1f"),n("466d"),n("1276"),n("498a");var j=18;function O(t){if(t.length<=j)return[t];var e=t.match(/[  ,，.。;；]$/);e&&(t=t.substring(0,e.index));var n=[],r="",o="",c=t.substring(0,j).match(/.+[  ,，.。;；]/);return c?(r=c[0],o=t.substring(c[0].length)):(r=t.substring(0,j),o=t.substring(j)),e&&(o+=e[0]),n=n.concat(r),n=n.concat(o),n}var F={data:function(){return{name:"",copyright:"",lyrics:""}},computed:{formattedLyrics:function(){var t=this.lyrics.split("\n");return t=t.map((function(t){return t.trim()})).filter((function(t){return t.length>0})).reduce((function(t,e){return t.concat(O(e))}),[]),t.join("\n")}},methods:{formatText:function(){this.lyrics=this.formattedLyrics}}};F.render=v;var x=F,w=n("5530"),S=n("8f74"),k=n("1f2b"),T=n.n(k),_=n("9004"),z=n.n(_),C=n("0425"),P=n.n(C),H=n("5207"),M=n.n(H);function J(t){var e=t.addSlide();e.background={path:T.a},e.addImage({path:z.a,x:"40%",y:"40%",w:"70%",h:"20%"}),e.addText("敬拜讚美",{x:"40%",y:"40%",w:"50%",h:"20%",align:"center",shrinkText:!0,bold:!0,color:"FFFF00",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function I(t){var e=t.addSlide();e.background={fill:"0000FF"},e.addImage({path:P.a,x:"3%",y:"5%",w:.8,h:.8}),e.addImage({path:M.a,x:"85%",y:"5%",w:186/104*.7,h:.7});var n=327/982*100,r=100-n,o={x:"0%",y:"".concat(r,"%"),w:"100%",h:"".concat(n,"%")};return e.addShape(t.ShapeType.rect,Object(w["a"])(Object(w["a"])({},o),{},{fill:{color:"00FFFF",transparency:53}})),e}function K(t,e,n){var r=I(t);r.addText("【".concat(e,"】"),{x:"5%",y:"67%",w:"45%",h:"28%",align:"left",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"}),n&&r.addText("".concat(n),{x:"50%",y:"67%",w:"45%",h:"28%",align:"center",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:24,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function L(t,e){var n=I(t);n.addText(e,{x:"0%",y:"67%",w:"100%",h:"28%",align:"center",shrinkText:!0,bold:!0,color:"FFFFFF",fontFace:"Microsoft JhengHei",fontSize:36,glow:{size:10,color:"000000",transparency:0},shadow:{type:"outer",color:"7F7F7F",opacity:.47,angle:45,blur:3,offset:3},lang:"zh-HK"})}function U(t,e,n,r){K(t,e,n);for(var o=r.split("\n").map((function(t){return t.trim()})).filter((function(t){return t.length>0})),c=0;c<o.length;c++){var a=o[c];if(c+1<o.length){var i=o[c+1];i.match(/^[\d副]/)||(a+="\n",a+=i,c++)}L(t,a)}}var $=function(t){var e=new S["a"];return e.layout="LAYOUT_16x9",J(e),{addSong:function(t,n,r){return U(e,t,n,r)},save:function(){return e.writeFile(t)},saveBlob:function(){return e.write("blob")}}},V=n("aeb1"),A=n.n(V),B={data:function(){return{songCount:1}},components:{"add-song-form":x},computed:{songs:function(){for(var t=[],e=1;e<=this.songCount;e++){var n={name:this.$refs["addSongForm"+e].name,copyright:this.$refs["addSongForm"+e].copyright,lyrics:this.$refs["addSongForm"+e].formattedLyrics};t.push(n)}return t.filter((function(t){return t.name&&t.lyrics}))}},methods:{download:function(){var t=$();0!=this.songs.length?(this.songs.forEach((function(e){t.addSong(e.name,e.copyright,e.lyrics)})),t.saveBlob().then((function(t){console.log("Saved!",t),A()(t,"詩歌.pptx",t.type)}))):alert("請加入最少一首詩歌。")}}};n("2c67");B.render=d,B.__scopeId="data-v-24872c8e";var N=B,E={name:"App",components:{"main-page":N}};E.render=o;var Y=E;Object(r["b"])(Y).mount("#app")},9004:function(t,e,n){t.exports=n.p+"img/cover_text_background.fa02efe2.png"}});
//# sourceMappingURL=app.64ce70f1.js.map