// Internal service only. Exposes no campaign data, seeds, actions or receipts.
import {VERSION} from '../campaign-state.mjs';
import {NARRATION_VERSION} from '../narrative-projection.mjs';
export default function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'method_not_allowed'})}
 return res.status(200).json({ok:true,campaignContract:VERSION,narrationContract:NARRATION_VERSION,campaignTransport:false});
}
