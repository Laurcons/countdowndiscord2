import express from "express";
import bodyParser from "body-parser";
import minify from "express-minify";
import md5file from "md5-file";
import { MainRouter } from "./routes";

export function run() {
  process.env.EXPRESS_ROOT = ((exproot) => {
    if (exproot.endsWith("/")) exproot = exproot.substr(0, exproot.length - 1);
    if (!exproot.startsWith("/")) exproot = "/" + exproot;
    return exproot;
  })(process.env.EXPRESS_ROOT ?? "");

  const app = express();

  app.set("view engine", "pug");
  app.set("views", "./express/views");
  // app.use(express.static("./static"));
  app.use(minify());
  app.use(bodyParser.json());

  app.locals.homepage = process.env.EXPRESS_ROOT;
  app.locals.resource = function (url: string) {
    // append the URL to the EXPRESS_ROOT, and add a hash
    return (
      process.env.EXPRESS_ROOT +
      "/static/" +
      url +
      `?v=${md5file.sync("./express/static/" + url)}`
    );
  };

  app.use(process.env.EXPRESS_ROOT, MainRouter);

  app.use("/", (req, res) => {
    res.redirect(process.env.EXPRESS_ROOT);
  });

  app.listen(8000, () => {
    console.log("Listening on port 8000 :)");
  });
}
