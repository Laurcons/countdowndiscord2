
/**
 * @deprecated Use luxon instead
 */
export function parseIsoDatetime(dtstr: string) {
    let dts = dtstr.split("").filter(c => c !== "Z").join("");
    let dt = dts.split(/[: T-]/).map(parseFloat);
    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
}
export function daysUntil(date: Date) {
    return parseInt(((date.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24).toString());
}
export function hoursUntil(date: Date) {
    return parseInt(((date.getTime() - new Date().getTime()) / 1000 / 60 / 60).toString());
}
export function weeksUntil(date: Date) {
    return parseInt(((date.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24 / 7 * 10).toString()) / 10;
}