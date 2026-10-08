// Isolated tests: no network, real credentials, Firestore writes, or emails.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const secret='local-fixture-only';
let handler;
let redirectHandler;
let writes=[];
let messages=[];
const context=vm.createContext({
  Buffer, URLSearchParams, __dirname:path.resolve('functions/flitt-webhook'), process:{env:{FLITT_SECRET_KEY:secret,POSTMARK_SERVER_TOKEN:'fixture'}},
  console:{log(){},error(){},warn(){}},
  require(name){
    if(name==='crypto')return crypto;
    if(name==='fs')return fs;
    if(name==='path')return path;
    if(name==='@google-cloud/functions-framework')return {http(name,fn){if(name === "flittWebhook")handler=fn;if(name === "flittRedirect")redirectHandler=fn;}};
    if(name==='@google-cloud/firestore')return {FieldValue:{serverTimestamp:()=>0},Firestore:class{collection(name){return{doc:()=>({set:async data=>writes.push({name,data})}),add:async data=>writes.push({name,data})};}}};
    if(name==='postmark')return {ServerClient:class{async sendEmailWithTemplate(data){messages.push(data);return {ErrorCode:0};}async sendEmail(data){messages.push(data);return {ErrorCode:0};}}};
    throw new Error(`Unexpected dependency ${name}`);
  },
});
vm.runInContext(fs.readFileSync('functions/flitt-webhook/index.js','utf8'),context);
async function callback(overrides={},valid=true){
  writes=[];messages=[];
  const body={product_id:'btcp-ai-3m',amount:'7900',currency:'GEL',order_status:'approved',order_id:'local-fixture',sender_email:'starter-test@example.invalid',...overrides};
  body.signature=valid?crypto.createHash('sha1').update(secret+'|'+Object.keys(body).sort().map(k=>body[k]).join('|')).digest('hex'):'invalid';
  const res={code:200,status(code){this.code=code;return this;},send(message){this.message=message;return this;}};
  await handler({method:'POST',body},res);
  return res;
}
for(const amount of ['7900','24900']){
  assert.equal((await callback({amount})).code,200);
  const entitlement=writes.find(w=>w.name==='course_access').data;
  assert.deepEqual(Object.keys(entitlement.courses),['ai-starter']);
  // Starter email is rendered from bundled files, not a Postmark-side template.
  const sent=messages[0];
  assert.equal(sent.TemplateAlias,undefined);
  assert.equal(sent.Tag,'course-access-ai-starter');
  assert(sent.Subject.includes('AI Starter'));
  const access=Buffer.from('starter-test@example.invalid').toString('base64url');
  for(const body of [sent.HtmlBody,sent.TextBody]){
    assert(body.includes(`/learn/ai-starter?access=${access}`));
    assert(body.includes(amount==='7900'?'79.00 GEL':'249.00 GEL'));
    assert(!body.includes('{{'));
  }
}
for(const overrides of [{amount:'7800'},{amount:'25000'},{currency:'USD'},{amount:'NaN'}]){
  assert.equal((await callback(overrides)).code,400);assert.equal(writes.length,0);assert.equal(messages.length,0);
}
assert.equal((await callback({},false)).code,403);assert.equal(writes.length,0);assert.equal(messages.length,0);
await callback({order_status:'declined'});assert.equal(writes.length,0);assert.equal(messages.length,0);
for(const [product_id,slug,template] of [['btcp-ai-pro','ai-pro','course-access-ai-pro'],['btcp-ai-bootcamp','ai-bootcamp','course-access-ai-bootcamp']]){
  await callback({product_id,amount:'24900'});
  assert.deepEqual(Object.keys(writes.find(w=>w.name==='course_access').data.courses),[slug]);
  assert.equal(messages[0].TemplateAlias,template);
}
// Browser redirect after payment carries the product slug for the Purchase pixel.
for(const [product_id,slug] of [['btcp-ai-3m','starter'],['btcp-ai-pro','pro'],['btcp-ai-bootcamp','bootcamp']]){
  let location='';
  redirectHandler({query:{status:'success'},body:{order_id:'o1',amount:'7900',currency:'GEL',product_id}},{redirect(code,url){location=url;}});
  const q=new URL(location).searchParams;
  assert.equal(q.get('product'),slug);assert.equal(q.get('status'),'success');assert.equal(q.get('amount'),'7900');
}
const manifest=JSON.parse(fs.readFileSync('public/learn-content/ai-starter/manifest.json'));
assert.deepEqual(manifest.topics.map(t=>t.slug),['fundamentals','practice','customer-profile']);
let count=0;
for(const topic of manifest.topics)for(const lesson of topic.lessons){
  assert(fs.existsSync(`public/learn-content/ai-starter/${topic.slug}/${lesson.slug}.md`));count++;
}
assert.equal(count,32);
for(const ext of ['txt','html']){
 const email=fs.readFileSync(`functions/flitt-webhook/email-templates/course-access-ai-starter.${ext}`,'utf8');
 assert(email.includes('/learn/ai-starter?access={{base64_email}}'));
 assert(!email.includes('/learn/ai-pro'));assert(!email.includes('discord.gg'));
}
console.log('PASS: redirect product slugs; Starter routing + inline (no Postmark template) email at both prices; signature/status/amount/currency guards; Pro/Bootcamp preserved; fixed 3-module/32-lesson snapshot; dedicated email links. No external side effects.');
