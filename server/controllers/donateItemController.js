import FoodItem from "../models/foodModel.js"
import Donation from "../models/donationModel.js"
import FoodInventory from "../models/foodInventory.js"

export const updateInventory= async (donationCode, foodID, req, res) => {
    console.log("\tUpdating inventory for foodbank: " + req.body.foodBankID);
    await new FoodInventory({
        expirationEpoch: req.body.expiration,
        quantity: req.body.quantity,
        foodItemID: foodID,
        foodBankID: req.body.foodBankID,
        donationID: donationCode,
        checkIn: false
    }).save().then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(200).send(err);
      });
}

export const updateDonationLog = async (foodID, req, res) => {
    console.log("\tUpdating the donation history for user: " + req.body.userID);
    await new Donation({
        userID: req.body.userID,
        quantity: req.body.quantity,
        foodItemID: foodID,
        donationDate: Date.now()
    }).save().then((data) => {
        updateInventory(data._id, foodID, req, res);
      })
      .catch((err) => {
        res.status(200).send(err);
      });
}

//Donate Item to a foodbank
export const donateItem = async (req, res) => {

    const body = req.body;
    if (!body || !body.barcode ||!body.expiration || !body.userID || !body.foodBankID || !body.quantity) {
        if (!body) {
            return res.status(200).send({
            error: "Missing body in request body!",
            });
        } else  if (!body.barcode) {
            return res.status(200).send({
            error: "Missing barcodre in request body!",
            });
        } else  if (!body.expiration) {
            return res.status(200).send({
            error: "Missing expiration in request body!",
            });
        } else  if (!body.userID) {
            return res.status(200).send({
            error: "Missing userID in request body!",
            });
        } else if (!body.foodBankID) {
            return res.status(200).send({
            error: "Missing foodbankID in request body!",
            });
        } else if (!body.quantity) {
            return res.status(200).send({
            error: "Missing quantity in request body!",
            });
        }
    }

    await FoodItem.findOne({ barcode: body.barcode}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });

          let foodBankID = "";

          if (!data) {
            console.log("\tItem not found in FoodItem!");
            let tupleAdd = {};
                if (body.hasNutrition && !body.hasImage) {
                     tupleAdd = {
                        barcode: body.barcode,
                        itemName: body.itemName,
                        hasNutrition: true,
                        itemNutrition: body.itemNutrition,
                        itemNutritionLabel: body.itemNutritionLabel,
                        hasImage: false
                    };
                } else if (body.hasNutrition && body.hasImage) {
                     tupleAdd = {
                        barcode: body.barcode,
                        itemName: body.itemName,
                        hasNutrition: true,
                        itemNutrition: body.itemNutrition,
                        itemNutritionLabel: body.itemNutritionLabel,
                        hasImage: true,
                        imageAddress: body.imageAddress
                    };
                } else if (!body.hasNutrition && body.hasImage) {
                     tupleAdd = {
                        barcode: body.barcode,
                        itemName: body.itemName,
                        hasNutrition: false,
                        hasImage: true,
                        imageAddress: body.imageAddress
                    };
                } else if (!body.hasNutrition && !body.hasImage) {
                     tupleAdd = {
                        barcode: body.barcode,
                        itemName: body.itemName,
                        hasNutrition: false,
                        hasImage: false
                    };
                }
              
                const toAdd = new FoodItem(tupleAdd).save().then((foodItemTuple) => {
                    console.log("\tAdded Food Item: " + body.itemName);
                    updateDonationLog(foodItemTuple._id, req, res);
                }).catch((err)=> {
                    res.status(200).send({
                        message: err.message || "An unknown error occurred",
                      });
                });
          } else {
                console.log("\tItem successfully found in FoodItem!");
                if (data.hasNutrition == false && body.hasNutrition == true && (body.hasImage == data.hasImage )) {
                    console.log("\tUpdating nutrition");
                    data.updateOne({hasNutrition: true, itemNutrition: body.itemNutrition, itemNutritionLabel: body.itemNutritionLabel}).then((data2) => {
                        updateDonationLog(data._id, req, res);
                    })
                }

                else if (data.hasImage == false && body.hasImage == true && (body.hasNutrition == data.hasNutrition)) {
                    console.log("\tUpdating image");
                    data.updateOne({hasImage: true,imageAddress: body.imageAddress}).then((data2) => {
                        updateDonationLog(data._id, req, res);
                    }).catch((err)=> {
                        res.status(200).send({
                            message: err.message || "An unknown error occurred",
                          });
                    });
                }

                else if (data.hasImage == false && body.hasImage == true && body.hasNutrition == true && data.hasNutrition == false) {
                    console.log("\tUpdating both image and nutrition");
                    data.updateOne({hasNutrition: true, itemNutrition: body.itemNutrition, itemNutritionLabel: body.itemNutritionLabel, hasImage: true,imageAddress: body.imageAddress}).then((data2) => {
                        updateDonationLog(data._id, req, res);
                    }).catch((err)=> {
                        res.status(200).send({
                            message: err.message || "An unknown error occurred",
                          });
                    });
                }
                else {
                    console.log("\tUpdating no attributes of the FoodItem");
                    updateDonationLog(data._id, req, res);
                }
          }

         
      });
};