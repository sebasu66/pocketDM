// SYS-06 adapter for SYS-07 createBookCampaignSession. No state authority in browser.
export function createSys06BookTransport({getIdToken,fetchImpl=fetch}={}){
 if(typeof getIdToken!=='function')throw Error('Authenticated token provider required');
 async function request(scope,command){
  if(typeof scope?.campaignId!=='string'||!/^[a-z][a-z0-9_.-]{0,100}$/.test(scope.campaignId))throw Error('Invalid campaign ID');
  const token=await getIdToken();if(typeof token!=='string'||!token)throw Error('UNAUTHENTICATED');
  const url='/api/campaigns/'+encodeURIComponent(scope.campaignId)+'/book'+(command?'/commands':'');
  const res=await fetchImpl(url,{method:command?'POST':'GET',cache:'no-store',headers:{Authorization:'Bearer '+token,...(command?{'Content-Type':'application/json'}:{})},...(command?{body:JSON.stringify({commandId:command.commandId,expectedRevision:command.expectedRevision,pageId:command.pageId,choiceId:command.choiceId})}:{})});
  const data=await res.json();if(!res.ok)throw Error(typeof data.error==='string'?data.error:'CAMPAIGN_UNAVAILABLE');
  if(data.campaignId!==scope.campaignId||data.actorId!==scope.actorId)throw Error('Campaign scope mismatch');
  return data;
 }
 return Object.freeze({resume:s=>request(s),confirm:c=>request(c,c)});
}
