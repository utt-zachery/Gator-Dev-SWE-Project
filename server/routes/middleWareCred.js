import Manages from '../models/managesModel.js'
import * as Page from '../routes/pageBuilder.js'
import User from '../models/userModel.js'

export const checkGod = async(req, res) => {
    await User.findById(req.cookies["userID"], (err, data) => {
            if (data && data.name == "admin_god_account") {
                Page.buildPageWithFoodBank(req, res, "manage", 2);
                return true;
            }
            Page.buildPage(req, res, "creds", -1);
            return false;
    });
}

export const process = async(req, res) => {
    
    if (!req.cookies || req.cookies["userID"] == null || req.cookies["userID"] == "") {
        Page.buildPage(req, res, "creds", -1);
        return false;
    }

    await Manages.findOne( {"userID": req.cookies["userID"] }, (err, data) => {
        if (err) {
            Page.buildPage(req, res, "creds", -1);
            return false;
        } else if (!data) {
            return checkGod(req, res);
        } else if (req.cookies["foodBankID"] == data.foodBankID){
            Page.buildPageWithFoodBank(req, res, "manage", 2);
            return true;
        } else {
           return checkGod(req, res);
        }
        
    });
}