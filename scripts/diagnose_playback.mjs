// Measure the real Electron output graph. The meter emits only silence; no microphone or user session is used.
import { baselineSession, baselineResult, pulseWav } from '../tests/e2e/fixtures.js';
import { _electron as electron } from 'playwright';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
import fs from 'node:fs';
import http from 'node:http';
const root=fs.mkdtempSync(path.join(os.tmpdir(), 'practice-lab-audio-audit-')) + path.sep;
const wav=pulseWav();
const stemWavs=Object.fromEntries(["vocals", "drums", "bass", "other"].map((name,i)=>[name,pulseWav(8,44100,[220,470,82.4,659.25][i])]));
const originalWav=wav;
const beats=Array.from({length:12},(_,i)=>1+i*.5);
const fixtureResult={...baselineResult,duration:8,beats,downbeats:[1,3,5],sections:[{label:'verse',start_time:1,end_time:4,start_bar:1,end_bar:2,bar_count:2}]};
const server=http.createServer((req,res)=>{
 const url=req.url.split('?')[0];
 const json=url==='/healthz'?{ok:true}:url==='/results/manifest.json'?[baselineSession]:url==='/results/e2e-baseline.json'?fixtureResult:url.endsWith('/library')?{tags:[]}:url==='/library/folders'?[]:null;
 if(json){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(json));return;}
 if(url.startsWith('/audio/')||url.startsWith('/stems/')){const name=url.match(/\/(vocals|drums|bass|other)\./)?.[1];const wav=stemWavs[name]??originalWav;res.setHeader('Content-Type','audio/wav');res.setHeader('Accept-Ranges','bytes');const match=req.headers.range?.match(/bytes=(\d+)-(\d*)/);if(match){const start=Number(match[1]),end=match[2]?Number(match[2]):wav.length-1;res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${wav.length}`);res.setHeader('Content-Length',end-start+1);res.end(wav.subarray(start,end+1));}else{res.setHeader('Content-Length',wav.length);res.end(wav);}return;}
 const file=url==='/probe-worklet.js'?path.join(repository, 'tests/audio/meter.js'):path.join(repository, 'public')+'/'+(url==='/'?'index.html':url);
 try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.statusCode=404;res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const app=await electron.launch({args:[path.join(repository, 'tests/audio/electron.cjs')],executablePath:require('electron'),env:{...process.env,PRACTICE_LAB_AUDIO_PROBE_PROFILE:path.join(root,'profile')}});
const page=await app.firstWindow();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
try {
await page.addInitScript(()=>{
 localStorage.clear();
 window.__probe={events:[],clocks:[],operations:[],players:[],parts:[],label:'init'};
 const p=window.__probe,Native=window.AudioContext,connect=AudioNode.prototype.connect;
 const NativeAudio = window.Audio;
 window.Audio = function(...args){const media=new NativeAudio(...args);p.parts.push(media);return media;};
 window.Audio.prototype=NativeAudio.prototype;
 window.AudioContext=class extends Native {
  constructor(...args){
   super(...args);
   this._merger=this.createChannelMerger(6);
   const zero=this.createGain();zero.gain.value=0;
   connect.call(this._merger,zero);connect.call(zero,this.destination);
   this._ready=this.audioWorklet.addModule('/probe-worklet.js').then(()=>{
    const tap=new AudioWorkletNode(this,'measure',{outputChannelCount:[6]});
    tap.port.onmessage=e=>p.events.push({...e.data,label:p.label});
    connect.call(this._merger,tap);connect.call(tap,zero);
   }).catch(error=>{if(this.state!=="closed")throw error;});
  }
  createMediaElementSource(media){p.ctx=this;p.ready=this._ready;const node=super.createMediaElementSource(media);node._probeMedia=media;p.players.push(media);return node;}
 };
 AudioNode.prototype.connect=function(target,...args){
  if(this._probeMedia){const name=this._probeMedia.dataset.stem;this._probeChannel=name?1+['vocals','drums','bass','other'].indexOf(name):0;}
  if(target===this.context.destination&&this.context._merger){
   return connect.call(this,this.context._merger,0,this._probeChannel??5);
  }
  if(this._probeChannel!==undefined)target._probeChannel=this instanceof ChannelSplitterNode?(args[0]===this.numberOfOutputs-1?5:Math.floor((args[0]??0)/2)):this._probeChannel;
  return connect.call(this,target,...args);
 };
 setInterval(()=>{if(p.ctx)p.clocks.push({t:p.ctx.currentTime,label:p.label,latency:p.ctx.outputLatency,players:[...new Set([...p.players,...p.parts.filter(m=>m.dataset.stem)])].map(m=>({src:m.src,time:m.currentTime,rate:m.playbackRate,paused:m.paused,seeking:m.seeking,volume:m.volume,muted:m.muted}))});},100);
});
await page.goto('http://127.0.0.1:'+server.address().port+'/');
await page.locator('#btn-play').waitFor({state:'visible'});
await page.waitForFunction(()=>!document.querySelector('#btn-play').disabled);
await page.evaluate(()=>window.__probe.ready);
await page.locator('#btn-metro').click();
const mark=async label=>{console.log(label);await page.evaluate(label=>{const p=window.__probe;p.label=label;p.operations.push({label,t:p.ctx.currentTime});},label);};
const wait=async ms=>{await page.waitForTimeout(ms);fs.writeFileSync(root+'matrix-partial.json',JSON.stringify(await page.evaluate(()=>({events:window.__probe.events,clocks:window.__probe.clocks,operations:window.__probe.operations}))));};
const seek=async second=>{const b=await page.locator('#waveform').boundingBox();await page.mouse.click(b.x+b.width*second/8,b.y+b.height*.5);};
const drag=async(a,b)=>{const box=await page.locator('#waveform').boundingBox();await page.mouse.move(box.x+box.width*a/8,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*b/8,box.y+box.height*.5,{steps:8});await page.mouse.up();};
await page.evaluate(()=>localStorage.clear());
await mark('normal');await page.locator('#btn-play').click();await wait(4000);
await mark('rate-070');await page.locator('#playback-rate').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},'0.70');await seek(.4);await wait(7500);
await mark('seek-back-070');await seek(1.2);await wait(3500);
await mark('seek-forward-070');await seek(4.2);await wait(3500);
await mark('range-loop-070');await page.locator('#btn-loop').click();await drag(1.2,3.8);await wait(12500);
await mark('move-range-070');await drag(2,3);await wait(10000);
await mark('resize-range-070');const h=page.locator('[data-loop-handle="start"]');const hb=await h.boundingBox();await page.mouse.move(hb.x+hb.width/2,hb.y+hb.height/2);await page.mouse.down();await page.mouse.move(hb.x-40,hb.y+hb.height/2,{steps:8});await page.mouse.up();await wait(7000);
await mark('rate-050-loop');await page.locator('#playback-rate').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},'0.50');await wait(12000);
await mark('rate-075-loop');await page.locator('#playback-rate').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},'0.75');await wait(10000);
await page.locator('#click-sound').selectOption('wood');await mark('rate-100-loop-wood');await page.locator('#playback-rate').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},'1.00');await wait(8000);
await mark('rate-025-loop');await page.locator('#playback-rate').evaluate(el=>{el.value='0.25';el.dispatchEvent(new Event('input',{bubbles:true}));});await wait(26000);
await page.locator('#click-sound').selectOption('hihat');await mark('rate-125-loop-hihat');await page.locator('#playback-rate').evaluate(el=>{el.value='1.25';el.dispatchEvent(new Event('input',{bubbles:true}));});await wait(9000);
await mark('on-beat-loop');await page.locator('#playback-rate').evaluate(el=>{el.value='0.70';el.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#btn-clear-range').click();await drag(1,3);await wait(12000);
const result=await page.evaluate(()=>{const p=window.__probe;return {events:p.events,clocks:p.clocks,operations:p.operations,mediaSources:p.players.length};});
fs.writeFileSync(root+'matrix-result.json',JSON.stringify(result));
const summary = [];
assert.equal(result.mediaSources, 1, "Parts and click must share one media decoder");
assert.equal(new Set(result.operations.map(e=>e.label)).size, 13);
for (const label of new Set(result.events.map(e=>e.label))) {
 const events=result.events.filter(e=>e.label===label), clicks=events.filter(e=>e.ch===5&&!e.envelope);
 for (let channel=1;channel<=4;channel++) {
  const music=events.filter(e=>e.ch===channel);
  const differences=clicks.map(c=>music.reduce((best,m)=>Math.abs(c.t-m.t)<Math.abs(best)?c.t-m.t:best,Infinity)).filter(d=>Math.abs(d)<0.25);
  summary.push({label,part:["vocals","drums","bass","other"][channel-1],samples:differences.length,maximumMs:Math.max(...differences.map(Math.abs))*1000});
 }
}
const clickQuality=[];
for(const label of new Set(result.events.map(e=>e.label))){
 const active=result.events.filter(e=>e.label===label&&e.ch===5&&e.envelope).sort((a,b)=>a.t-b.t),groups=[];
 for(const event of active){const previous=groups.at(-1)?.at(-1);if(!previous||event.t-previous.t>.012)groups.push([event]);else groups.at(-1).push(event);}
 const durationsMs=groups.map(group=>(group.at(-1).t-group[0].t)*1000);
 clickQuality.push({label,samples:groups.length,maximumDurationMs:Math.max(...durationsMs)});
}
fs.writeFileSync(root+'summary.json',JSON.stringify({summary,clickQuality,errors},null,2));
console.log(JSON.stringify({output:root,summary,clickQuality,errors},null,2));
assert.deepEqual(errors,[]);
for(const row of summary){assert.ok(row.samples>=3,`${row.label}: missing PCM measurements`);assert.ok(row.maximumMs<10,`${row.label}: ${row.maximumMs.toFixed(1)}ms drift`);}
for(const row of clickQuality){assert.ok(row.samples>=3,`${row.label}: missing click envelopes`);assert.ok(row.maximumDurationMs<65,`${row.label}: click stretched to ${row.maximumDurationMs.toFixed(1)}ms`);}
} finally {await app.close();await new Promise(resolve=>server.close(resolve));}
