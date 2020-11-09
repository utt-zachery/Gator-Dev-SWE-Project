import express from 'express';
import * as foodBankController from '../controllers/foodBankController.js';

const apiRouter = express.Router();

apiRouter.get('/getFoodBanks', foodBankController.viewFoodBanks);
apiRouter.post('/addFoodBank', foodBankController.addFoodBank);

export default apiRouter;