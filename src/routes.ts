import express from 'express';
import WellcomeController from './modules/wellcome/welcome-controller';

const routes = express.Router();
const wellComeController = new WellcomeController();

routes.get('/', wellComeController.wellcome);

export default routes;