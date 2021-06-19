
import * as express from "./express";
import * as countdowns from "./countdowns";
import dotenv from "dotenv";

dotenv.config();
express.run();
countdowns.run();