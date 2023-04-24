import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import initClientWebRoute from "./route/client";
import initAdWebRoute from "./route/ad";
import connection from "./config/connectDB";
import fs from 'fs';
import qrreader from 'qrcode-reader';
import Jimp from 'jimp';

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set controller
configViewEngine(app);

//set router
initWebRoute(app);
initClientWebRoute(app);
initAdWebRoute(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
