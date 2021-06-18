
import { parseIsoDatetime } from "../utilities";
import perform from "./perform";
import db from "../database";
import { DateTime } from "luxon";

// bootstrap the scheduling
export function run() {

    function checkForTime() {
        const now = DateTime.now();

        // check last run
        const lastRunStr: string = null;//db.getData("/lastRun");
        const lastRun = (lastRunStr !== null) ? DateTime.fromISO(lastRunStr) : null;
        console.log("[SCHED] Checking time", now.toISO());
        let doWePerform = (() => {
            if (lastRun === null) {
                console.log("[SCHED] Performing, since lastRun is null");
                return true;
            } else {
                // is the time 14:30?
                if (now.hour == 14 && now.minute == 30) {
                    console.log("[SCHED] Performing, since it is 14:30");
                    return true;
                }

                // has it been more than 1 day and 10 minutes since last run?
                const minutes = -1 * lastRun.diffNow('minutes').minutes;
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
            console.log("[SCHED] Performing");
            perform();
        }
    }

    checkForTime();
    // setInterval(checkForTime, 1000 * 10);

}