import {redis} from '../src/module/redis.js';

//await redis.hset('prone-reg-whatsapp', 79103962209, 'true')


const test = await redis.hset('registrations', 79103962209, 'true')
console.log("🚀 -> test:", test)
