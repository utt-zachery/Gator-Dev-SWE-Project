import FoodInventory from "../models/foodInventory.js"
import FoodItem from "../models/foodModel.js"

export const produceFoodItem = async (inputArray, finalArray, index, req, res) => { 
    await FoodItem.findById(inputArray[index].value.foodItemID, function (err, data) {
        if (!err) {
            let shellObject = {
                quantity: inputArray[index].value.quantity,
                foodData: data
            };
            finalArray.push(shellObject);
        }
        if (index == inputArray.length-1) {
            res.json(finalArray);
        } else {
            produceFoodItem(inputArray, finalArray, index+1, req, res);
        }
    });
};

export const viewLowItems = async (req, res) => {
    let now = Date.now();
    if (!req.query || !req.query.foodBankID) {
        res.status(200).send("Include Foodbank ID in query string");
    }

    await FoodInventory.find({foodBankID:req.query.foodBankID, checkIn: true, expirationEpoch: {$gt:now }}).then((data) => {
        
        let productMap = new Map();
        for (let i=0; i < data.length; i++) {
            if (productMap.has(data[i].foodItemID)) {
                let wrapperObj = productMap.get(data[i].foodItemID);
                wrapperObj.quantity = wrapperObj.quantity + data[i].quantity;
                if (data[i].expirationEpoch < wrapperObj.expirationEpoch) {
                    wrapperObj.expirationEpoch = data[i].expirationEpoch;
                }
                wrapperObj.results.push(data[i]);
            } else {
                let toAdd = {
                    expirationEpoch: data[i].expirationEpoch,
                    foodItemID: data[i].foodItemID,
                    quantity: data[i].quantity,
                    results: [data[i]]
                };
                productMap.set(data[i].foodItemID, toAdd);
            }
        }

        let array = Array.from(productMap, ([name, value]) => ({value}));
        array.sort((a,b) => (a.value.quantity < b.value.quantity ? -1 : 1));
       
        let toReturn = [];

        if (!req.query.perPage) {
            if (req.query.page) {
                toReturn =array.slice(req.query.page*50,req.query.page*50+50);
            } else {
                toReturn =array.slice(0,50);
            }
        }  else {
            if (req.query.page) {
                toReturn =array.slice(req.query.page*req.query.perPage,req.query.page*req.query.perPage+req.query.perPage);
            } else {
                toReturn =array.slice(0,req.query.perPage);
            }
        }

        let finalArray = [];
        produceFoodItem(toReturn,finalArray,0,req,res);
    }).catch((err) => {
            res.status(200).send(err);
    });
}