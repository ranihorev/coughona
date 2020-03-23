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

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

// simple verification endpoint
app.get("/", (req, res) => {
  console.log(process.env.AWS_ACCESS_KEY_ID);
  return res.send(process.env.AWS_ACCESS_KEY_ID);
});

// handle crashes here.
app.post("/upload", upload.single("file"), async (req, res) => {
  const result = await uploadFile(req.body.user, req.file.buffer);
  // res.send()
});

// global error handler.
app.use(((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send("error");
}) as express.ErrorRequestHandler);

// app.listen(port, () => console.log(`listening on port ${port}!`));

module.exports.handler = serverless(app);
