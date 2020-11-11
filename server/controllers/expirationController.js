import FoodInventory from "../models/foodInventory.js"

export const findExpired = async(req, res) => {

    if (!req.query || !req.query.foodBankID) {
        return res.status(200).send({
            error: "Missing foodBankID in query string",
        });
    }

    let now = Date.now();
    await FoodInventory.find({foodBankID: req.query.foodBankID, expirationEpoch:{$lt: now}}).then((data)=>{
        res.json(data);
    }).catch((error)=>{
        return res.status(200).send(error);
    });
}