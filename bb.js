require("dotenv").config();
const axios = require('axios');
const ical = require('node-ical');
const moment = require("moment-timezone");
moment().tz("Asia/Tokyo").format();

(async () => {
    // or just parse some iCalendar data directly
    const events = ical.sync.parseICS((await axios.get(process.env.BB_ICS_URL)).data);

    for (const event of Object.values(events)) {
        if (!event.end || event.type !== "VEVENT") {
            continue;
        }
        const end = moment(event.end).tz('Asia/Tokyo').startOf('day');
        const now = moment(new Date()).tz('Asia/Tokyo').startOf("day");
        const diff = end.diff(now, "days");

        if (diff < 0 || diff > 1) {
            continue;
        }
        if(process.env.DEBUG === "TRUE"){
            console.log(
                'Summary: ' + event.summary +
                '\nDescription: ' + event.description +
                '\nEnd Date: ' + event.end?.toISOString()
            );
            console.log(event);
            console.log(moment(event.end).tz('Asia/Tokyo'));

            console.log("残り: ", end.diff(now, "days"));
        }

        axios.post(process.env.DISCORD_WEBHOOK_URL, {
            "content": `${process.env.MENTIONID} ${diff >= 1 ? '明日' : '**本日**'}: ${event.summary}`,
            "embeds": [
                {
                    "title": event.summary,
                    "description": `${diff >= 1 ? '明日' : '**本日**'}のイベントです`,
                    "url": "https://bb.kosen-ac.jp/",
                    "color": diff >= 1 ? 11515392 : 16711680, //#afb600 : #FF0000
                    "fields": [
                        {
                            "name": "期日",
                            "value": moment(event.end).tz('Asia/Tokyo').format("YYYY/MM/DD HH:mm:ss"),
                            "inline": true
                        },
                        {
                            "name": "提出先",
                            "value": "BB"
                        },
                        {
                            "name": "課題を提出",
                            "value": "[こちらから](https://bb.kosen-ac.jp/)"
                        }
                    ]
                }
            ],
            "username": "Blackboard 課題",
            "avatar_url": process.env.BB_ICON_URL,
            "attachments": []
        })
    };
})();
