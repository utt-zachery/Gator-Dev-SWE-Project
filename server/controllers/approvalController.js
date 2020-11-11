import FoodInventory from "../models/foodInventory.js"
import FoodItem from "../models/foodModel.js"
import Donation from "../models/donationModel.js"
import User from "../models/userModel.js"

export const iterativeUserFinder = async(data, final, map, index, req, res) => {
    
    if (!map.has(data[index].donatedBy)) {
        await User.findById(data[index].donatedBy).then((user) => {
            let finalTuple = {
                quantity: data[index].quantity,
                foodItem: data[index].foodItem,
                donationDate: data[index].donationDate,
                donatedBy: {name: user.name, email: user.email}
            };
            map.set(data[index].donatedBy, {name: user.name, email: user.email});
            final.push(finalTuple);

            if (index == data.length -1 ){
                res.json(final);
            } else {
                iterativeUserFinder(data, final, map, index+1, req, res);
            }
        }).catch((err) => {
            res.status(200).send(err);
        });
        
    } else {
        let finalTuple = {
            quantity: data[index].quantity,
            foodItem: data[index].foodItem,
            donationDate: data[index].donationDate,
            donatedBy: map.get(data[index].donatedBy)
        };
        final.push(finalTuple);
        if (index == data.length -1 ){
            res.json(final);
        } else {
            iterativeUserFinder(data, final, map, index+1, req, res);
        }
    }
}

export const iterativeFoodItemFinder = async(data, final, map, index, req, res) => {
    if (!map.has(data[index].foodItemID)) {
        await FoodItem.findById(data[index].foodItemID).then((foodItem) => {
            let finalTuple = {
                quantity: data[index].quantity,
                foodItem: foodItem,
                donationDate: data[index].donationDate,
                donatedBy: data[index].donatedBy
            };
            map.set(data[index].foodItemID, foodItem);
            final.push(finalTuple);

            if (index == data.length -1 ){
                let newMap = new Map();
                let newFinal = [];
                iterativeUserFinder(final, newFinal, newMap, 0, req, res);
            } else {
                iterativeFoodItemFinder(data, final, map, index+1, req, res);
            }
        }).catch((err) => {
            res.status(200).send(err);
        });
        
    } else {
        let finalTuple = {
            quantity: data[index].quantity,
            foodItem: map.get(data[index].foodItemID),
            donationDate: data[index].donationDate,
            donatedBy: data[index].donatedBy
        };
        final.push(finalTuple);
        if (index == data.length -1 ){
            let newMap = new Map();
            let newFinal = [];
            
            iterativeUserFinder(final, newFinal, newMap, 0, req, res);
        } else {
            iterativeFoodItemFinder(data, final, map, index+1, req, res);
        }
    }
}

export const iterativeDonationDateFinder = async(data, final, map, index, req, res) => {

    if (!map.has(data[index].donationID)) {
        await Donation.findById(data[index].donationID).then((donationData) => {
            let finalTuple = {
                quantity: data[index].quantity,
                foodItemID: data[index].foodItemID,
                donationDate: donationData.donationDate,
                donatedBy: donationData.userID
            };
            map.set(data[index].donationID, donationData);
            final.push(finalTuple);

            if (index == data.length -1 ){
                let newMap = new Map();
                let newFinal = [];
                iterativeFoodItemFinder(final, newFinal, newMap, 0, req, res);
            } else {
                iterativeDonationDateFinder(data, final, map, index+1, req, res);
            }
        }).catch((err) => {
            res.status(200).send(err);
        });
        
    } else {
        let finalTuple = {
            quantity: data[index].quantity,
            foodItemID: data[index].foodItemID,
            donationDate: map.get(data[index].donationID).donationDate,
            donatedBy: map.get(data[index].donationID).userID
        };
        final.push(finalTuple);
        if (index == data.length -1 ){
            let newMap = new Map();
            let newFinal = [];
            iterativeFoodItemFinder(final, newFinal, newMap, 0, req, res);
        } else {
            iterativeDonationDateFinder(data, final, map, index+1, req, res);
        }
    }
}


export const findWaitingItems = async(req, res) => {
    if (!req.query || !req.query.foodBankID) {
        res.status(200).send({msg: "Include Foodbank ID in query string"});
    }

    await FoodInventory.find({foodBankID: req.query.foodBankID, checkIn: false}).then((data)=>{
     
        let hashMap = new Map();
        let final = [];
        if (data.length ==0 ) {
            res.send(final);
        } else {
            iterativeDonationDateFinder(data, final, hashMap, 0, req, res);
        }
    }).catch((err) => {
        res.status(200).send(err);
    })

}