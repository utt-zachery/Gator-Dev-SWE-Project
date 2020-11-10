import express from 'express';
import * as foodBankController from '../controllers/foodBankController.js';
import * as foodItemController from '../controllers/foodItemController.js';
const apiRouter = express.Router();

apiRouter.get('/getFoodBanks', foodBankController.viewFoodBanks);
apiRouter.post('/addFoodBank', foodBankController.addFoodBank);

apiRouter.post('/donateItem', foodItemController.donateItem);

export default apiRouter;