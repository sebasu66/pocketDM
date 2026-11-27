// Public read-only probe. The target URL comes exclusively from the runtime service binding.
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'method_not_allowed'})}
 if(!process.env.SIMULATION_URL)return res.status(503).json({ok:false,error:'binding_unavailable'});
 try{
  const upstream=await fetch(new URL('/api/status',process.env.SIMULATION_URL),{signal:AbortSignal.timeout(5000),redirect:'error',headers:{Accept:'application/json'}});
  if(!upstream.ok)throw Error('Upstream not ready');
  const data=await upstream.json();
  if(data.ok!==true||typeof data.campaignContract!=='string'||typeof data.narrationContract!=='string'||data.campaignTransport!==false)throw Error('Invalid response');
  return res.status(200).json({ok:true,campaignContract:data.campaignContract,narrationContract:data.narrationContract,campaignTransport:false});
 }catch{return res.status(503).json({ok:false,error:'simulation_unavailable'})}
}
