(this.webpackJsonpmydraw=this.webpackJsonpmydraw||[]).push([[0],[,,,,,function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return o}));var r=n(1);function c(e){return Object(r.a)(Object(r.a)({},e),{},{__TYPE__:"DrawElementConfig"})}function o(e){return"object"===typeof e&&null!=e&&"DrawElementConfig"===Reflect.get(e,"__TYPE__")}},,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){var r={"./Draw.element.ts":27,"./Line.element.ts":22,"./Rect.element.ts":23};function c(e){var t=o(e);return n(t)}function o(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}c.keys=function(){return Object.keys(r)},c.resolve=o,e.exports=c,c.id=21},function(e,t,n){"use strict";n.r(t),n.d(t,"config",(function(){return c}));var r=n(5),c=Object(r.a)({name:"Line",draw:function(e,t){t.lineWidth=4,t.strokeStyle=e.color,t.beginPath(),t.moveTo(e.x0,e.y0),t.lineTo(e.x1,e.y1),t.stroke()},onCreate:function(e,t){return{color:"#000000",x0:e,y0:t,x1:e,y1:t}},onDrawing:function(e,t,n){return{x1:n.x1+e,y1:n.y1+t}}})},function(e,t,n){"use strict";n.r(t),n.d(t,"config",(function(){return c}));var r=n(5),c=Object(r.a)({name:"Rect",draw:function(e,t){t.lineWidth=4,t.strokeStyle=e.strokeColor,t.fillStyle=e.backgroundColor,t.beginPath(),t.rect(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0),t.fill(),t.stroke()},onCreate:function(e,t){return{backgroundColor:"pink",strokeColor:"black",x0:e,y0:t,x1:e,y1:t}},onDrawing:function(e,t,n){return{x1:n.x1+e,y1:n.y1+t}}})},function(e,t,n){},,function(e,t,n){"use strict";n.r(t);var r,c=n(2),o=n.n(c),a=n(11),i=n.n(a),u=(n(19),n(4)),l=n(1),s=(n(20),n(5));function f(){return(e=n(21),e.keys().map(e)).map((function(e){return function(e){if("object"!==typeof e||null==e||!Object(s.b)(Reflect.get(e,"config")))throw new TypeError("*.element.ts files must be a module exporting `config` object")}(e),e.config}));var e}var d=0;n(24);var b=n(3);function v(e){return Object(b.jsx)("div",{className:"Island"+(e.className?" ".concat(e.className):""),children:e.children})}var j=n(13),h=n(14),O=n(0),p=n(7);function m(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return{value:e,next:n,prev:t}}var w=Object(p.a)("maxLength"),E=Object(p.a)("size"),g=Object(p.a)("head"),y=Object(p.a)("curNode"),x=function(){function e(t,n){Object(j.a)(this,e),Object.defineProperty(this,w,{writable:!0,value:void 0}),Object.defineProperty(this,E,{writable:!0,value:1}),Object.defineProperty(this,g,{writable:!0,value:void 0}),Object.defineProperty(this,y,{writable:!0,value:void 0}),Object(O.a)(this,g)[g]=Object(O.a)(this,y)[y]=m(t),Object(O.a)(this,w)[w]=n}return Object(h.a)(e,[{key:"get",value:function(){return Object(O.a)(this,y)[y].value}},{key:"push",value:function(e){var t=m(e,Object(O.a)(this,y)[y]);for(Object(O.a)(this,y)[y].next=t,Object(O.a)(this,y)[y]=t,Object(O.a)(this,E)[E]++;Object(O.a)(this,E)[E]>Object(O.a)(this,w)[w]&&Object(O.a)(this,g)[g].next;)Object(O.a)(this,y)[y]===Object(O.a)(this,g)[g]&&Object(O.a)(this,y)[y].next&&(Object(O.a)(this,y)[y]=Object(O.a)(this,y)[y].next,Object(O.a)(this,y)[y].prev=null),Object(O.a)(this,g)[g]=Object(O.a)(this,g)[g].next,Object(O.a)(this,g)[g].prev=null,Object(O.a)(this,E)[E]--;return this}},{key:"goBack",value:function(){return null!=Object(O.a)(this,y)[y].prev&&(Object(O.a)(this,y)[y]=Object(O.a)(this,y)[y].prev,Object(O.a)(this,E)[E]--),this}},{key:"goForward",value:function(){return null!=Object(O.a)(this,y)[y].next&&(Object(O.a)(this,y)[y]=Object(O.a)(this,y)[y].next,Object(O.a)(this,E)[E]++),this}},{key:"hasPrev",value:function(){return null!=Object(O.a)(this,y)[y].prev}},{key:"hasNext",value:function(){return null!=Object(O.a)(this,y)[y].next}}],[{key:"of",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100;return new e(t,n)}}]),e}(),P=null!=r?r:r=f().reduce((function(e,t){return e[t.name]=t,e}),{}),k=Object.keys(P),D={drawElements:[],draftElement:null,activeTool:k[0],scrollPoint:[0,0]};function C(e){return{type:"setDrawElements",drawElements:e}}function L(e,t){switch(t.type){case"createDraftElement":return Object(l.a)(Object(l.a)({},e),{},{draftElement:t.element});case"updateDraftElement":return e.draftElement?Object(l.a)(Object(l.a)({},e),{},{draftElement:Object(l.a)(Object(l.a)({},e.draftElement),{},{props:Object(l.a)(Object(l.a)({},e.draftElement.props),t.props)})}):e;case"saveDraftElement":return e.draftElement?Object(l.a)(Object(l.a)({},e),{},{drawElements:e.drawElements.concat(e.draftElement),draftElement:null}):e;case"setActiveTool":return Object(l.a)(Object(l.a)({},e),{},{activeTool:t.tool});case"setDrawElements":return Object(l.a)(Object(l.a)({},e),{},{drawElements:t.drawElements});case"updateScrollPoint":return Object(l.a)(Object(l.a)({},e),{},{scrollPoint:[e.scrollPoint[0]+t.scrollPointShift[0],e.scrollPoint[1]+t.scrollPointShift[1]]})}}var N=function(){var e=Object(c.useRef)(null),t=Object(c.useReducer)(L,D),n=Object(u.a)(t,2),r=n[0],o=n[1],a=function(e){var t=Object(c.useState)((function(){return x.of(e)})),n=Object(u.a)(t,1)[0],r=Object(c.useState)(n.hasNext()),o=Object(u.a)(r,2),a=o[0],i=o[1],l=Object(c.useState)(n.hasPrev()),s=Object(u.a)(l,2),f=s[0],d=s[1];return Object(c.useEffect)((function(){n.get()!==e&&(n.push(e),d(n.hasPrev()),i(n.hasNext()))}),[n,e]),{hasPrev:f,hasNext:a,goBack:function(){return n.goBack(),d(n.hasPrev()),i(n.hasNext()),n.get()},goForward:function(){return n.goForward(),d(n.hasPrev()),i(n.hasNext()),n.get()}}}(r.drawElements);!function(e,t){var n=Object(c.useRef)(e);n.current=e,Object(c.useEffect)((function(){function e(){var e=t.current;if(e){var r=window.devicePixelRatio||1;e.width=window.innerWidth*r,e.height=window.innerHeight*r,e.style.width=window.innerWidth+"px",e.style.height=window.innerHeight+"px";var c=e.getContext("2d");null!=c&&(c.scale(r,r),T(c,n.current.drawElements,n.current.draftElement,n.current.scrollPoint))}}return window.addEventListener("resize",e),e(),function(){window.removeEventListener("resize",e)}}),[t])}(r,e);var i=Object(c.useRef)(r.draftElement);return i.current=r.draftElement,Object(c.useEffect)((function(){var t=P[r.activeTool],n=0,c=0;function a(a){a.target===e.current&&(n=a.clientX,c=a.clientY,1===a.buttons&&(o({type:"createDraftElement",element:{id:(d++,(Date.now()+d).toString(32)),type:r.activeTool,props:t.onCreate(a.clientX-r.scrollPoint[0],a.clientY-r.scrollPoint[1])}}),document.addEventListener("pointermove",s),document.addEventListener("pointerup",f)),4===a.buttons&&(document.addEventListener("pointermove",u),document.addEventListener("pointerup",l)))}function u(e){var t=e.clientX-n,r=e.clientY-c;o({type:"updateScrollPoint",scrollPointShift:[t,r]}),n=e.clientX,c=e.clientY}function l(){document.removeEventListener("pointermove",u),document.removeEventListener("pointerup",l)}function s(e){null!=i.current&&(o({type:"updateDraftElement",props:t.onDrawing(e.clientX-n,e.clientY-c,i.current.props)}),n=e.clientX,c=e.clientY)}function f(){o({type:"saveDraftElement"}),document.removeEventListener("pointermove",s),document.removeEventListener("pointerup",f)}return document.addEventListener("pointerdown",a),function(){document.removeEventListener("pointerdown",a)}}),[r.activeTool,r.scrollPoint]),Object(c.useEffect)((function(){var t,n=null===(t=e.current)||void 0===t?void 0:t.getContext("2d");null!=n&&T(n,r.drawElements,r.draftElement,r.scrollPoint)}),[r.drawElements,r.draftElement,r.scrollPoint]),Object(b.jsxs)("div",{className:"App",children:[Object(b.jsx)(v,{className:"App__toolbar",children:k.map((function(e){return Object(b.jsx)("button",{disabled:r.activeTool===e,onClick:function(){return o({type:"setActiveTool",tool:e})},children:e},e)}))}),Object(b.jsxs)(v,{className:"App__toolbar",children:[Object(b.jsx)("button",{disabled:!a.hasPrev,onClick:function(){if(a.hasPrev){var e=a.goBack();o(C(e))}},children:"\u2190"}),Object(b.jsx)("button",{disabled:!a.hasNext,onClick:function(){if(a.hasNext){var e=a.goForward();o(C(e))}},children:"\u2192"})]}),Object(b.jsx)("canvas",{className:"App__canvas",ref:e})]})};function T(e,t,n,r){var c=Object(u.a)(r,2),o=c[0],a=c[1];e.clearRect(0,0,e.canvas.width,e.canvas.height),e.translate(o,a),t.forEach((function(t){P[t.type].draw(t.props,e)})),n&&P[n.type].draw(n.props,e),e.translate(-o,-a)}var _=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,28)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,o=t.getLCP,a=t.getTTFB;n(e),r(e),c(e),o(e),a(e)}))};i.a.render(Object(b.jsx)(o.a.StrictMode,{children:Object(b.jsx)(N,{})}),document.getElementById("root")),_()},function(e,t,n){"use strict";n.r(t),n.d(t,"config",(function(){return u}));var r=n(9),c=n(4),o=n(5),a=n(12);function i(e,t,n){var o=function(e){if(!e.length)return"";var t=e.reduce((function(e,t,n,r){var o=Object(c.a)(t,2),a=o[0],i=o[1],u=Object(c.a)(r[(n+1)%r.length],2),l=u[0],s=u[1];return e.push(a,i,(a+l)/2,(i+s)/2),e}),["M"].concat(Object(r.a)(e[0]),["Q"]));return t.push("Z"),t.join(" ")}(Object(a.a)(e));n.fillStyle=t,n.fill(new Path2D(o))}var u=Object(o.a)({name:"Draw",draw:function(e,t){0!==e.points.length&&i(e.points,e.color,t)},onCreate:function(e,t){return{color:"black",points:[[e,t]]}},onDrawing:function(e,t,n){var o=Object(c.a)(n.points[n.points.length-1],2),a=o[0],i=o[1];return{points:[].concat(Object(r.a)(n.points),[[a+e,i+t]])}}})}],[[26,1,2]]]);
//# sourceMappingURL=main.b089b2b8.chunk.js.map