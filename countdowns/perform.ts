
import db from "../database";
import { ChannelData } from "../types";
import { handleChannel } from "./handleChannel";

export default () => {
    
    let channels = db.getObject<ChannelData[]>("/channels");
    Promise.all(channels.map(handleChannel))
    .then(() => {
        console.log("Posted all");
    }).catch(() => {});

};
