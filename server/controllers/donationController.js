import Donation from '../models/donationModel.js'
import FoodItem from '../models/foodModel.js'

export const resolveFoodItems = async(data, req, res) => {
    let donations = [];
    for (let i =0; i < data.length; i++) {
        await FoodItem.findById(data[i].foodItemID).then((foodItem)=> {
            let arrayItem = {
                quantity: data[i].quantity,
                donationDate: data[i].donationDate,
                foodItem: foodItem
            }
            donations.push(arrayItem);

            if (i == data.length -1)
            res.send(donations);
        }).catch((err) => {
            res.write(200).send(err);
        });
    }
};

export const viewDonations = async(req, res) => {
    if (!req.query || !req.query.userID) {
        if (!req.body) {
            return res.status(200).send({
                message:  "Please include a query string",
            });
        } else if (!req.body.userID) {
            return res.status(200).send({
                message:  "Please include a userID as a query element",
            });
        }
    }

    await Donation.find({userID: req.query.userID}).sort({"donationDate": -1}).then((data) => {
        return resolveFoodItems(data, req, res);
    }).catch((err) => {
        return res.status(200).send({
            message:  err
        });
    });
}