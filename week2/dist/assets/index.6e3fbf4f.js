import{A as l,G as s}from"./vendor.e238bf30.js";const w=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const t of r)if(t.type==="childList")for(const d of t.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function e(r){const t={};return r.integrity&&(t.integrity=r.integrity),r.referrerpolicy&&(t.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?t.credentials="include":r.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(r){if(r.ep)return;r.ep=!0;const t=e(r);fetch(r.href,t)}};w();const c=async()=>{let o=new l({backgroundColor:14938076});document.body.style.margin="0",o.renderer.view.style.position="absolute",o.renderer.view.style.display="block",o.renderer.resize(window.innerWidth,window.innerHeight);let n=new s;for(let e=20;e<window.innerHeight;e+=108)for(let i=30;i<window.innerWidth-100;i+=100)n.beginFill(5455426,1),n.drawRect(i,e,100,15);for(let e=35;e<window.innerHeight-50;e+=120)for(let i=70;i<window.innerWidth-130;i+=200)n.beginFill(16777130,1),n.drawRect(i,e,95,95);for(let e=60;e<window.innerHeight;e+=105)for(let i=180;i<window.innerWidth-130;i+=200)n.beginFill(7518902,1),n.drawRect(i,e,75,75);for(let e=80;e<window.innerHeight;e+=120)for(let i=120;i<window.innerWidth-100;i+=200)n.beginFill(7518902,1),n.drawCircle(i,e,35);for(let e=97;e<window.innerHeight;e+=105)for(let i=217;i<window.innerWidth-100;i+=200)n.beginFill(16777130,1),n.drawCircle(i,e,20);o.stage.addChild(n),window.addEventListener("resize",e=>{o.renderer.resize(window.innerWidth,window.innerHeight)}),document.body.appendChild(o.view)};c();
