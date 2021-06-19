import { ChannelData, ElementData } from "../types";

export function createNewChannel(webhook: string): ChannelData {
    return {
        name: "NewChannel",
        webhook,
        elements: getExampleElements() as ElementData[]
    };
}

export function getExampleElements(): any {
    return [
        {
            "type": "message",
            "embed": {
                "color": 1290139,
                "description": "An example element from CountdownDiscord 2",
                "fields": [
                    {
                        "name": "I can put",
                        "value": "whatever I want here"
                    }
                ]
            }
        },
        {
            "type": "normalCountdowns",
            "color": 1290139,
            "countdowns": [
                {
                    "name": ":fire: Bacalaureat :fire:",
                    "date": "2021-06-28T07:00:00",
                    "comment": "any additional properties will politely be ignored"
                }, {
                    "name": "The Fire of Notre Dame",
                    "date": "2020-03-22T00:00:00",
                    "commentz": "i can't be bothered to look it up"
                }
            ]
        },
        {
            "type": "emojiDay",
            "color": 1290110,
            "name": "Amogus 2 Release Date",
            "emoji": ":japanese_goblin:",
            "emojiComment": "it can be any string, really",
            "date": "2022-01-01T00:00:00"
        }
    ];
}