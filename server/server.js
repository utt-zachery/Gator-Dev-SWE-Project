import path from 'path';
import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes/apiRouter.js';
import * as Page from './routes/pageBuilder.js'
import {connectToDatabase} from './connectMongodb.js';
async function getPort() {
   return import("../config/config.js")
      .then(config => config.default.port)
      .catch(5000)
}
const port = await getPort();
//connect to database
const db = connectToDatabase().on(
   "error",
   console.error.bind(console, "MongoDB connection error:")
 );
 db.once("open", () => {
   console.log("Successfully connected to mongoose database!");
   
 });

//initialize app
const app = express();

//enable request logging for development debugging
app.use(morgan('dev'));

//body parsing middleware
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

//Serve File resources
app.use(express.static(process.cwd()));

//Serves the API
app.use('/api/', apiRouter);

app.get('/catalog', function(req, res) {
   Page.buildPage(req, res, "catalog", 1);
});

app.get('/manage', function(req, res) {
   Page.buildPage(req, res, "manage", 2);
});

app.get('/template', function(req, res) {
   Page.buildPage(req, res, "templateText", 1);
});
/*
app.get('/catalog', function (req, res) {
   res.send('GET request to the homepage')
});
*/


//404 - resource not found
app.all('/*', (req, res) => {
   res.statusCode === 404 ? res.send('Sorry, information not available') : res.sendFile(path.resolve('./web/index.htm'))    
});

app.listen(port, console.log(`App now listening on port ${port}`));
