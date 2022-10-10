require("dotenv").config();
const axios = require('axios');
const ical = require('node-ical');

(async () => {
    try {
        // or just parse some iCalendar data directly
        const events = ical.sync.parseICS((await axios.get(process.env.BB_ICS_URL)));

        for (const event of Object.values(events)) {
            console.log(
                'Summary: ' + event.summary +
                '\nDescription: ' + event.description +
                '\nStart Date: ' + event.start.toISOString() +
                '\n'
            );
        };
    }catch(e){
        console.error(e);
        process.exit(1);
    }

})();
