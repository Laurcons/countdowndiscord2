
import express from "express";
import db from "../database";
import { ChannelData } from "../types";
import bodyParser from "body-parser";
import { handleChannel } from "../countdowns/handleChannel";
import { createNewChannel, getExampleElements } from "../countdowns/create";

export function run() {

	const app = express();

	app.set("view engine", "pug");
	app.set("views", "./express/views");
	app.use("/static", express.static("./express/static"));
	app.use(bodyParser.json());

	app.get("/", (req, res) => {
		if (req.query.webhookUrl) {
			// gather information about it
			let channel = db.find<ChannelData>("/channels", c => c.webhook === req.query.webhookUrl);
			// if it's undefined, create it
			let isNew = false;
			if (!channel) {
				isNew = true;
				channel = createNewChannel(req.query.webhookUrl as string);
				db.push("/channels", [channel], false);
			}
			res.render("webhookEdit", { channel, isNew });
		} else {
			res.render("index");
		}
	});

	app.get("/reload", (req, res) => {
		db.reload();
		res.send("Database reloaded");
	});

	app.get("/reference", (req, res) => {
		res.render("reference", {
			jsonExample: JSON.stringify(getExampleElements(), null, 2)
		});
	});

	app.post("/saveMeta", (req, res) => {
		// find webhook
		const channels = db.getObject<ChannelData[]>("/channels");
		const channelIndex = channels.findIndex(c => c.webhook === req.query.webhookUrl);
		let channel = channels[channelIndex];
		if (!channel) {
			res.sendStatus(404).json({
				status: "webhook-url-not-found"
			});
			return;
		}
		channel.name = req.body.name;
		channels[channelIndex] = channel;
		db.push("/channels", channels);
		res.json({
			status: "success"
		});
	});

	app.post("/test", (req, res) => {
		const channel = db.find<ChannelData>("/channels", c => c.webhook === req.query.webhookUrl);
		const testChannel: ChannelData = {
			...channel,
			name: channel.name + "_(WEBINTERFACETEST)",
			elements: [
				{
					type: "message",
					embed: {
						description: "This is a test message from the Web Interface"
					}
				},
				...req.body.elements
			]
		};
		handleChannel(testChannel)
			.then(() => {
				res.json({
					status: "success"
				});
			}).catch(() => {
				res.sendStatus(400).json({
					status: "webhook-failed"
				});
			});
	});

	app.post("/saveElements", (req, res) => {
		const channels = db.getObject<ChannelData[]>("/channels");
		const channelIndex = channels.findIndex(c => c.webhook === req.query.webhookUrl);
		let channel = channels[channelIndex];
		channel.elements = req.body.elements;
		channels[channelIndex] = channel;
		db.push("/channels", channels);
		res.json({
			status: "success"
		});
	});

	app.listen(8000, () => {
		console.log("Listening on port 8000 :)");
	});

}