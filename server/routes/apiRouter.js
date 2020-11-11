import express from 'express';
import * as foodBankController from '../controllers/foodBankController.js';
import * as donateItemController from '../controllers/donateItemController.js';
import * as userController from '../controllers/userController.js'
import * as catalogController from '../controllers/catalogController.js'
import * as donationController from '../controllers/donationController.js'
import * as findFoodBankController from '../controllers/findFoodBankController.js'
import * as expirationController from '../controllers/expirationController.js'
import * as lowItemController from '../controllers/lowItemController.js'
import * as approvalController from '../controllers/approvalController.js'
import * as checkoutController from '../controllers/checkoutController.js'

const apiRouter = express.Router();


apiRouter.get('/getFoodBanks', foodBankController.viewFoodBanks);
apiRouter.post('/addFoodBank', foodBankController.addFoodBank);

apiRouter.post('/donateItem', donateItemController.donateItem);
apiRouter.post('/addUser', userController.newUser);

apiRouter.get('/viewCatalog', catalogController.viewCatalog);

apiRouter.get('/viewDonations', donationController.viewDonations);

apiRouter.get('/findFoodBanks', findFoodBankController.viewFoodBanks);
apiRouter.get('/expired', expirationController.findExpired);

apiRouter.get('/lowItem', lowItemController.viewLowItems);

apiRouter.get('/approveDonations/view', approvalController.findWaitingItems);
apiRouter.post('/approveDonations/approve', approvalController.approveItem);

apiRouter.post('/checkOut', checkoutController.checkOut); 

export default apiRouter;