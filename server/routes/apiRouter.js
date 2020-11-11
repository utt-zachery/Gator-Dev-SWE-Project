import express from 'express';
import * as foodBankController from '../controllers/foodBankController.js';
import * as donateItemController from '../controllers/donateItemController.js';
import * as userController from '../controllers/userController.js'
import * as catalogController from '../controllers/catalogController.js'
import * as donationController from '../controllers/donationController.js'

const apiRouter = express.Router();

apiRouter.get('/getFoodBanks', foodBankController.viewFoodBanks);
apiRouter.post('/addFoodBank', foodBankController.addFoodBank);

apiRouter.post('/donateItem', donateItemController.donateItem);
apiRouter.post('/addUser', userController.newUser);

apiRouter.get('/viewCatalog', catalogController.viewCatalog);

apiRouter.get('/viewDonations', donationController.viewDonations);


export default apiRouter;