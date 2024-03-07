import express from "express";
import {router as index} from "./api/index";
import {router as trip} from "./api/trip";
import {router as upload} from "./api/upload";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });

app.use(
    cors({
    //   origin: "http://localhost:4200",
        origin: "*",
    })
  );


app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/trip", trip);
app.use("/up",upload);
app.use("/uploads",express.static("uploads"));