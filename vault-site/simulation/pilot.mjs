import {createCampaign,branchTree,narrativeInput,narrativeKey} from './engine.mjs';
const s=createCampaign(process.argv[2]||'development-pilot-001');
const context={place:s.place,cargo:s.cargo};
function flatten(t){return t.branches.flatMap(b=>[{key:narrativeKey(b.event,context),input:narrativeInput(b.event)},...flatten(b.next)])}
const jobs=flatten(branchTree(s,3));
console.log(JSON.stringify({campaign:s.id,context,branches:jobs.length,narrationJobs:jobs},null,2));
