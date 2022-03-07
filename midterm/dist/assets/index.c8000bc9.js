import{C as S,A as P,S as a,G as w,W as M,f as z,a as G,g as u}from"./vendor.de0e4fd1.js";const H=function(){const h=document.createElement("link").relList;if(h&&h.supports&&h.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))o(d);new MutationObserver(d=>{for(const n of d)if(n.type==="childList")for(const v of n.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&o(v)}).observe(document,{childList:!0,subtree:!0});function E(d){const n={};return d.integrity&&(n.integrity=d.integrity),d.referrerpolicy&&(n.referrerPolicy=d.referrerpolicy),d.crossorigin==="use-credentials"?n.credentials="include":d.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(d){if(d.ep)return;d.ep=!0;const n=E(d);fetch(d.href,n)}};H();let g=new S,y=new S,f=new S,p=new S,m=new S,l=window.innerWidth,i=window.innerHeight;const N=r=>new Promise(h=>{r.loader.add("filter","assets/filter.png").add("moon","assets/moon.png").add("cloud","assets/cloud.png").add("bg","assets/bg.jpg").add("bg2","assets/bg2.jpg").add("sun","assets/sun.png").add("frame","assets/frame.png").load(()=>{h()})}),T=async()=>{let r=new P({antialias:!0});document.body.style.margin="0",r.renderer.view.style.position="absolute",r.renderer.view.style.display="block",r.renderer.resize(window.innerWidth,window.innerHeight),await N(r),window.addEventListener("resize",o=>{r.renderer.resize(window.innerWidth,window.innerHeight)}),h(),r.stage.addChild(m),r.stage.addChild(f),r.stage.addChild(y),r.stage.addChild(g),r.stage.addChild(p);function h(){const o=a.from("assets/frame.png");o.scale.set(.6),o.anchor.set(.5),o.x=l/2,o.y=i/2;const d=new w;d.beginFill(0),d.drawCircle(0,0,100),p.addChild(d),r.stage.interactive=!0,r.stage.mask=d,r.stage.on("pointermove",v),r.stage.on("pointerdown",n);function n(){p.children.includes(d)?(p.removeChild(d),p.addChild(o),f.removeChild(s),f.addChild(c),m.removeChild(C),m.addChild(b),r.stage.mask=null):(p.removeChild(o),p.addChild(d),f.removeChild(c),f.addChild(s),m.removeChild(b),m.addChild(C),r.stage.mask=d)}function v(t){let e=t.data.global;d.x=e.x,d.y=e.y,o.x=e.x,o.y=e.y}const b=a.from("assets/bg.jpg");b.anchor.set(.5),b.position.set(r.screen.width/2,r.screen.height/2),b.scale.set(.3);const C=a.from("assets/bg2.jpg");C.anchor.set(.5),C.position.set(r.screen.width/2,r.screen.height/2),C.scale.set(2),m.addChild(C);const x=a.from("assets/filter.png");f.addChild(x),x.texture.baseTexture.wrapMode=M.REPEAT;const O=new z.DisplacementFilter(x),F=new G;F.slices=30,F.fillMode=1,f.filters=[F],r.ticker.add(function(){x.x+=3,x.y+=3});let c=a.from("assets/moon.png");c.scale.set(.3),c.x=l/2-300,c.y=i/2+500,c.interactive=!0,c.on("pointerover",function(){F.refresh()});let s=a.from("assets/sun.png");s.scale.set(.06),s.x=l/2-250,s.y=i/2+500,s.interactive=!0,s.on("pointerover",function(){F.refresh()}),f.addChild(s),u.to(c,{y:140,duration:4}),u.to(s,{y:200,duration:4});let k=a.from("assets/cloud.png");k.scale.set(.2),k.x=l/2-720,k.y=i/2-320,y.addChild(k);let L=a.from("assets/cloud.png");L.scale.set(.2),L.x=l/2-180,L.y=i/2-360,y.addChild(L);let W=a.from("assets/cloud.png");W.scale.set(.2),W.x=l/2-450,W.y=i/2-250,y.addChild(W);let j=a.from("assets/cloud.png");j.scale.set(.2),j.x=l/2+200,j.y=i/2-300,y.addChild(j);let A=a.from("assets/cloud.png");A.scale.set(.2),A.x=l/2+400,A.y=i/2-200,y.addChild(A),y.filters=[O];for(let t=0;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+180,100),e.drawCircle(t,i/2+180,70),e.drawCircle(t,i/2+180,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2})}for(let t=50;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+250,100),e.drawCircle(t,i/2+250,70),e.drawCircle(t,i/2+250,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2,delay:1})}for(let t=0;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+330,100),e.drawCircle(t,i/2+330,70),e.drawCircle(t,i/2+330,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2,delay:2})}for(let t=50;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+400,100),e.drawCircle(t,i/2+400,70),e.drawCircle(t,i/2+400,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2,delay:1})}for(let t=0;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+470,100),e.drawCircle(t,i/2+470,70),e.drawCircle(t,i/2+470,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2,delay:2})}for(let t=50;t<l+200;t+=200){let e=new w;e.lineStyle(6,16777215),e.beginFill(2902925),e.drawCircle(t,i/2+540,100),e.drawCircle(t,i/2+540,70),e.drawCircle(t,i/2+540,40),g.addChild(e),u.to(e,{y:-20,yoyo:!0,repeat:-1,duration:2,delay:1})}}document.body.appendChild(r.view);let E={};r.ticker.add(D,E)};function D(r){}T();
