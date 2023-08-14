import {monthsByNumber} from "./variables/index.js";
import {crawledData, crawler} from "./crawler/time-ir-crawler.js";
import moment from "jalali-moment";
import {purgeDefaultStorages} from "crawlee";
// import redisClient from "./redis.js";
import fs from 'fs';


await purgeDefaultStorages();
// await redisClient.connect();
const now = moment();
monthsByNumber.forEach(async (_, key) => {
    await crawler.addRequests([
        {
            url: 'https://time.ir',
            payload: `Year=${now.jYear()}&Month=${key}&Base1=0&Base2=1&Base3=2&Responsive=true`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            uniqueKey: `month-${key}`,
            label: key.toString(),
        }
    ])
})

await crawler.run();
fs.writeFileSync('data.json', JSON.stringify(crawledData));
// await redisClient.disconnect();