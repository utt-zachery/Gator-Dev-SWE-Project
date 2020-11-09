import FoodBank from "../models/foodBankModel.js";

//View all foodbanks
export const viewFoodBanks = async (req, res) => {
    await FoodBank.find({}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });
         res.json(data);
         console.log(data._id);
      });
};

//Create a foodBank
export const addFoodBank = async (req, res) => {
    const foodBankData = req.body;

    if (!foodBankData) {
        return res.status(200).send({
          error: "Request data not found",
        });
      }
      
    
    await FoodBank.find({
      name: req.body.name,
      address: req.body.address
    }).then((footballClub) => {

      if (!footballClub) {
        const newTuple = new FoodBank({
          name: req.body.name,
          address: req.body.address,
          longitude: req.body.longitude,
          latitude: req.body.latitude
        });
    
        await new FoodBank(foodBankData).save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(200).send(err);
        });
      } else {
        res.status(200).send("Foodbank Already Exists!");
      }

    });
    
}