import express from "express";
import controller from "../controller/homeController";

let router = express.Router();
const initWebRoute = (app) => {
    // home
    router.get('/', controller.getHomePage);
    router.get('/qr', controller.getQRCode);
    router.get('/qrmul', controller.getQRCodeMul);
    router.get('/cancel', controller.getCancelPage);
    router.post('/verify', controller.verifyAccount);
    router.post('/createAccount', controller.createAccount);
    router.post('/nhaphang', controller.importProducts);
    // router.get('/totalday', controller.getDayReport);
    router.post('/totalday', controller.getDayReport);
    router.post('/addcount', controller.addSalesCount);
    router.post('/addcountbook', controller.addSalesCountBook);
    router.get('/download', controller.downloadQR);
    router.post('/downloadday', controller.downloadDay);
    router.post('/getmonthreport', controller.getMonthReport);
    // client
    // router.post('/client', controller.getClientHomePage);
    
    // admin
    // router.post('/ad',  controller.getAdHomePage);
    // router.post('/create-data', controller.createData);
    return app.use('/', router);
}

export default initWebRoute;