import {randomBytes} from 'node:crypto';
const [id,name]=process.argv.slice(2);
if(!id||!/^[a-z0-9-]{1,60}$/.test(id)||!name){console.error('Usage: node scripts/knowledgeos-invite.mjs workspace-id "Workspace name"');process.exit(1);}
console.log(JSON.stringify({id,name,key:randomBytes(32).toString('base64url')}));
