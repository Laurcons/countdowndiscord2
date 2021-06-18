
import express from "express";

export function run() {

    const app = express();

    app.set("view engine", "pug");
    app.set("views", "./views");
    app.use("/static", express.static("./static"));

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.listen(8000, () => {
        console.log("Listening on port 8000 :)");
    });

}