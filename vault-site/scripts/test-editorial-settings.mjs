import assert from 'node:assert/strict';
globalThis.HTMLElement=class {isConnected=true};
const {EditorialSettingsElement,baseFields,migrateV11,resolveSettings}=await import('../public/libro/edition/editorial-settings.mjs');
class TestComponent extends EditorialSettingsElement {render(){this.renders=(this.renders||0)+1;}}
const p=new TestComponent();
assert.equal(p.getResolvedSettings('mobile').orientation,'vertical');
assert.equal(p.getResolvedSettings('desktop').orientation,'horizontal');
let s=p.getSettings();s.base.titleInk='#abcdef';s.responsive.mobile.titleSize=28;
p.applySettings(JSON.stringify(s));
assert.equal(p.renders,1);assert.equal(p.getResolvedSettings('mobile').titleInk,'#abcdef');assert.equal(p.getResolvedSettings('desktop').titleInk,'#abcdef');
assert.equal(p.getResolvedSettings('mobile').titleSize,28);assert.equal(p.getResolvedSettings('desktop').titleSize,61);
delete s.responsive.mobile.titleSize;p.settings=s;assert.equal(p.getResolvedSettings('mobile').titleSize,61);
s.base.titleInk='#000000';assert.equal(p.settings.base.titleInk,'#abcdef');
const previous=p.settings;assert.throws(()=>p.applySettings({...previous,base:{width:999}}));assert.deepEqual(p.settings,previous);
assert.throws(()=>p.applySettings({...previous,base:{css:'body{}'}}));assert.throws(()=>p.applySettings({...previous,component:'combat'}));
class Child extends TestComponent {static componentType='book-dialogue';static editableProperties={...baseFields,portraitVisible:{type:'boolean',default:true}};}
const child=new Child();const config=child.settings;config.base.portraitVisible=false;child.applySettings(config);assert.equal(child.getResolvedSettings('mobile').portraitVisible,false);
const old=migrateV11({width:'47',capital:true,titleInk:'#123456',sceneText:'not part of style'});assert.equal(old.base.width,47);assert(!Object.hasOwn(old.base,'sceneText'));assert.equal(resolveSettings(old,'mobile').ratio,'9/16');
globalThis.fetch=async url=>({ok:true,json:async()=>previous});await p.loadSettings('/data/layout.json');assert.deepEqual(p.settings,previous);await p.loadSettings(JSON.stringify(previous));assert.deepEqual(p.settings,previous);
globalThis.fetch=async()=>({ok:false,status:404});await assert.rejects(p.loadSettings('/missing.json'));assert.deepEqual(p.settings,previous);
console.log('PASS: JSON round-trip, URL load, inheritance, per-view overrides, subclass schema, migration, invalid settings and failed load preserve previous configuration');
