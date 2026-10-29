import {test} from 'node:test';import assert from 'node:assert/strict';
import {verifiedGrantLimit} from '../src/server/mcp-grant-limit.ts';
const request=(path='/mcp/personal',method='POST',headers={})=>new Request('https://example.invalid'+path,{method,headers});
test('verified grant buckets stay stable across token, route and caller-header changes and isolate grants',async()=>{
 const reads=[],writes=[],env={API_READ_LIMITER:{async limit({key}){reads.push(key);return{success:true};}},API_WRITE_LIMITER:{async limit({key}){writes.push(key);return{success:true};}}};
 for(const headers of [{authorization:'Bearer synthetic-one'},{authorization:'Bearer synthetic-two','x-api-key':'different','x-user-id':'another'}])assert.equal(await verifiedGrantLimit(request('/mcp/personal','POST',headers),env,'verified-grant-A'),null);
 await verifiedGrantLimit(request('/api/v1/personal/items','GET'),env,'verified-grant-A');await verifiedGrantLimit(request('/mcp/company','POST'),env,'verified-grant-B');
 assert.equal(writes[0],writes[1]);assert.equal(reads[0],writes[0]);assert.notEqual(writes[0],writes[2]);assert.match(writes[0],/^mcp-grant:[a-f0-9]{64}$/);assert.ok(!writes[0].includes('verified-grant-A'));
});
test('denied grants return a clear retry time and unavailable protection fails closed',async()=>{
 const deny={async limit(){return{success:false};}},outage={async limit(){throw Error('Synthetic outage');}};
 const response=await verifiedGrantLimit(request(),{API_WRITE_LIMITER:deny},'verified-grant-A');assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');assert.equal(response.headers.get('cache-control'),'no-store');
 for(const limiter of [undefined,outage])assert.equal((await verifiedGrantLimit(request(),{API_WRITE_LIMITER:limiter},'verified-grant-A')).status,503);
 for(const id of ['',undefined,'x'.repeat(201)])assert.equal((await verifiedGrantLimit(request(),{API_WRITE_LIMITER:deny},id)).status,503);
});
