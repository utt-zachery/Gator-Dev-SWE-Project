import express from 'express';
import * as foodBankController from '../controllers/foodBankController.js';

const apiRouter = express.Router();

apiRouter.get('/', foodBankController.viewFoodBanks);
apiRouter.post('/', foodBankController.addFoodBank);

export default apiRouter;