import FoodItem from "../models/foodModel.js"


//Donate Item to a foodbank
export const donateItem = async (req, res) => {

    const body = req.body;
    if (!body || !body.barcode ||!body.expiration) {
        return res.status(200).send({
          error: "Request missing data!",
        });
    }

    await FoodItem.findOne({ barcode: body.barcode}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });

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
              
                const toAdd = new FoodItem(tupleAdd).save();
                console.log("\tAdded Food Item: " + body.itemName);
                res.status(200).send(tupleAdd);
          } else {
                
                console.log("\tItem successfully found in FoodItem!");
                console.log(data._id);
          }

         
      });
};