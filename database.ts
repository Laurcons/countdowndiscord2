
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

const db = new JsonDB(
    new Config(
        "db.json",
        true, // save on push
        true, // human readable
    )
);

export default db;