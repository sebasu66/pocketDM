import {writeFileSync} from 'node:fs';
import {preparedHorse,presetIds} from '../simulation/prepared-skill-book-fixture.mjs';
const data=Object.fromEntries(presetIds.map(id=>[id,Object.fromEntries(['catch','dodge'].map(choice=>{const {envelope}=preparedHorse(id,choice);return [choice,envelope]}))]));
writeFileSync('public/libro/prepared-skill-example-data.mjs','// Generated noncanonical public example. No campaign secrets.\nexport default '+JSON.stringify(data,null,2)+';\n');
