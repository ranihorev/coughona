import express from "express";
import multer from "multer";
import morgan from "morgan";
import * as dotenv from "dotenv";
import serverless from "serverless-http";
dotenv.config();

import { uploadFile } from "./s3upload";

const port = process.env.PORT || 3001;
const app = express();
app.use(morgan("combined"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://www.coughona.com");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

// simple verification endpoint
app.get("/", (req, res) => {
  return res.send("Hello world");
});

// handle crashes here.
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploading", req.body.user, `hasFile: ${Boolean(req.file)}`);
    const data = req.body.file;
    const result = await uploadFile(`base64/${req.body.user}`, data);
    res.send("Success");
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.send(`Failed to upload ${e}`);
  }
});

// global error handler.
app.use(((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send("error");
}) as express.ErrorRequestHandler);

// app.listen(port, () => console.log(`listening on port ${port}!`));

module.exports.handler = serverless(app);
