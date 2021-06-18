import axios from "axios";
import { DateTime } from "luxon";
import db from "../database";

interface NormalCountdownData {
    name: string;
    date: string;
    appendWeeks?: boolean;
}

interface ChannelData {
    name: string;
    webhook: string;
    elements: ElementData[];
}

interface NormalCountdownElementData extends BasicEmbedData {
    type: "normalCountdowns";
    countdowns: NormalCountdownData[];
}
interface EmojiDayElementData extends BasicEmbedData, EmojiDay {
    type: "emojiDay";
}
interface MessageElementData {
    type: "message";
    embed: EmbedData;
}

type ElementData = 
    | NormalCountdownElementData
    | EmojiDayElementData
    | MessageElementData;

interface EmojiDay {
    name: string;
    emoji: string;
    date: string;
}

interface EmbedData extends BasicEmbedData {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    fields?: FieldData[];
}

interface BasicEmbedData {
    thumbnail?: {
        url: string;
    };
    color?: number;
}

interface FieldData {
    name: string;
    value: string;
    inline?: boolean;
}

export default () => {
    
    let channels = db.getObject<ChannelData[]>("/channels");
    channels.forEach(handleChannel);

};

function handleChannel(channel: ChannelData) {
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

    sendEmbeds(channel, embeds);
}

function processNormalCountdowns(element: NormalCountdownElementData): EmbedData {
    return {
        title: "Cât mai avem până la:",
        color: element.color,
        thumbnail: element.thumbnail,
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
    const dateStr = date.toLocaleString(DateTime.DATETIME_FULL);
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
        thumbnail: element.thumbnail
    };
}

function sendEmbeds(channel: ChannelData, embeds: EmbedData[]) {
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
    embedGroups.forEach(embeds => {
        axios.post(channel.webhook, {
            embeds
        }).then(() => {
            console.log("Posted embed group", JSON.stringify(embeds));
        }).catch(reason => {
            console.log("POST error", JSON.stringify(reason));
            // console.error(reason.response);
        });
    });
}