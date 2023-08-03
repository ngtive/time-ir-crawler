// For more information, see https://crawlee.dev/
import {CheerioCrawler, Dataset, purgeDefaultStorages, RequestQueue} from 'crawlee';
import moment from 'jalali-moment';
import {replacePersianNumbers} from "./helper.js";
import {monthsByName, monthsByNumber} from "./variables/index.js";
import {EventInterface} from "./io/event.i";
import * as fs from "fs";


let events: EventInterface[] = [];


const crawler = new CheerioCrawler({
    async requestHandler({$, log}) {
        let currentMonth = replacePersianNumbers($('span.jalali.selectMonth').text());
        let currentYear = replacePersianNumbers($('span.jalali.selectYear').text());

        log.info(`Crawling month: ${currentMonth} ${currentYear}`);

        const eventsLi = $('.eventsCurrentMonthWrapper ul li');
        eventsLi.each((_, el) => {
            const eventSplitter = $(el).text().trimEnd().trimStart().trim().split('\r\n');
            const dateRaw = eventSplitter?.[0];
            if (dateRaw && eventSplitter?.[1]) {
                let [day, month] = dateRaw.split(' ');
                day = replacePersianNumbers(day);
                month = replacePersianNumbers(month);
                let event = eventSplitter[1];
                let monthNumber = monthsByName.get(month);
                let eventMoment = moment.from(`${currentYear}-${monthNumber}-${day}`, 'fa', 'YYYY-M-D');
                events.push({
                    date: eventMoment.format('jYYYY/jMM/jDD'),
                    event: event.trim(),
                });
            }
        });
    },
});

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
await purgeDefaultStorages();
fs.writeFile('./data.json', JSON.stringify(events), () => {
    console.log('ok')
});
