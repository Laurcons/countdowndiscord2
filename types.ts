

export interface NormalCountdownData {
    name: string;
    date: string;
    appendWeeks?: boolean;
}

export interface ChannelData {
    name: string;
    webhook: string;
    elements: ElementData[];
}

export interface NormalCountdownElementData extends BasicEmbedData {
    type: "normalCountdowns";
    countdowns: NormalCountdownData[];
}
export interface EmojiDayElementData extends BasicEmbedData, EmojiDay {
    type: "emojiDay";
}
export interface MessageElementData {
    type: "message";
    embed: EmbedData;
}

export type ElementData = 
    | NormalCountdownElementData
    | EmojiDayElementData
    | MessageElementData;

export interface EmojiDay {
    name: string;
    emoji: string;
    date: string;
}

export interface EmbedData extends BasicEmbedData {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    fields?: FieldData[];
}

export interface BasicEmbedData {
    thumbnail?: {
        url: string;
    };
    color?: number;
}

export interface FieldData {
    name: string;
    value: string;
    inline?: boolean;
}