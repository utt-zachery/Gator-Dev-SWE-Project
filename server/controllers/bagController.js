import ItemOrder from '../models/itemOrder.js'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import FoodItem from '../models/foodModel.js'

export const bagItems = async(req, res) => {
   if (!req.body || !req.body.orderID) {
        return res.status(200).send({msg: "Needs a body OrderID parameter"});
   } else {
        await Order.updateOne({_id: req.body.orderID},{bagState: 1}).then((msg) => {
            res.json(msg);
        }).catch((err) => {
            res.status(200).send(err);
        })

   }
}

export const pickUpItems = async(req, res) => {
    if (!req.body || !req.body.orderID) {
         return res.status(200).send({msg: "Needs a body OrderID parameter"});
    } else {
         await Order.updateOne({_id: req.body.orderID},{bagState: 2}).then((msg) => {
             //TODO: HOOK FOR sending Order Ready emails
             res.json(msg);
         }).catch((err) => {
             res.status(200).send(err);
         })
 
    }
 }

export const generateFoodDetails = async(data, req, res) => {
    let finalArray = [];
    for (let i=0; i < data.length; i++) {
        let miniArray = [];
        for (let a=0; a< data[i].orderItems.length; a++) {
            await FoodItem.findById(data[i].orderItems[a].foodItemID).then((foodData) => {
                let miniObject = {
                    quantity: data[i].orderItems[a].quantity,
                    locations: data[i].orderItems[a].locations,
                    foodData: foodData
                };
                miniArray.push(miniObject);

                if (a == data[i].orderItems.length-1) {
                    let toPush = {
                        orderTime: data[i].orderTime,
                        placedBy: data[i].placedBy,
                        orderID: data[i].orderID,
                        orderItems: miniArray
                    }
                    finalArray.push(toPush);
                }

                if (a == data[i].orderItems.length-1 && i== data.length -1) {
                    
                    return res.json(finalArray);
                }
            }).catch((err)=>{
                return res.status(200).send(err);
            });
        }
    }
}

export const generateUserDetails = async(data, req, res) => {

    let middleArray = [];
    for (let i=0; i < data.length; i++) {
        await User.findById(data[i].placedBy).then((user) => {
            let toAdd = {
                orderID: data[i].orderID,
                orderTime: data[i].orderTime,
                placedBy: {name: user.name, email: user.email},
                orderItems: data[i].orderItems,
            };
            middleArray.push(toAdd);

            if (i==data.length -1) {
                generateFoodDetails(middleArray, req, res);
            }
           
        }).catch((err)=>{
            return res.status(200).send(err);
        })
        
    }
}

export const generateOrderDetails = async(data, req, res) => {
    let toReturn = [];
   
    for (let i=0; i < data.length; i++) {

        await ItemOrder.find({orderModelID: data[i]._id}).then((newData) => {
            if (newData.length>0 ) {
                let detailedOrder = {
                    orderID: data[i]._id,
                    orderTime: data[i].orderTime,
                    placedBy: data[i].placedBy,
                    orderItems: newData
                };
               
                toReturn.push(detailedOrder);
            }
            if (i== data.length -1) {
                generateUserDetails(toReturn, req, res);
            } 
        }).catch((err) => {
            res.status(200).send(err);
        });
    }
}

export const viewOutstandingOrders = async(req, res) => {
    if (!req.query || !req.query.foodBankID) {
        return res.status(200).send({msg: "Missing required foodBankID query paramater"});
    }

    await Order.find({foodBankID: req.query.foodBankID, bagState: 0}).sort({orderTime: 1}).then((data) => {
        if (!data || data.length == 0) {
           return res.send("[]");
        }
        generateOrderDetails(data, req, res);
    })
}

export const viewReadyForPickup = async(req, res) => {
    if (!req.query || !req.query.foodBankID) {
        return res.status(200).send({msg: "Missing required foodBankID query paramater"});
    }

    await Order.find({foodBankID: req.query.foodBankID, bagState: 1}).sort({orderTime: 1}).then((data) => {
        if (!data || data.length == 0) {
           return res.send("[]");
        }
        generateOrderDetails(data, req, res);
    })
}