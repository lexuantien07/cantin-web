import express from "express";
import controller from "../controller/homeController";

let router = express.Router();
const initAdWebRoute = (app) => {
  router.get("/", controller.getAdHomePage);
  router.get("/edit", controller.getAdMenuEdit);
  router.get("/stock", controller.getAdStock);
  router.get("/dayreport", controller.getAdDayReport);
  router.get("/monthreport", controller.getAdMonthReport);
  router.get("/scanqr", controller.getScanQR);
  router.post("/monthreport", controller.sendMonth);
  router.get("/droptb", controller.dropTable);
  router.get("/scan", controller.adScan);
  router.post("/", controller.createData);
  // router.post('/', controller.postAdMenuEdit);
  return app.use("/ad", router);
};

export default initAdWebRoute;
