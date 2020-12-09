import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import apiRouter from './routes/apiRouter.js';
import * as Page from './routes/pageBuilder.js'
import * as Cred from './routes/middleWareCred.js'
import {connectToDatabase} from './connectMongodb.js';
import path from "path";
import * as Auth0 from 'express-openid-connect';
import * as User from './controllers/userController.js'

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

//Connect to Autho
app.use(
   Auth0.default.auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.autho-ISSUER_BASE_URL,
        baseURL: process.env.autho-BASE_URL,
        clientID: process.env.autho-CLIENT_ID,
        secret: process.env.autho-SECRET,
    })
);

//Serve File resources, while lockingdown server information
let __dirname = path.resolve(path.dirname(''));
app.use('/web',express.static(path.join(__dirname, 'web/')));
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules/')));

//Serves the API
app.use('/api/', apiRouter);

app.use(cookieParser());

//Auth0.default.requiresAuth()
app.get('/newUser', function(req, res) {
   
   console.log(req.oidc.user);
   Page.buildPage(req, res, "newUser", -1);
});

app.get('/catalog', Auth0.default.requiresAuth(), 
    function (req, res,next) {User.resolveUserID(req,res, next)},  function(req, res) {
            Page.buildPageWithFoodBank(req, res, "catalog", 1);
});

app.get('/manage', Auth0.default.requiresAuth(),  function (req, res,next){User.resolveUserID(req,res, next)}, function(req, res) {
   Cred.process(req, res);
});

app.get('/mission', function(req, res) {
   Page.buildPage(req, res, "mission", -1);
});

app.get('/home', function (req, res,next){User.resolveUserID(req,res, next)},function(req, res) {
   Page.buildHome(req,res);
});

app.get('/donate', Auth0.default.requiresAuth(),  function (req, res,next){  User.resolveUserID(req,res,next) }, function(req, res) {
   Page.buildPageWithFoodBank(req, res, "donate", 0);
});

app.get('/search', Auth0.default.requiresAuth(), function (req, res,next) { User.resolveUserID(req,res, next) }, function(req, res) {
   Page.buildPage(req,res, "search", -1);
});

//404 - resource not found
app.all("/*", (req, res) => {
   res.statusCode === 404
     ? res.send("Sorry, information not available")
     : res.redirect("/home");
 });

app.listen(port, console.log(`App now listening on port ${port}`));
