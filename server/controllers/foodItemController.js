import FoodItem from "../models/foodModel.js"



const updateInventory = async (foodID, req, res) => {
    
}

//Donate Item to a foodbank
export const donateItem = async (req, res) => {

    const body = req.body;
    if (!body || !body.barcode ||!body.expiration || !body.userID ||body.foodBankID) {
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
                    updateInventory(foodItemTuple._id, req, res);
                });
          } else {
                console.log("\tItem successfully found in FoodItem!");
                updateInventory(data._id, req, res);
          }

         
      });
};