import {confirmedDuel} from '../simulation/narrative-test-fixture.mjs';
import {writeFileSync} from 'node:fs';
const {envelope,view}=confirmedDuel();
const scope={campaignId:view.campaignId,actorId:view.actorId,revision:view.revision};
const output=JSON.stringify({scope,envelope});
if(/PRIVATE-|DEVELOPMENT-ONLY|privateState|branchId|seed/i.test(output))throw Error('Private field in example');
writeFileSync(new URL('../public/libro/book-examples-combat.mjs',import.meta.url),'// Generated synthetic combat projection. No seed or private state.\nexport const combatSample='+output+';\n');
