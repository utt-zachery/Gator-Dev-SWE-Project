/* This file is your server footballClubRouter. 
   Trace the dependencies so you understand which files are connected and how data is passed between them
   For each route, make note of the sequence of requests called for each

*/

import * as footballClubController from '../controllers/footballClubController.js';
import express from 'express'; //refers to Express the middleware helper for Node.js
const footballClubRouter = express.Router();
/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 
  Note: the footballClubController variable above and the file it is connected to help you trace
 */
footballClubRouter.get('/', footballClubController.getAllFootballClubs);
footballClubRouter.post('/', footballClubController.create);

/*
  The ':' specifies a URL parameter. 
  Also, it allows the passing of data which is stored in req.params in the controller
 */
footballClubRouter.get('/:footballClubId', footballClubController.read);
footballClubRouter.put('/:footballClubId', footballClubController.update);
footballClubRouter.delete('/:footballClubId', footballClubController.remove);


export default footballClubRouter;
