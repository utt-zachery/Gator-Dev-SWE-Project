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
import * as bagController from '../controllers/bagController.js'
import * as emailController from '../controllers/emailController.js'

const apiRouter = express.Router();
apiRouter.get('/email', emailController.processEmails);


apiRouter.get('/getFoodBank', foodBankController.viewFoodBanks);
apiRouter.post('/addFoodBank', foodBankController.addFoodBank);

apiRouter.post('/donateItem', donateItemController.donateItem);
apiRouter.post('/addUser', userController.newUser);
apiRouter.post('/reset/email', userController.update);
apiRouter.get('/viewCatalog', catalogController.viewCatalog);


apiRouter.get('/viewDonations', donationController.viewDonations);

apiRouter.get('/findFoodBanks', findFoodBankController.viewFoodBanks);
apiRouter.get('/findFirstFoodBank', findFoodBankController.viewFirstFoodBank);
apiRouter.get('/expired', expirationController.findExpired);

apiRouter.get('/lowItem', lowItemController.viewLowItems);

apiRouter.get('/approveDonations/view', approvalController.findWaitingItems);
apiRouter.post('/approveDonations/approve', approvalController.approveItem);
apiRouter.post('/approveDonations/delete', approvalController.deleteItem);

apiRouter.post('/checkOut', checkoutController.checkOut); 

apiRouter.get('/orders/view',bagController.viewOutstandingOrders);
apiRouter.post('/orders/bag', bagController.bagItems);
apiRouter.post('/orders/pickUp', bagController.pickUpItems);
apiRouter.get('/orders/viewReady', bagController.viewReadyForPickup);





export default apiRouter;