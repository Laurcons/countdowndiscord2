import axios from "axios";
import { DateTime } from "luxon";
import { ChannelData, EmbedData, EmojiDayElementData, NormalCountdownElementData } from "../types";

export function handleChannel(channel: ChannelData) {
    console.log("Handling channel", channel.name);
    const embeds = channel.elements.map(element => {
        const type = element.type;
        switch (element.type) {
        case "normalCountdowns":
            return processNormalCountdowns(element);
        case "emojiDay":
            return processEmojiDay(element);
        case "message":
            return element.embed;
        default:
            throw Error("Couldn't find type " + type);
        }
    });

    return sendEmbeds(channel, embeds);
}

function processNormalCountdowns(element: NormalCountdownElementData): EmbedData {
    return {
        title: "Cât mai avem până la:",
        color: element.color,
        thumbnail: element.thumbnail,
        timestamp: DateTime.now().toISO(),
        fields: element.countdowns?.map(countdown => {
            const diff = DateTime.fromISO(countdown.date).diffNow();
            let text = "";
            if (diff.as('milliseconds') < 0)
                text = "Trecut!";
            else if (diff.as('hours') <= 48)
                text = `${Math.floor(diff.as('hours'))} ore`;
            else
                text = `${Math.floor(diff.as('days'))} zile`;
            if (countdown.appendWeeks && diff.as('weeks') >= 1) {
                text += ` (${Math.floor(diff.as('weeks') * 10) / 10} săpt.)`;
            }
            return {
                name: countdown.name,
                value: text,
                inline: true
            };
        })
    };
}

function processEmojiDay(element: EmojiDayElementData): EmbedData {
    const date = DateTime.fromISO(element.date);
    const timeZone = date.offsetNameShort;
    console.log(timeZone);
    const dateStr = date.setZone(timeZone).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
    const diff = date.diffNow();
    const isPassed = diff.as('days') < 1;
    return {
        title: element.name,
        description: "Fiecare emoji reprezintă o zi până la " + dateStr + "\n\n" +
            (!isPassed ?
            [...new Array(Math.floor(diff.as('days')))]
                .map(() => element.emoji).join(" ")
            : "Trecut!"),
        color: element.color,
        thumbnail: element.thumbnail,
        timestamp: DateTime.now().toISO()
    };
}

function sendEmbeds(channel: ChannelData, embeds: EmbedData[]): Promise<void[]> {
    // group embeds in groups of 10
    let embedGroups: EmbedData[][] = [];
    let arr: EmbedData[] = [];
    embeds.forEach((emb) => {
        arr.push(emb);
        if (arr.length == 10) {
            embedGroups.push(arr);
            arr = [];
        }
    });
    if (arr.length > 0)
        embedGroups.push(arr);
    // send POSTs
    return Promise.all(embedGroups.map(embeds => {
        return axios.post(channel.webhook, {
            embeds
        }).then(() => {
            console.log("Posted embed group", JSON.stringify(embeds));
        }).catch(reason => {
            console.log("POST error", JSON.stringify(reason));
            throw reason;
            // console.error(reason.response);
        });
    }));
}