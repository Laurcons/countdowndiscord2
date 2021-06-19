
import perform from "./perform";
import db from "../database";
import { DateTime, Settings } from "luxon";

// bootstrap the scheduling
export function run() {

    // default config values
    process.env.RUN_EVERY_SECONDS = process.env.RUN_EVERY_SECONDS ?? "10";
    process.env.TIME_ZONE = process.env.TIME_ZONE ?? "Europe/Bucharest";
    Settings.defaultLocale = "ro-RO";
    Settings.defaultZoneName = process.env.TIME_ZONE;

    function checkForTime() {
        const now = DateTime.now().setZone(process.env.TIME_ZONE);
        db.reload();

        // check last run
        const lastRunStr: string = db.getData("/lastRun");
        const lastRun = (lastRunStr !== null) ? DateTime.fromISO(lastRunStr) : null;
        let doWePerform = (() => {
            if (lastRun === null) {
                console.log("[SCHED] Performing, since lastRun is null");
                return true;
            } else {
                const minutes = -1 * lastRun.diffNow('minutes').minutes;
                // is the time 14:30,
                // and has it been more than 1m 5s since last run?
                if (now.hour == 14 && now.minute == 30 &&
                    minutes * 60 > 65
                ) {
                    console.log("[SCHED] Performing, since it is 14:30");
                    return true;
                }
                // has it been more than 1 day and 10 minutes since last run?
                if (minutes >= (10 + 60 * 24)) {
                    console.log("[SCHED] Performing, since it's been more than 1 day and 10 mins");
                    return true;
                }
            }
            return false;
        })();

        if (doWePerform) {
            // write last run date
            db.push("/lastRun", now.toISO());
            console.log("[SCHED] Performing at", now.toISO());
            perform();
        }
    }

    setInterval(checkForTime, 1000 * parseFloat(process.env.RUN_EVERY_SECONDS));

}