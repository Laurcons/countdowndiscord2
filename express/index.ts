
import express from "express";
import bodyParser from "body-parser";
import { MainRouter } from "./routes";

export function run() {

	process.env.EXPRESS_ROOT = process.env.EXPRESS_ROOT ?? "cd2";

	const app = express();

	app.set("view engine", "pug");
	app.set("views", "./express/views");
	app.use("/static", express.static("./express/static"));
	app.use(bodyParser.json());

	app.use("/" + process.env.EXPRESS_ROOT, MainRouter);

	app.listen(8000, () => {
		console.log("Listening on port 8000 :)");
	});

}