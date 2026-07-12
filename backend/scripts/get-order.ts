import { AgentClient } from '@croo-network/sdk';

console.log('Starting...');
console.log('SDK key present:', !!process.env.CROO_SDK_KEY);
console.log('Agent ID:', process.env.CROO_AGENT_ID);

const client = new AgentClient(
    { baseURL: process.env.CROO_API_URL || 'https://api.croo.network' },
    process.env.CROO_SDK_KEY!
);

client.listOrders({ role: 'provider', agentId: process.env.CROO_AGENT_ID! })
    .then(orders => {
        console.log('Orders found:', orders.length);
        console.log(JSON.stringify(orders, null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILED:', err.message);
        console.error(err);
        process.exit(1);
    });