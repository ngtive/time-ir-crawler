import {CheerioCrawler} from "crawlee";
import {replacePersianNumbers} from "../helper.js";
import {monthsByName} from "../variables/index.js";
import moment from "jalali-moment";
import redisClient from '../redis.js';
import {EventInterface} from "../io/event.i";
export const crawledData: EventInterface[] = [];

export const crawler = new CheerioCrawler({
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



                let e = {
                    date: eventMoment.format('jYYYY/jMM/jDD'),
                    event: event.trim(),
                    is_holiday: !!$(el).attr('class')?.includes('eventHoliday')
                };

                crawledData.push(e);
            }
        });
    },
});
