import express from "express";
import controller from "../controller/homeController";

let router = express.Router();
const initClientWebRoute = (app) => {

    // router.get('/', controller.getClientHomePage);
    router.get('/clientBook', controller.getClientBook);
    // router.post('/clientBook', controller.postClientBook);
    router.post('/clientCheckout', controller.postClientBook);
    router.get('/', controller.getClientMenuEdit);
    return app.use('/client', router);
}

export default initClientWebRoute;