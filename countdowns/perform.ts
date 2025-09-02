import db from "../database";
import { ChannelData } from "../types";
import { handleChannel } from "./handleChannel";

export default () => {
  let channels = (() => {
    try {
      return db.getObject<ChannelData[]>("/channels");
    } catch {
      db.push("/channels", [], true);
      return [];
    }
  })();
  Promise.all(channels.map(handleChannel))
    .then(() => {
      console.log("Posted all");
    })
    .catch(() => {});
};
