import{O as h,S as L,a as M,P as _,W as z,b as k,c as V,d as y,e as C,M as W,f as O,g as U,C as j,V as v}from"./vendor.704e78be.js";const E=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const m of t.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&r(m)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}};E();var F=`precision mediump float;

uniform float u_time;

varying vec2 UV;

void main(){
	UV = uv;
	vec4 mvPosition = modelViewMatrix*vec4(position,1.);
	gl_Position = projectionMatrix*mvPosition;
}`,H=`precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

varying vec2 UV;

void main(void){
	vec2 position = UV * 2. - 1.;
	
	float red = abs( 
		sin(position.x * position.y + u_time / 5.)
	);
	float green = abs( 
		sin(position.x * position.y + u_time / 4.) 
	);
	float blue = abs( 
		sin(position.x * position.y + u_time / 3.) 
	);

	gl_FragColor=vec4(UV.x, UV.y, 0., 1.0);
}`;let n,s,u,R=new j,i,f,d=new h,o=new h,w,g;function N(){I(),D(),$()}function D(){f=new L,document.body.appendChild(f.dom)}function I(){s=new M,u=new _(75,window.innerWidth/window.innerHeight,.1,1e3),u.position.z=6,u.position.x=1.5,n=new z,n.shadowMap.enabled=!0,n.shadowMap.type=k,n.setPixelRatio(window.devicePixelRatio),n.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(n.domElement);const c=.25;i=new V(16777215),i.position.set(-.5,.5,3.5),i.castShadow=!0,i.intensity=c,s.add(i);const a=i.clone();a.intensity=1-c,a.castShadow=!1,s.add(a);const l=1024,r=.5,e=500;i.shadow.mapSize.width=l,i.shadow.mapSize.height=l,i.shadow.camera.near=r,i.shadow.camera.far=e,new y().load("../resources/kaws.obj",p=>{d=p,d.scale.x=1,d.scale.y=1,d.scale.z=1,d.position.x=5,d.position.y=-2,s.add(d)}),new y().load("../resources/face.obj",p=>{o=p,o.castShadow=!0,o.scale.x=20,o.scale.y=20,o.scale.z=20,o.position.x=-2,o.rotateY(.5),s.add(o)});const P=new C(6,6,1,1),b=new W({color:6710886}),x={u_time:{type:"f",value:1},u_resolution:{type:"v2",value:new v(800,800)},u_mouse:{type:"v2",value:new v}};g=new O({uniforms:x,vertexShader:F,fragmentShader:H}),w=new U(P,b),w.position.z=-2,w.scale.x=window.innerWidth,w.scale.y=window.innerHeight,w.receiveShadow=!0,s.add(w),S()}function $(){window.addEventListener("resize",q,!1),window.addEventListener("keydown",c=>{const{key:a}=c;switch(a){case"e":const l=window.open("","Canvas Image"),{domElement:r}=n;n.render(s,u);const e=r.toDataURL();if(!l)return;l.document.write(`<img src='${e}' width='${r.width}' height='${r.height}'>`);break}})}function q(){u.aspect=window.innerWidth/window.innerHeight,u.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)}function S(){requestAnimationFrame(()=>{S()});let c=R.getDelta();g.uniforms.u_time.value+=c,d.rotation.y+=.01,o.rotation.y+=.005,o.rotation.x+=.005,f&&f.update(),n.render(s,u)}N();
