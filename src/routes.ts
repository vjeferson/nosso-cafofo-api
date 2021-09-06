import express from 'express';
import WellcomeController from './modules/welcome-controller';

const routes = express.Router();
const wellComeController = new WellcomeController();

routes.get('/', wellComeController.wellcome);

export default routes;