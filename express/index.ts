
import express from "express";
import bodyParser from "body-parser";
import { MainRouter } from "./routes";

export function run() {

	process.env.EXPRESS_ROOT = ((exproot) => {
		if (exproot.endsWith("/"))
			exproot = exproot.substr(0, exproot.length - 1);
		if (!exproot.startsWith("/"))
			exproot = "/" + exproot;
		return exproot;
	})(process.env.EXPRESS_ROOT ?? "");

	const app = express();

	app.set("view engine", "pug");
	app.set("views", "./express/views");
	app.use(bodyParser.json());

	app.locals.homepage = process.env.EXPRESS_ROOT;

	app.use(process.env.EXPRESS_ROOT, MainRouter);

	app.listen(8000, () => {
		console.log("Listening on port 8000 :)");
	});

}