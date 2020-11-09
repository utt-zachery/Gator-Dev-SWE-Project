import * as footballClubController from '../controllers/footballClubController.js';
import express from 'express'; //refers to Express the middleware helper for Node.js
const labRouter = express.Router();

labRouter.get('/:mascotName', footballClubController.readMascot);
labRouter.delete('/:confName', footballClubController.deleteByConference);

export default labRouter;