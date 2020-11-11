import Order from '../models/orderModel.js'
import ItemOrder from '../models/itemOrder.js'
import FoodInventory from '../models/foodInventory.js'

export const deleteItem = async (foodInventoryID, req, res) => {
    await FoodInventory.deleteOne({_id: foodInventoryID}).catch((err) => {
        res.status(200).send(err);
    })
}

export const updateItem = async (foodInventoryID, newVal, req, res) => {
    console.log("will update!: " + foodInventoryID + " " + newVal);
    await FoodInventory.update({_id: foodInventoryID}, {quantity: newVal}).then((data)=>{
        console.log("updated!");
    }).catch((err) => {
        res.status(200).send(err);
    })
}

export const processItems = async(toDelete, toUpdate, req, res) => {
    for (let i =0; i < toDelete.length; i++) {
        await deleteItem(toDelete[i], req, res);
    }
    for (let i =0; i < toUpdate.length; i++) {
        await updateItem(toUpdate[i].id, toUpdate[i].quantity, req, res);
    }
}

export const reduceItemAvailability = async (orderID, index, req, res) => {
    let now = Date.now();
    await FoodInventory.find({foodBankID: req.body.foodBankID, foodItemID: req.body.order[index].foodItemID, checkIn:true, expirationEpoch: {$gt:now }}).sort({expirationEpoch: 1}).then((data) =>{
       
        let quantityRemaining = req.body.order[index].quantity;
        let toDelete = [];
        let toUpdate = [];
        let locations = [];
        for (let i=0; i < data.length; i++) {
            if (data[i].quantity > quantityRemaining) {
                
                let updateContract = {
                    id: data[i]._id,
                    quantity:  data[i].quantity- quantityRemaining
                };
                quantityRemaining = 0;
                toUpdate.push(updateContract);
                locations.push(data[i].location);
                break;
            } else {
                quantityRemaining = quantityRemaining- data[i].quantity;
                toDelete.push(data[i]._id);
                locations.push(data[i].location);
            }
        }

        if (quantityRemaining == 0 ) {
            processItems(toDelete, toUpdate, req, res);
        } else {
           return res.status(200).json({msg: "Inventory contains insufficent items to complete order"});
        }
        
        placeItemOrder(orderID, locations, index, req, res);

    }).catch((err) => {
        console.log("3");
       return res.status(200).send(error);
    });

}

export const placeItemOrder = async (orderID, locations, index, req, res) => {
    let toSave = {
        foodItemID: req.body.order[index].foodItemID,
        quantity:  req.body.order[index].quantity,
        orderModelID: orderID,
        foodBankID: req.body.foodBankID,
        locations:locations
    }

    await new ItemOrder(toSave).save().then((data) => {
        if (index == req.body.order.length -1) {
            return res.json({orderID: orderID});
        } else {
            reduceItemAvailability(orderID, index+1, req, res);
        }
    }).catch((err)=> {
        console.log("2");
        res.status(200).send(err);
    })
}

export const checkOut = async (req, res) => {
    if (!req.body || !req.body.order || !req.body.foodBankID || !req.body.userID) {
        return res.status(200).send({msg: "Requires an order object,foodBankID, and userID within the POST body"});
    }

    /*
        Structure
        [
            order {
                foodItemID: 5faa2700fca7a720d00e9741,
                quantity: 10
            }
        ]
    */
        if (req.body.order.length == 0) {
            res.send("[]");
        }
   let now = Date.now();
    let toSave = {
        bagState: 0,
        placedBy: req.body.userID,
        orderTime: now,
        foodBankID: req.body.foodBankID 
    };

    await new Order(toSave).save().then((data) => {
        reduceItemAvailability(data._id, 0, req, res);
    }).catch((error) => {
        console.log("1");
        res.status(200).send(error);
    });
    

}