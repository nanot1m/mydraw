(this.webpackJsonpmydraw=this.webpackJsonpmydraw||[]).push([[0],[,,,function(e,t,n){"use strict";function r(e){return e}var o;function c(){return null!=o?o:o=function(){return(e=n(13),e.keys().map(e)).map((function(e){return e.config}));var e}().reduce((function(e,t){return e[t.name]=t,e}),{})}n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return c}))},,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){var r={"./Line.element.ts":14,"./Rect.element.ts":15};function o(e){var t=c(e);return n(t)}function c(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}o.keys=function(){return Object.keys(r)},o.resolve=c,e.exports=o,o.id=13},function(e,t,n){"use strict";n.r(t),n.d(t,"config",(function(){return o}));var r=n(3),o=Object(r.a)({name:"Line",draw:function(e,t){console.log(e),t.strokeStyle=e.color,t.beginPath(),t.moveTo(e.x0,e.y0),t.lineTo(e.x1,e.y1),t.stroke()},onCreate:function(e,t){return{color:"#000000",x0:e,y0:t,x1:e,y1:t}},onPointerMove:function(e,t,n){return{x1:n.x1+e,y1:n.y1+t}}})},function(e,t,n){"use strict";n.r(t),n.d(t,"config",(function(){return o}));var r=n(3),o=Object(r.a)({name:"Rect",draw:function(e,t){t.strokeStyle=e.strokeColor,t.fillStyle=e.backgroundColor,t.beginPath(),t.rect(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0),t.fill(),t.stroke()},onCreate:function(e,t){return{backgroundColor:"pink",strokeColor:"black",x0:e,y0:t,x1:e,y1:t}},onPointerMove:function(e,t,n){return{x1:n.x1+e,y1:n.y1+t}}})},,function(e,t,n){"use strict";n.r(t);var r=n(1),o=n.n(r),c=n(5),i=n.n(c),a=(n(11),n(6)),u=n(0),l=(n(12),n(3)),d=0;var s=n(2),f={drawElements:[],draftElement:null,activeTool:"Line"};function m(e){return{type:"setActiveTool",tool:e}}function v(e,t){switch(t.type){case"createDraftElement":return Object(u.a)(Object(u.a)({},e),{},{draftElement:t.element});case"updateDraftElement":return e.draftElement?Object(u.a)(Object(u.a)({},e),{},{draftElement:Object(u.a)(Object(u.a)({},e.draftElement),{},{props:Object(u.a)(Object(u.a)({},e.draftElement.props),t.props)})}):e;case"saveDraftElement":return e.draftElement?Object(u.a)(Object(u.a)({},e),{},{drawElements:e.drawElements.concat(e.draftElement),draftElement:null}):e;case"setActiveTool":return Object(u.a)(Object(u.a)({},e),{},{activeTool:t.tool})}}var p=Object(l.b)();var b=function(){var e=Object(r.useRef)(null),t=Object(r.useReducer)(v,f),n=Object(a.a)(t,2),o=n[0],c=n[1];Object(r.useEffect)((function(){function t(){var t,n=e.current;if(n){var r=window.devicePixelRatio||1;n.width=window.innerWidth*r,n.height=window.innerHeight*r,n.style.width=window.innerWidth+"px",n.style.height=window.innerHeight+"px",null===(t=n.getContext("2d"))||void 0===t||t.scale(r,r)}}return window.addEventListener("resize",t),t(),function(){window.removeEventListener("resize",t)}}),[]);var i=Object(r.useRef)(o.draftElement);return i.current=o.draftElement,Object(r.useEffect)((function(){var e=p[o.activeTool],t=0,n=0;function r(r){null!=i.current&&(c({type:"updateDraftElement",props:e.onPointerMove(r.clientX-t,r.clientY-n,i.current.props)}),t=r.clientX,n=r.clientY)}function a(i){t=i.clientX,n=i.clientY,c({type:"createDraftElement",element:{id:(d++,(Date.now()+d).toString(32)),type:o.activeTool,props:e.onCreate(i.clientX,i.clientY)}}),document.addEventListener("pointermove",r)}function u(){c({type:"saveDraftElement"}),document.removeEventListener("pointermove",r)}return document.addEventListener("pointerdown",a),document.addEventListener("pointerup",u),function(){document.removeEventListener("pointerdown",a),document.removeEventListener("pointerup",u)}}),[o.activeTool]),Object(r.useEffect)((function(){var t=e.current;if(null!=t){var n=t.getContext("2d");null!=n&&(n.clearRect(0,0,t.width,t.height),o.drawElements.forEach((function(e){p[e.type].draw(e.props,n)})),o.draftElement&&p[o.draftElement.type].draw(o.draftElement.props,n))}}),[o.drawElements,o.draftElement]),Object(s.jsxs)("div",{className:"App",children:[Object(s.jsxs)("div",{className:"App__toolbar",children:[Object(s.jsx)("button",{disabled:"Line"===o.activeTool,onClick:function(){return c(m("Line"))},children:"L"}),Object(s.jsx)("button",{disabled:"Rect"===o.activeTool,onClick:function(){return c(m("Rect"))},children:"R"})]}),Object(s.jsx)("canvas",{className:"App__canvas",ref:e})]})},E=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(t){var n=t.getCLS,r=t.getFID,o=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),r(e),o(e),c(e),i(e)}))};i.a.render(Object(s.jsx)(o.a.StrictMode,{children:Object(s.jsx)(b,{})}),document.getElementById("root")),E()}],[[17,1,2]]]);
//# sourceMappingURL=main.c5e53fe5.chunk.js.map